/**
 * Verilog Checker - Lightweight in-browser Verilog parser and simulator.
 * Supports:
 * - Comments (// and /* * /)
 * - ANSI and non-ANSI module declarations
 * - Multi-bit signals and bit-indexing (e.g. [1:0] sel, d[0], sel[1], in[0], out[3])
 * - Multi-bit LHS assignments (e.g. out[0] = ... or out = ...)
 * - Multi-bit concatenation {a, b} in expressions and case statements
 * - Multi-line assign statements
 * - Continuous assignments (assign y = ...)
 * - Gate primitives (and, or, not, nand, nor, xor, xnor)
 * - always @(*) blocks with nested begin/end, if/else, case/endcase (with default), =, <=
 * - always @(posedge clk) and always @(posedge clk or posedge rst)
 * - Bitwise operators, ternary ?: , literals 1'b0, 1'b1, 2'b00, 4'b0000, etc.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VerilogChecker = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Strip single-line and multi-line comments while preserving lines
  function stripComments(code) {
    return code.replace(/\/\*[\s\S]*?\*\//g, function (match) {
      return match.replace(/[^\n]/g, ' ');
    }).replace(/\/\/[^\n]*/g, '');
  }

  // Tokenize basic expression into tokens
  function tokenizeExpr(exprStr) {
    var regex = /\s*(1'b[01]|2'b[01]{2}|3'b[01]{3}|4'b[01]{4}|[0-9]+|[a-zA-Z_][a-zA-Z0-9_]*(?:\[\s*[0-9]+\s*\])?|&&|\|\||===|!==|==|!=|<=|>=|~&|~\||\^~|~\^|\^|~|&|\||!|\?|:|\(|\)|\{|\}|,)\s*/g;
    var tokens = [];
    var match;
    var lastIndex = 0;
    while ((match = regex.exec(exprStr)) !== null) {
      if (match.index > lastIndex) {
        var unparsed = exprStr.substring(lastIndex, match.index).trim();
        if (unparsed) {
          throw new Error("Unexpected token in expression: '" + unparsed + "'");
        }
      }
      tokens.push(match[1]);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < exprStr.length) {
      var remaining = exprStr.substring(lastIndex).trim();
      if (remaining) {
        throw new Error("Unexpected token in expression: '" + remaining + "'");
      }
    }
    return tokens;
  }

  // Operator precedence
  var BINARY_OPS = {
    '*': 6, '/': 6, '%': 6,
    '+': 5, '-': 5,
    '==': 4, '!=': 4, '<': 4, '<=': 4, '>': 4, '>=': 4,
    '&': 3, '~&': 3,
    '^': 2, '^~': 2, '~^': 2,
    '|': 1, '~|': 1,
    '&&': 0.8,
    '||': 0.5,
    '?': 0.2
  };

  function parseExprAst(tokens) {
    var index = 0;

    function peek() {
      return tokens[index];
    }
    function consume(expected) {
      var t = tokens[index++];
      if (expected && t !== expected) {
        throw new Error("Expected '" + expected + "' but got '" + t + "'");
      }
      return t;
    }

    function parsePrimary() {
      var token = consume();
      if (!token) throw new Error("Unexpected end of expression");

      if (token === '(') {
        var node = parseTernary();
        consume(')');
        return node;
      }

      // Concatenation: {a, b, ...}
      if (token === '{') {
        var concatParts = [];
        if (peek() !== '}') {
          concatParts.push(parseTernary());
          while (peek() === ',') {
            consume(',');
            concatParts.push(parseTernary());
          }
        }
        consume('}');
        return {
          eval: function (ctx) {
            var combined = 0;
            for (var c = 0; c < concatParts.length; c++) {
              var val = concatParts[c].eval(ctx);
              combined = (combined << 1) | (val & 1);
            }
            return combined;
          }
        };
      }

      if (token === '~' || token === '!') {
        var operand = parsePrimary();
        return {
          eval: function (ctx) {
            var val = operand.eval(ctx);
            if (token === '!') return val === 0 ? 1 : 0;
            return val ? 0 : 1;
          }
        };
      }

      // Bit literal: 1'b0, 2'b10, 4'b0001
      if (/^[0-9]+'b[01]+$/.test(token)) {
        var bits = token.split("'b")[1];
        var val = parseInt(bits, 2);
        return { eval: function () { return val; } };
      }
      // Numeric decimal
      if (/^[0-9]+$/.test(token)) {
        var num = parseInt(token, 10);
        return { eval: function () { return num; } };
      }

      // Signal or bit select: e.g. "a", "sel[1]", "d[0]", "in[2]"
      var sigMatch = token.match(/^([a-zA-Z_][a-zA-Z0-9_]*)(?:\[\s*([0-9]+)\s*\])?$/);
      if (sigMatch) {
        var name = sigMatch[1];
        var bitIdx = sigMatch[2] !== undefined ? parseInt(sigMatch[2], 10) : null;
        return {
          eval: function (ctx) {
            var foundKey = null;
            if (name in ctx) {
              foundKey = name;
            } else {
              var lower = name.toLowerCase();
              for (var k in ctx) {
                if (k.toLowerCase() === lower) {
                  foundKey = k;
                  break;
                }
              }
            }
            if (foundKey === null) {
              throw new Error("Unknown signal '" + name + "' in expression");
            }
            var sigVal = ctx[foundKey] || 0;
            if (bitIdx !== null) {
              return (sigVal >> bitIdx) & 1;
            }
            return sigVal;
          }
        };
      }

      throw new Error("Cannot parse expression token: '" + token + "'");
    }

    function parseBinary(minPrec) {
      var left = parsePrimary();

      while (index < tokens.length) {
        var op = peek();
        if (op === '?' || op === ':' || op === ')' || op === '}' || op === ',' || !BINARY_OPS[op] || BINARY_OPS[op] < minPrec) {
          break;
        }
        consume(); // op
        var nextPrec = BINARY_OPS[op] + 0.1;
        var right = parseBinary(nextPrec);

        (function (currentLeft, currentOp, currentRight) {
          left = {
            eval: function (ctx) {
              var l = currentLeft.eval(ctx);
              var r = currentRight.eval(ctx);
              switch (currentOp) {
                case '&': return l & r;
                case '|': return l | r;
                case '^': return (l ^ r) & 1;
                case '~&': return (~(l & r)) & 1;
                case '~|': return (~(l | r)) & 1;
                case '^~':
                case '~^': return (~(l ^ r)) & 1;
                case '==': return l === r ? 1 : 0;
                case '!=': return l !== r ? 1 : 0;
                case '&&': return (l && r) ? 1 : 0;
                case '||': return (l || r) ? 1 : 0;
                default: throw new Error("Unsupported operator: " + currentOp);
              }
            }
          };
        })(left, op, right);
      }
      return left;
    }

    function parseTernary() {
      var cond = parseBinary(0);
      if (peek() === '?') {
        consume('?');
        var trueBranch = parseTernary();
        consume(':');
        var falseBranch = parseTernary();
        return {
          eval: function (ctx) {
            return cond.eval(ctx) ? trueBranch.eval(ctx) : falseBranch.eval(ctx);
          }
        };
      }
      return cond;
    }

    return parseTernary();
  }

  function evaluateExpression(exprStr, context) {
    var str = exprStr.trim();
    if (!str) return 0;
    return parseExprAst(tokenizeExpr(str)).eval(context);
  }

  // Parse Verilog code and return a compiled module object
  function parseVerilog(rawCode) {
    if (!rawCode || !rawCode.trim()) {
      throw new Error("No code provided. Please enter your Verilog module.");
    }

    var cleanCode = stripComments(rawCode);

    if (!/\bendmodule\b/.test(cleanCode)) {
      throw new Error("Syntax Error: Missing 'endmodule' keyword at the end of the module.");
    }

    var moduleMatch = cleanCode.match(/\bmodule\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\(([\s\S]*?)\))?\s*;/);
    if (!moduleMatch) {
      throw new Error("Syntax Error: Valid 'module <name>(...);' declaration not found.");
    }

    var moduleName = moduleMatch[1];
    var portListStr = moduleMatch[2] || "";
    var body = cleanCode.substring(cleanCode.indexOf(moduleMatch[0]) + moduleMatch[0].length);
    var endmoduleIdx = body.search(/\bendmodule\b/);
    if (endmoduleIdx === -1) {
      throw new Error("Syntax Error: Missing 'endmodule'");
    }
    var moduleBody = body.substring(0, endmoduleIdx);

    var ports = [];
    var portsByName = {};

    function addPort(name, direction, width, msb, lsb, isReg) {
      name = name.trim();
      if (!name) return;
      var port = {
        name: name,
        direction: direction,
        width: width || 1,
        msb: msb || 0,
        lsb: lsb || 0,
        isReg: !!isReg
      };
      if (portsByName[name]) {
        if (direction) portsByName[name].direction = direction;
        if (width && width > 1) {
          portsByName[name].width = width;
          portsByName[name].msb = msb;
          portsByName[name].lsb = lsb;
        }
        if (isReg) portsByName[name].isReg = true;
      } else {
        ports.push(port);
        portsByName[name] = port;
      }
    }

    function parseRange(rangeStr) {
      if (!rangeStr) return { width: 1, msb: 0, lsb: 0 };
      var m = rangeStr.match(/\[\s*([0-9]+)\s*:\s*([0-9]+)\s*\]/);
      if (m) {
        var msb = parseInt(m[1], 10);
        var lsb = parseInt(m[2], 10);
        return { width: Math.abs(msb - lsb) + 1, msb: msb, lsb: lsb };
      }
      return { width: 1, msb: 0, lsb: 0 };
    }

    // Parse ANSI ports
    var hasAnsiPorts = /\b(input|output)\b/.test(portListStr);
    if (hasAnsiPorts) {
      var portDecls = portListStr.split(',');
      var currentDir = 'input';
      var currentRange = { width: 1, msb: 0, lsb: 0 };
      var currentIsReg = false;

      for (var i = 0; i < portDecls.length; i++) {
        var pdecl = portDecls[i].trim();
        if (!pdecl) continue;
        var pMatch = pdecl.match(/^(input|output)?\s*(reg|wire)?\s*(\[\s*[0-9]+\s*:\s*[0-9]+\s*\])?\s*([a-zA-Z_][a-zA-Z0-9_]*)$/);
        if (pMatch) {
          if (pMatch[1]) currentDir = pMatch[1];
          currentIsReg = (pMatch[2] === 'reg');
          if (pMatch[3]) {
            currentRange = parseRange(pMatch[3]);
          } else if (pMatch[1]) {
            currentRange = { width: 1, msb: 0, lsb: 0 };
          }
          var pName = pMatch[4];
          addPort(pName, currentDir, currentRange.width, currentRange.msb, currentRange.lsb, currentIsReg);
        } else {
          throw new Error("Syntax Error in port declaration: '" + pdecl + "'");
        }
      }
    } else {
      // Non-ANSI ports
      var headerNames = portListStr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      for (var h = 0; h < headerNames.length; h++) {
        addPort(headerNames[h], 'input', 1, 0, 0, false);
      }

      var dirRegex = /\b(input|output)\s*(reg|wire)?\s*(\[\s*[0-9]+\s*:\s*[0-9]+\s*\])?\s*([^;]+);/g;
      var dMatch;
      while ((dMatch = dirRegex.exec(moduleBody)) !== null) {
        var dDir = dMatch[1];
        var dIsReg = (dMatch[2] === 'reg');
        var dRange = parseRange(dMatch[3]);
        var dNames = dMatch[4].split(',').map(function (s) { return s.trim(); });
        for (var j = 0; j < dNames.length; j++) {
          addPort(dNames[j], dDir, dRange.width, dRange.msb, dRange.lsb, dIsReg);
        }
      }
      var regRegex = /\breg\s*(\[\s*[0-9]+\s*:\s*[0-9]+\s*\])?\s*([^;]+);/g;
      var rMatch;
      while ((rMatch = regRegex.exec(moduleBody)) !== null) {
        var rRange = parseRange(rMatch[1]);
        var rNames = rMatch[2].split(',').map(function (s) { return s.trim(); });
        for (var k = 0; k < rNames.length; k++) {
          var rName = rNames[k];
          if (portsByName[rName]) {
            portsByName[rName].isReg = true;
            if (rRange.width > 1) {
              portsByName[rName].width = rRange.width;
              portsByName[rName].msb = rRange.msb;
              portsByName[rName].lsb = rRange.lsb;
            }
          }
        }
      }
    }

    // Continuous assigns across multiple lines: assign target = ... ;
    var assigns = [];
    var assignRegex = /\bassign\s+([a-zA-Z_][a-zA-Z0-9_]*(?:\[\s*[0-9]+\s*\])?)\s*=\s*([\s\S]*?);/g;
    var aMatch;
    while ((aMatch = assignRegex.exec(moduleBody)) !== null) {
      assigns.push({
        target: aMatch[1].trim(),
        expr: aMatch[2].trim()
      });
    }

    // Gate primitives: and, or, not, nand, nor, xor, xnor
    // Support multi-line gate declarations and multiple inputs: and g1(y, a, b);
    var gates = [];
    var gateRegex = /\b(and|or|not|nand|nor|xor|xnor)\s+([a-zA-Z_][a-zA-Z0-9_]*)?\s*\(([\s\S]*?)\)\s*;/g;
    var gMatch;
    while ((gMatch = gateRegex.exec(moduleBody)) !== null) {
      var gateType = gMatch[1];
      var gateInst = gMatch[2] || "";
      var gateArgs = gMatch[3].split(',').map(function (s) { return s.trim(); });
      if (gateArgs.length < 2) {
        throw new Error("Syntax Error: Gate primitive '" + gateType + "' requires at least an output and one input.");
      }
      gates.push({
        type: gateType,
        output: gateArgs[0],
        inputs: gateArgs.slice(1)
      });
    }

    // Always blocks
    var alwaysBlocks = [];
    var alwaysRegex = /\balways\s*@\s*\(([\s\S]*?)\)\s*([\s\S]*?)(?=(?:\balways\b|\bassign\b|\b(?:and|or|not|nand|nor|xor|xnor)\b|\bendmodule\b|$))/g;
    var alMatch;
    while ((alMatch = alwaysRegex.exec(moduleBody)) !== null) {
      var sensitivity = alMatch[1].trim();
      var alBlockBody = alMatch[2].trim();
      alwaysBlocks.push({
        sensitivity: sensitivity,
        body: alBlockBody
      });
    }

    // Check for assign statement without ending semicolon
    var nonCommentBody = moduleBody.replace(assignRegex, '').replace(gateRegex, '').replace(alwaysRegex, '');
    var unhandledAssign = nonCommentBody.match(/\bassign\s+[^;]+(?:\n|$)/);
    if (unhandledAssign) {
      throw new Error("Syntax Error: Missing semicolon ';' in assign statement near: " + unhandledAssign[0].trim());
    }

    return {
      moduleName: moduleName,
      ports: ports,
      portsByName: portsByName,
      assigns: assigns,
      gates: gates,
      alwaysBlocks: alwaysBlocks,
      rawCode: rawCode
    };
  }

  // Helper to set value to signal (scalar or bit-select)
  function setTargetValue(target, val, context) {
    var bitMatch = target.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[\s*([0-9]+)\s*\]$/);
    if (bitMatch) {
      var tName = bitMatch[1];
      var bIdx = parseInt(bitMatch[2], 10);
      var curVal = context[tName] || 0;
      if (val & 1) {
        context[tName] = curVal | (1 << bIdx);
      } else {
        context[tName] = curVal & ~(1 << bIdx);
      }
      context[tName.toLowerCase()] = context[tName];
      context[tName.toUpperCase()] = context[tName];
    } else {
      context[target] = val;
      context[target.toLowerCase()] = val;
      context[target.toUpperCase()] = val;
    }
  }

  // Tokenize statement block into control-flow items
  function executeStatements(statementsStr, context) {
    var s = statementsStr.trim();
    if (!s) return;

    // Remove outermost begin...end pair if it encapsulates the whole block
    while (/^begin\b/i.test(s)) {
      var depth = 0;
      var wRegex = /\b(begin|end)\b/gi;
      var wm;
      var endsAt = -1;
      while ((wm = wRegex.exec(s)) !== null) {
        if (wm[1].toLowerCase() === 'begin') depth++;
        else if (wm[1].toLowerCase() === 'end') {
          depth--;
          if (depth === 0) {
            endsAt = wRegex.lastIndex;
            break;
          }
        }
      }
      if (depth === 0 && endsAt === s.length) {
        s = s.substring(5, s.length - 3).trim();
      } else {
        break;
      }
    }

    var i = 0;
    while (i < s.length) {
      while (i < s.length && /\s/.test(s[i])) i++;
      if (i >= s.length) break;

      var sub = s.substring(i);

      // Check IF statement
      var ifMatch = sub.match(/^if\s*\(/);
      if (ifMatch) {
        var openParenIdx = sub.indexOf('(');
        var pDepth = 1;
        var pIdx = openParenIdx + 1;
        while (pIdx < sub.length && pDepth > 0) {
          if (sub[pIdx] === '(') pDepth++;
          else if (sub[pIdx] === ')') pDepth--;
          pIdx++;
        }
        var condExpr = sub.substring(openParenIdx + 1, pIdx - 1);
        var condVal = evaluateExpression(condExpr, context);

        var restAfterCond = sub.substring(pIdx).trim();
        var trueInfo = extractNextUnit(restAfterCond);
        var posAfterTrue = (pIdx) + (sub.substring(pIdx).length - restAfterCond.length) + trueInfo.length;

        var afterTrueStr = s.substring(i + posAfterTrue).trim();
        var falseInfo = null;
        var totalAdvance = posAfterTrue;

        if (/^else\b/.test(afterTrueStr)) {
          var restAfterElse = afterTrueStr.substring(4).trim();
          falseInfo = extractNextUnit(restAfterElse);
          var elseOffset = (s.length - (i + posAfterTrue)) - restAfterElse.length;
          totalAdvance = posAfterTrue + elseOffset + falseInfo.length;
        }

        if (condVal) {
          executeStatements(trueInfo.code, context);
        } else if (falseInfo) {
          executeStatements(falseInfo.code, context);
        }

        i += totalAdvance;
        continue;
      }

      // Check CASE statement
      var caseMatch = sub.match(/^case\s*\(([\s\S]*?)\)/);
      if (caseMatch) {
        var caseExpr = caseMatch[1].trim();
        var endcaseMatch = sub.match(/\bendcase\b/);
        if (!endcaseMatch) {
          throw new Error("Syntax Error: Missing 'endcase'");
        }
        var endcaseIdx = endcaseMatch.index;
        var caseBody = sub.substring(caseMatch[0].length, endcaseIdx);
        var caseVal = evaluateExpression(caseExpr, context);

        executeCaseBranches(caseVal, caseBody, context);
        i += endcaseIdx + 7;
        continue;
      }

      // Assignment: target <= expr; or target = expr;
      var semi = sub.indexOf(';');
      if (semi !== -1) {
        var stmt = sub.substring(0, semi).trim();
        var asgnMatch = stmt.match(/^([a-zA-Z_][a-zA-Z0-9_]*(?:\[\s*[0-9]+\s*\])?)\s*(=|<=)\s*([\s\S]+)$/);
        if (asgnMatch) {
          var target = asgnMatch[1].trim();
          var val = evaluateExpression(asgnMatch[3], context);
          setTargetValue(target, val, context);
          i += semi + 1;
          continue;
        }
      }

      i++;
    }
  }

  function extractNextUnit(str) {
    str = str.trim();
    if (/^begin\b/i.test(str)) {
      var depth = 0;
      var r = /\b(begin|end)\b/gi;
      var m;
      while ((m = r.exec(str)) !== null) {
        if (m[1].toLowerCase() === 'begin') depth++;
        else if (m[1].toLowerCase() === 'end') {
          depth--;
          if (depth === 0) {
            return {
              code: str.substring(0, r.lastIndex),
              length: r.lastIndex
            };
          }
        }
      }
    }

    if (/^if\s*\(/.test(str)) {
      var pDepth = 0;
      var pStart = str.indexOf('(');
      var pIdx = pStart;
      while (pIdx < str.length) {
        if (str[pIdx] === '(') pDepth++;
        else if (str[pIdx] === ')') {
          pDepth--;
          if (pDepth === 0) { pIdx++; break; }
        }
        pIdx++;
      }
      var afterCond = str.substring(pIdx).trim();
      var innerTrue = extractNextUnit(afterCond);
      var posAfterTrue = pIdx + (str.substring(pIdx).length - afterCond.length) + innerTrue.length;
      var rest = str.substring(posAfterTrue).trim();
      if (/^else\b/.test(rest)) {
        var restAfterElse = rest.substring(4).trim();
        var innerFalse = extractNextUnit(restAfterElse);
        var totalLen = (str.length - rest.length) + 4 + (rest.length - 4 - restAfterElse.length) + innerFalse.length;
        return {
          code: str.substring(0, totalLen),
          length: totalLen
        };
      }
      return {
        code: str.substring(0, posAfterTrue),
        length: posAfterTrue
      };
    }

    var semi = str.indexOf(';');
    if (semi !== -1) {
      return {
        code: str.substring(0, semi + 1),
        length: semi + 1
      };
    }
    return { code: str, length: str.length };
  }

  function executeCaseBranches(caseVal, caseBody, context) {
    var regex = /(?:([0-9]+'b[01]+|[0-9]+|\bdefault\b)\s*:)([\s\S]*?)(?=(?:[0-9]+'b[01]+|[0-9]+|\bdefault\b)\s*:|$)/g;
    var match;
    var matched = false;
    var defaultBody = null;

    while ((match = regex.exec(caseBody)) !== null) {
      var label = match[1].trim();
      var branchBody = match[2].trim();

      if (label === 'default') {
        defaultBody = branchBody;
        continue;
      }

      var labelVal = 0;
      if (/^[0-9]+'b[01]+$/.test(label)) {
        labelVal = parseInt(label.split("'b")[1], 2);
      } else {
        labelVal = parseInt(label, 10);
      }

      if (labelVal === caseVal) {
        executeStatements(branchBody, context);
        matched = true;
        break;
      }
    }

    if (!matched && defaultBody) {
      executeStatements(defaultBody, context);
    }
  }

  // Simulate combinational circuit with iterative convergence for structural wires
  function simulateCombinational(parsedModule, inputValues) {
    var context = {};
    for (var inName in inputValues) {
      context[inName] = inputValues[inName];
      context[inName.toLowerCase()] = inputValues[inName];
      context[inName.toUpperCase()] = inputValues[inName];
    }

    for (var i = 0; i < parsedModule.ports.length; i++) {
      var p = parsedModule.ports[i];
      if (p.direction === 'output' && !(p.name in context)) {
        setTargetValue(p.name, 0, context);
      }
    }

    // Iterative evaluation (up to 5 passes) so interconnected structural gates / internal wires settle
    for (var pass = 0; pass < 5; pass++) {
      // 1. Gate primitives
      for (var g = 0; g < parsedModule.gates.length; g++) {
        var gate = parsedModule.gates[g];
        var inVals = gate.inputs.map(function (inName) {
          return evaluateExpression(inName, context);
        });
        var outVal = 0;
        switch (gate.type) {
          case 'and':
            outVal = inVals.reduce(function (a, b) { return a & b; }, 1);
            break;
          case 'or':
            outVal = inVals.reduce(function (a, b) { return a | b; }, 0);
            break;
          case 'not':
            outVal = inVals[0] ? 0 : 1;
            break;
          case 'nand':
            outVal = (inVals.reduce(function (a, b) { return a & b; }, 1)) ? 0 : 1;
            break;
          case 'nor':
            outVal = (inVals.reduce(function (a, b) { return a | b; }, 0)) ? 0 : 1;
            break;
          case 'xor':
            outVal = inVals.reduce(function (a, b) { return (a ^ b) & 1; }, 0);
            break;
          case 'xnor':
            outVal = (inVals.reduce(function (a, b) { return (a ^ b) & 1; }, 0)) ? 0 : 1;
            break;
        }
        setTargetValue(gate.output, outVal, context);
      }

      // 2. Assign statements
      for (var a = 0; a < parsedModule.assigns.length; a++) {
        var asgn = parsedModule.assigns[a];
        var val = evaluateExpression(asgn.expr, context);
        setTargetValue(asgn.target, val, context);
      }

      // 3. always @(*) blocks
      for (var b = 0; b < parsedModule.alwaysBlocks.length; b++) {
        var block = parsedModule.alwaysBlocks[b];
        if (block.sensitivity.indexOf('posedge') === -1) {
          executeStatements(block.body, context);
        }
      }
    }

    return context;
  }

  // Simulate sequential circuit
  function simulateSequential(parsedModule, testSequence) {
    var state = { q: 0 };
    var results = [];

    var dffBlock = null;
    for (var b = 0; b < parsedModule.alwaysBlocks.length; b++) {
      if (parsedModule.alwaysBlocks[b].sensitivity.indexOf('posedge') !== -1) {
        dffBlock = parsedModule.alwaysBlocks[b];
        break;
      }
    }

    if (!dffBlock) {
      throw new Error("Sequential logic error: Missing 'always @(posedge clk ...)' block.");
    }

    for (var s = 0; s < testSequence.length; s++) {
      var stepData = testSequence[s];
      var context = {
        clk: stepData.clk,
        rst: stepData.rst,
        q: state.q
      };
      if ('d' in stepData) context.d = stepData.d;
      if ('j' in stepData) context.j = stepData.j;
      if ('k' in stepData) context.k = stepData.k;

      for (var k in context) {
        context[k.toLowerCase()] = context[k];
        context[k.toUpperCase()] = context[k];
      }

      if (stepData.rst === 1) {
        executeStatements(dffBlock.body, context);
      } else if (stepData.clkEdge === 'posedge' || stepData.clk === 1) {
        executeStatements(dffBlock.body, context);
      }

      var qVal = context.q !== undefined ? context.q : context.Q;
      state.q = (qVal !== undefined) ? (qVal & 1) : 0;

      results.push({
        step: stepData.step || (s + 1),
        inputs: stepData,
        expectedQ: stepData.expectedQ,
        gotQ: state.q,
        passed: state.q === stepData.expectedQ,
        note: stepData.note || ""
      });
    }

    return results;
  }

  // Verify student code
  function checkSolution(userCode, problem) {
    try {
      var parsed = parseVerilog(userCode);

      if (parsed.moduleName.toLowerCase() !== problem.moduleName.toLowerCase()) {
        return {
          status: 'error',
          errorType: 'module_name',
          message: "Module name mismatch: Expected 'module " + problem.moduleName + "', but found 'module " + parsed.moduleName + "'.",
          hint: "Please change the module header to: module " + problem.moduleName + "(...);"
        };
      }

      for (var p = 0; p < problem.requiredPorts.length; p++) {
        var req = problem.requiredPorts[p];
        var actual = null;
        var reqLower = req.name.toLowerCase();

        for (var portName in parsed.portsByName) {
          if (portName.toLowerCase() === reqLower) {
            actual = parsed.portsByName[portName];
            break;
          }
        }

        if (!actual) {
          return {
            status: 'error',
            errorType: 'missing_port',
            message: "Missing required port '" + req.name + "'.",
            hint: "The module must declare " + req.direction + (req.width > 1 ? " [" + (req.width - 1) + ":0] " : " ") + req.name + "."
          };
        }
        if (actual.direction !== req.direction) {
          return {
            status: 'error',
            errorType: 'port_direction',
            message: "Port '" + actual.name + "' has wrong direction: declared as '" + actual.direction + "', expected '" + req.direction + "'.",
            hint: "Change port '" + actual.name + "' to be an " + req.direction + "."
          };
        }
        if (req.width && actual.width !== req.width) {
          return {
            status: 'error',
            errorType: 'port_width',
            message: "Port '" + actual.name + "' has width " + actual.width + ", expected width " + req.width + " (e.g. [" + (req.width - 1) + ":0]).",
            hint: "Declare " + actual.name + " with bus range [" + (req.width - 1) + ":0]."
          };
        }
      }

      // Run tests
      if (problem.type === 'combinational') {
        var testRows = [];
        var allPassed = true;

        for (var t = 0; t < problem.tests.length; t++) {
          var testCase = problem.tests[t];
          var simCtx = simulateCombinational(parsed, testCase.inputs);

          var row = {
            inputs: testCase.inputs,
            expected: testCase.expected,
            got: {},
            passed: true
          };

          for (var outKey in testCase.expected) {
            var expVal = testCase.expected[outKey];
            var gotVal = simCtx[outKey];
            if (gotVal === undefined) {
              gotVal = simCtx[outKey.toLowerCase()];
            }
            if (gotVal === undefined) {
              gotVal = simCtx[outKey.toUpperCase()];
            }
            if (gotVal === undefined) gotVal = 0;

            row.got[outKey] = gotVal;
            if (gotVal !== expVal) {
              row.passed = false;
              allPassed = false;
            }
          }
          testRows.push(row);
        }

        if (allPassed) {
          return {
            status: 'correct',
            message: "Verified - Correct! All test cases passed.",
            testRows: testRows,
            type: 'combinational'
          };
        } else {
          return {
            status: 'wrong',
            message: "Not Correct: Some outputs did not match the expected truth table.",
            testRows: testRows,
            type: 'combinational'
          };
        }

      } else if (problem.type === 'sequential') {
        var seqResults = simulateSequential(parsed, problem.sequence);
        var seqPassed = true;
        for (var s = 0; s < seqResults.length; s++) {
          if (!seqResults[s].passed) {
            seqPassed = false;
            break;
          }
        }

        if (seqPassed) {
          return {
            status: 'correct',
            message: "Verified - Correct! All clock transitions matched.",
            seqResults: seqResults,
            type: 'sequential'
          };
        } else {
          return {
            status: 'wrong',
            message: "Not Correct: State transition mismatch found.",
            seqResults: seqResults,
            type: 'sequential'
          };
        }
      }

      return {
        status: 'error',
        message: "Unknown problem type: " + problem.type
      };

    } catch (err) {
      return {
        status: 'error',
        errorType: 'compile_error',
        message: "Compile Error: " + err.message,
        hint: getFriendlyHint(err.message)
      };
    }
  }

  function getFriendlyHint(msg) {
    if (msg.indexOf('endmodule') !== -1) {
      return "Make sure every module begins with 'module <name>(...);' and closes with 'endmodule'.";
    }
    if (msg.indexOf('semicolon') !== -1) {
      return "Check for missing semicolons (;) at the end of each assign, port, or gate line.";
    }
    if (msg.indexOf('Unknown signal') !== -1) {
      return "Check that your variable names in the expression match the port declarations exactly.";
    }
    return "Check your Verilog syntax against the examples in the Learn tab or Cheat Sheet.";
  }

  return {
    parseVerilog: parseVerilog,
    simulateCombinational: simulateCombinational,
    simulateSequential: simulateSequential,
    checkSolution: checkSolution
  };
}));
