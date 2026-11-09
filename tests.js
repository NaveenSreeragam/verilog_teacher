/**
 * Comprehensive test suite for VerilogChecker and problem solutions.
 * Run with: node tests.js
 */

const VerilogChecker = require('./verilog-checker.js');
const problems = require('./problems.js');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error("  Details:", details);
  }
}

console.log("==========================================");
console.log(" Running Verilog Checker Test Suite");
console.log("==========================================\n");

// 1. Test all official solutions pass
problems.forEach(p => {
  const res = VerilogChecker.checkSolution(p.solutionCode, p);
  assert(res.status === 'correct', `Official Solution for [${p.id}] should pass`, res);
});

// 2. Test AND gate using gate primitive
const andGatePrimitive = `
module and_gate(input a, input b, output y);
  and g1(y, a, b);
endmodule
`;
const andProb = problems.find(p => p.id === 'and_gate');
const andPrimRes = VerilogChecker.checkSolution(andGatePrimitive, andProb);
assert(andPrimRes.status === 'correct', "AND Gate using gate primitive 'and g1(y, a, b);' should pass", andPrimRes);

// 3. Test AND gate without gate instance name: and(y, a, b);
const andNoInst = `
module and_gate(input a, input b, output y);
  and (y, a, b);
endmodule
`;
const andNoInstRes = VerilogChecker.checkSolution(andNoInst, andProb);
assert(andNoInstRes.status === 'correct', "AND Gate primitive without instance name should pass", andNoInstRes);

// 4. Test NOT gate primitive
const notProb = problems.find(p => p.id === 'not_gate');
const notPrimitive = `
module not_gate(input a, output y);
  not n1(y, a);
endmodule
`;
const notPrimRes = VerilogChecker.checkSolution(notPrimitive, notProb);
assert(notPrimRes.status === 'correct', "NOT Gate using gate primitive 'not n1(y, a);' should pass", notPrimRes);

// 5. Test Wrong XOR (e.g. someone using OR '|' instead of '^')
const xorProb = problems.find(p => p.id === 'xor_gate');
const wrongXor = `
module xor_gate(input a, input b, output y);
  assign y = a | b; // Bug: using OR instead of XOR
endmodule
`;
const wrongXorRes = VerilogChecker.checkSolution(wrongXor, xorProb);
assert(wrongXorRes.status === 'wrong', "Wrong XOR (using OR logic) should be flagged as 'wrong'", wrongXorRes);

// 6. Test 4:1 Mux with case statement
const mux4Prob = problems.find(p => p.id === 'mux_4to1');
const mux4Case = `
module mux_4to1(input d0, input d1, input d2, input d3, input [1:0] sel, output reg y);
  always @(*) begin
    case (sel)
      2'b00: y = d0;
      2'b01: y = d1;
      2'b10: y = d2;
      2'b11: y = d3;
      default: y = 1'b0;
    endcase
  end
endmodule
`;
const mux4CaseRes = VerilogChecker.checkSolution(mux4Case, mux4Prob);
assert(mux4CaseRes.status === 'correct', "4:1 Mux using always @(*) and case statement should pass", mux4CaseRes);

// 7. Test 1:2 Demux using ?: ternary operator
const demux2Prob = problems.find(p => p.id === 'demux_1to2');
const demuxTernary = `
module demux_1to2(input d, input sel, output y0, output y1);
  assign y0 = (sel == 1'b0) ? d : 1'b0;
  assign y1 = (sel == 1'b1) ? d : 1'b0;
endmodule
`;
const demuxTernaryRes = VerilogChecker.checkSolution(demuxTernary, demux2Prob);
assert(demuxTernaryRes.status === 'correct', "1:2 Demux using ternary operators should pass", demuxTernaryRes);

// 8. Test D flip-flop with alternative syntax (if-else)
const dffProb = problems.find(p => p.id === 'd_ff');
const dffCorrect = `
module d_ff(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst == 1'b1)
      q <= 1'b0;
    else
      q <= d;
  end
endmodule
`;
const dffRes = VerilogChecker.checkSolution(dffCorrect, dffProb);
assert(dffRes.status === 'correct', "D flip-flop with 'if (rst == 1'b1)' should pass", dffRes);

// 9. Test JK flip-flop with if-else logic instead of case
const jkProb = problems.find(p => p.id === 'jk_ff');
const jkIfElse = `
module jk_ff(input clk, input rst, input j, input k, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst) begin
      q <= 1'b0;
    end else begin
      if (j == 0 && k == 0)
        q <= q;
      else if (j == 0 && k == 1)
        q <= 1'b0;
      else if (j == 1 && k == 0)
        q <= 1'b1;
      else if (j == 1 && k == 1)
        q <= ~q;
    end
  end
endmodule
`;
const jkIfElseRes = VerilogChecker.checkSolution(jkIfElse, jkProb);
assert(jkIfElseRes.status === 'correct', "JK flip-flop using if/else if logic should pass", jkIfElseRes);

// 10. Test Syntax Errors: missing semicolon
const missingSemi = `
module and_gate(input a, input b, output y);
  assign y = a & b
endmodule
`;
const missingSemiRes = VerilogChecker.checkSolution(missingSemi, andProb);
assert(missingSemiRes.status === 'error', "Missing semicolon should report 'error'", missingSemiRes);

// 11. Test Module Name Mismatch
const wrongModName = `
module my_and(input a, input b, output y);
  assign y = a & b;
endmodule
`;
const wrongModRes = VerilogChecker.checkSolution(wrongModName, andProb);
assert(wrongModRes.status === 'error' && wrongModRes.errorType === 'module_name', "Wrong module name should report 'module_name' error", wrongModRes);

// 12. Test Missing Port Error
const missingPort = `
module and_gate(input a, output y);
  assign y = a;
endmodule
`;
const missingPortRes = VerilogChecker.checkSolution(missingPort, andProb);
assert(missingPortRes.status === 'error' && missingPortRes.errorType === 'missing_port', "Missing port 'b' should report 'missing_port' error", missingPortRes);

console.log("\n==========================================");
console.log(` Results: ${passedTests} / ${totalTests} tests passed`);
console.log("==========================================");

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log("All tests completed successfully!");
}

