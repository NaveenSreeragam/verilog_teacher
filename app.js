/**
 * Main application logic for Verilog Basics Lab.
 * Manages tabs, lesson navigation, practice problems, code editing, and rendering checker results.
 */

(function () {
  'use strict';

  // DOM elements
  var navTabs = document.querySelectorAll('.nav-tab-btn');
  var tabPanes = {
    learn: document.getElementById('tab-learn'),
    practice: document.getElementById('tab-practice'),
    cheatsheet: document.getElementById('tab-cheatsheet')
  };

  var learnTopicListEl = document.getElementById('learn-topic-list');
  var learnContentEl = document.getElementById('learn-content');

  var practiceProblemListEl = document.getElementById('practice-problem-list');
  var practiceDetailsEl = document.getElementById('practice-details');
  var codeEditor = document.getElementById('code-editor');

  var btnCheck = document.getElementById('btn-check');
  var btnSolution = document.getElementById('btn-solution');
  var btnReset = document.getElementById('btn-reset');

  var resultBox = document.getElementById('result-box');
  var resultHeader = document.getElementById('result-header');
  var resultMessage = document.getElementById('result-message');
  var resultTableContainer = document.getElementById('result-table-container');
  var resultHintContainer = document.getElementById('result-hint-container');

  var cheatsheetContainer = document.getElementById('cheatsheet-content');

  // State
  var currentLessonIndex = 0;
  var currentProblemId = "and_gate";
  var userCodeCache = {}; // Stores student edits per problem id

  // 1. Tab Switching
  function switchTab(tabName) {
    for (var key in tabPanes) {
      if (tabPanes[key]) {
        tabPanes[key].classList.toggle('active', key === tabName);
      }
    }
    navTabs.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
  }

  navTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // 2. Tab key handling in Textarea (insert 2 spaces instead of losing focus)
  codeEditor.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    }
  });

  // 3. Render Learn Sidebar & Lessons
  function initLearnSection() {
    learnTopicListEl.innerHTML = '';
    window.VerilogLessons.forEach(function (lesson, idx) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.className = 'item-btn' + (idx === currentLessonIndex ? ' active' : '');
      btn.textContent = lesson.title;
      btn.addEventListener('click', function () {
        selectLesson(idx);
      });
      li.appendChild(btn);
      learnTopicListEl.appendChild(li);
    });

    renderCurrentLesson();
  }

  function selectLesson(idx) {
    currentLessonIndex = idx;
    var btns = learnTopicListEl.querySelectorAll('.item-btn');
    btns.forEach(function (b, i) {
      b.classList.toggle('active', i === idx);
    });
    renderCurrentLesson();
  }

  function renderCurrentLesson() {
    var lesson = window.VerilogLessons[currentLessonIndex];
    if (!lesson) return;

    if (lesson.isBasics) {
      learnContentEl.innerHTML = lesson.contentHtml;
      return;
    }

    // Build Truth table HTML
    var truthTableHtml = '';
    if (lesson.truthTable) {
      var ths = lesson.truthTable.headers.map(function (h) { return '<th>' + h + '</th>'; }).join('');
      var trs = lesson.truthTable.rows.map(function (row) {
        var tds = row.map(function (cell) { return '<td>' + cell + '</td>'; }).join('');
        return '<tr>' + tds + '</tr>';
      }).join('');
      truthTableHtml = '<table class="data-table"><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
    }

    var lineByLineHtml = lesson.lineByLine.map(function (line) {
      return '<li>' + line + '</li>';
    }).join('');

    var mistakesHtml = lesson.commonMistakes.map(function (mistake) {
      return '<li>' + mistake + '</li>';
    }).join('');

    var tryPracticeBtnHtml = lesson.practiceId
      ? '<div style="margin-top: 1.5rem;"><button id="btn-goto-practice" class="btn btn-primary">Try it in Practice &rarr;</button></div>'
      : '';

    learnContentEl.innerHTML = `
      <h2>${lesson.title}</h2>
      <p class="lead">${lesson.explanation}</p>

      <h3>Boolean Expression / Symbol</h3>
      <p><code>${lesson.booleanExpr}</code></p>

      <h3>Truth / Characteristic Table</h3>
      ${truthTableHtml}

      <h3>Verilog Implementation (assign / always)</h3>
      <pre><code>${escapeHtml(lesson.verilogCode1)}</code></pre>

      ${lesson.verilogCode2 ? `
        <h3>Alternative / Gate Primitive Style</h3>
        <pre><code>${escapeHtml(lesson.verilogCode2)}</code></pre>
      ` : ''}

      <h3>Line by line Explanation</h3>
      <ol>${lineByLineHtml}</ol>

      <div class="callout callout-warning">
        <div class="callout-title">⚠️ Common Mistakes</div>
        <ul>${mistakesHtml}</ul>
      </div>

      ${tryPracticeBtnHtml}
    `;

    var gotoBtn = document.getElementById('btn-goto-practice');
    if (gotoBtn && lesson.practiceId) {
      gotoBtn.addEventListener('click', function () {
        openPracticeProblem(lesson.practiceId);
      });
    }
  }

  // 4. Render Practice Problems
  function initPracticeSection() {
    practiceProblemListEl.innerHTML = '';
    window.VerilogProblems.forEach(function (prob) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.className = 'item-btn' + (prob.id === currentProblemId ? ' active' : '');
      btn.textContent = prob.title;
      btn.addEventListener('click', function () {
        selectProblem(prob.id);
      });
      li.appendChild(btn);
      practiceProblemListEl.appendChild(li);
    });

    selectProblem(currentProblemId);
  }

  function openPracticeProblem(problemId) {
    switchTab('practice');
    selectProblem(problemId);
  }

  function selectProblem(problemId) {
    // Cache current code before switching
    if (currentProblemId) {
      userCodeCache[currentProblemId] = codeEditor.value;
    }

    currentProblemId = problemId;
    var btns = practiceProblemListEl.querySelectorAll('.item-btn');
    var pIndex = window.VerilogProblems.findIndex(function (p) { return p.id === problemId; });
    btns.forEach(function (b, i) {
      b.classList.toggle('active', i === pIndex);
    });

    var prob = window.VerilogProblems[pIndex];
    if (!prob) return;

    // Render problem details
    practiceDetailsEl.innerHTML = `
      <h2>${prob.title}</h2>
      <p class="lead">${prob.description}</p>
      <div class="callout callout-info" style="margin-bottom: 1rem;">
        <div class="callout-title">Required Module & Port Header:</div>
        <code>${escapeHtml(prob.portDeclarationStr)}</code>
      </div>
    `;

    // Restore cached code or starter template
    codeEditor.value = userCodeCache[prob.id] !== undefined ? userCodeCache[prob.id] : prob.starterCode;

    // Clear result box
    hideResult();
  }

  // Helper to escape HTML characters
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  function hideResult() {
    resultBox.className = 'result-box';
    resultBox.style.display = 'none';
    resultHeader.innerHTML = '';
    resultMessage.innerHTML = '';
    resultTableContainer.innerHTML = '';
    resultHintContainer.innerHTML = '';
  }

  // 5. Verification Trigger & Result Display
  btnCheck.addEventListener('click', function () {
    var prob = window.VerilogProblems.find(function (p) { return p.id === currentProblemId; });
    if (!prob) return;

    var code = codeEditor.value;
    var result = window.VerilogChecker.checkSolution(code, prob);

    displayResult(result);
  });

  btnSolution.addEventListener('click', function () {
    var prob = window.VerilogProblems.find(function (p) { return p.id === currentProblemId; });
    if (!prob) return;
    if (confirm("Show reference solution for " + prob.title + "?")) {
      codeEditor.value = prob.solutionCode;
      userCodeCache[prob.id] = prob.solutionCode;
      hideResult();
    }
  });

  btnReset.addEventListener('click', function () {
    var prob = window.VerilogProblems.find(function (p) { return p.id === currentProblemId; });
    if (!prob) return;
    if (confirm("Reset editor to starter template?")) {
      codeEditor.value = prob.starterCode;
      userCodeCache[prob.id] = prob.starterCode;
      hideResult();
    }
  });

  function displayResult(result) {
    resultBox.style.display = 'block';
    resultBox.className = 'result-box ' + result.status;

    if (result.status === 'correct') {
      resultHeader.innerHTML = '<span>✅ Verified - Correct!</span>';
      resultMessage.textContent = result.message;
      resultHintContainer.innerHTML = '';
    } else if (result.status === 'wrong') {
      resultHeader.innerHTML = '<span>❌ Not Correct</span>';
      resultMessage.textContent = result.message;
      resultHintContainer.innerHTML = '';
    } else if (result.status === 'error') {
      resultHeader.innerHTML = '<span>⚠️ Compile Error</span>';
      resultMessage.textContent = result.message;
      if (result.hint) {
        resultHintContainer.innerHTML = '<div class="result-hint"><strong>Hint:</strong> ' + escapeHtml(result.hint) + '</div>';
      } else {
        resultHintContainer.innerHTML = '';
      }
      resultTableContainer.innerHTML = '';
      return;
    }

    // Render result table
    if (result.type === 'combinational' && result.testRows) {
      renderCombinationalTable(result.testRows);
    } else if (result.type === 'sequential' && result.seqResults) {
      renderSequentialTable(result.seqResults);
    }
  }

  function renderCombinationalTable(rows) {
    if (!rows || rows.length === 0) return;
    var inKeys = Object.keys(rows[0].inputs);
    var outKeys = Object.keys(rows[0].expected);

    var thHtml = inKeys.map(function (k) { return '<th>In: ' + k + '</th>'; }).join('')
               + outKeys.map(function (k) { return '<th>Exp: ' + k + '</th><th>Got: ' + k + '</th>'; }).join('')
               + '<th>Status</th>';

    var trHtml = rows.map(function (row) {
      var inTds = inKeys.map(function (k) { return '<td>' + row.inputs[k] + '</td>'; }).join('');
      var outTds = outKeys.map(function (k) {
        var expVal = row.expected[k];
        var gotVal = row.got[k];
        return '<td>' + expVal + '</td><td>' + gotVal + '</td>';
      }).join('');
      var passTd = '<td>' + (row.passed ? '✓' : '✗ Mismatch') + '</td>';
      return '<tr class="' + (row.passed ? 'row-pass' : 'row-mismatch') + '">' + inTds + outTds + passTd + '</tr>';
    }).join('');

    resultTableContainer.innerHTML = '<table class="res-table"><thead><tr>' + thHtml + '</tr></thead><tbody>' + trHtml + '</tbody></table>';
  }

  function renderSequentialTable(steps) {
    if (!steps || steps.length === 0) return;

    var hasD = 'd' in steps[0].inputs;
    var hasJK = 'j' in steps[0].inputs;

    var extraInTh = hasD ? '<th>D</th>' : (hasJK ? '<th>J</th><th>K</th>' : '');

    var thHtml = '<th>Step</th><th>clk</th><th>rst</th>' + extraInTh + '<th>Expected Q</th><th>Got Q</th><th>Note</th><th>Status</th>';

    var trHtml = steps.map(function (s) {
      var inCells = '';
      if (hasD) inCells += '<td>' + s.inputs.d + '</td>';
      if (hasJK) inCells += '<td>' + s.inputs.j + '</td><td>' + s.inputs.k + '</td>';

      return '<tr class="' + (s.passed ? 'row-pass' : 'row-mismatch') + '">'
           + '<td>' + s.step + '</td>'
           + '<td>' + s.inputs.clk + '</td>'
           + '<td>' + s.inputs.rst + '</td>'
           + inCells
           + '<td>' + s.expectedQ + '</td>'
           + '<td>' + s.gotQ + '</td>'
           + '<td style="font-size:0.8rem; text-align:left;">' + escapeHtml(s.note) + '</td>'
           + '<td>' + (s.passed ? '✓' : '✗') + '</td>'
           + '</tr>';
    }).join('');

    resultTableContainer.innerHTML = '<table class="res-table"><thead><tr>' + thHtml + '</tr></thead><tbody>' + trHtml + '</tbody></table>';
  }

  // 6. Populate Cheat Sheet
  function initCheatSheet() {
    var cheatItems = [
      {
        title: "Verilog Basic Rules",
        code: `// Module syntax
module my_module(input a, input b, output y);
  assign y = a & b;
endmodule

// Literals: 1'b0 (1 bit 0), 2'b10 (2-bit binary 2)
// wire: for assign statements (cannot store)
// reg:  for outputs assigned inside always blocks`
      },
      {
        title: "1. AND Gate",
        code: `// Dataflow
module and_gate(input a, input b, output y);
  assign y = a & b;
endmodule

// Primitive
module and_gate(input a, input b, output y);
  and g1(y, a, b);
endmodule`
      },
      {
        title: "2. OR Gate",
        code: `// Dataflow
module or_gate(input a, input b, output y);
  assign y = a | b;
endmodule

// Primitive
module or_gate(input a, input b, output y);
  or g1(y, a, b);
endmodule`
      },
      {
        title: "3. NOT Gate",
        code: `// Dataflow
module not_gate(input a, output y);
  assign y = ~a;
endmodule

// Primitive
module not_gate(input a, output y);
  not n1(y, a);
endmodule`
      },
      {
        title: "4. NAND Gate",
        code: `// Dataflow
module nand_gate(input a, input b, output y);
  assign y = ~(a & b);
endmodule

// Primitive
module nand_gate(input a, input b, output y);
  nand g1(y, a, b);
endmodule`
      },
      {
        title: "5. NOR Gate",
        code: `// Dataflow
module nor_gate(input a, input b, output y);
  assign y = ~(a | b);
endmodule

// Primitive
module nor_gate(input a, input b, output y);
  nor g1(y, a, b);
endmodule`
      },
      {
        title: "6. XOR Gate",
        code: `// Dataflow
module xor_gate(input a, input b, output y);
  assign y = a ^ b;
endmodule

// Primitive
module xor_gate(input a, input b, output y);
  xor g1(y, a, b);
endmodule`
      },
      {
        title: "7. XNOR Gate",
        code: `// Dataflow
module xnor_gate(input a, input b, output y);
  assign y = ~(a ^ b);
endmodule

// Primitive
module xnor_gate(input a, input b, output y);
  xnor g1(y, a, b);
endmodule`
      },
      {
        title: "8a. 2:1 Multiplexer",
        code: `module mux_2to1(input d0, input d1, input sel, output y);
  assign y = sel ? d1 : d0;
endmodule`
      },
      {
        title: "8b. 4:1 Multiplexer",
        code: `module mux_4to1(input d0, input d1, input d2, input d3, input [1:0] sel, output y);
  assign y = (sel == 2'b00) ? d0 :
             (sel == 2'b01) ? d1 :
             (sel == 2'b10) ? d2 : d3;
endmodule`
      },
      {
        title: "9a. 1:2 Demultiplexer",
        code: `module demux_1to2(input d, input sel, output y0, output y1);
  assign y0 = ~sel & d;
  assign y1 = sel & d;
endmodule`
      },
      {
        title: "9b. 1:4 Demultiplexer",
        code: `module demux_1to4(input d, input [1:0] sel, output y0, output y1, output y2, output y3);
  assign y0 = (sel == 2'b00) ? d : 1'b0;
  assign y1 = (sel == 2'b01) ? d : 1'b0;
  assign y2 = (sel == 2'b10) ? d : 1'b0;
  assign y3 = (sel == 2'b11) ? d : 1'b0;
endmodule`
      },
      {
        title: "10. D Flip-Flop (Async Reset)",
        code: `module d_ff(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst)
      q <= 1'b0;
    else
      q <= d;
  end
endmodule`
      },
      {
        title: "11. JK Flip-Flop (Async Reset)",
        code: `module jk_ff(input clk, input rst, input j, input k, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst)
      q <= 1'b0;
    else begin
      case ({j, k})
        2'b00: q <= q;       // Hold
        2'b01: q <= 1'b0;    // Reset
        2'b10: q <= 1'b1;    // Set
        2'b11: q <= ~q;      // Toggle
      endcase
    end
  end
endmodule`
      }
    ];

    cheatsheetContainer.innerHTML = cheatItems.map(function (item) {
      return `
        <div class="cheat-card">
          <h3>${item.title}</h3>
          <pre><code>${escapeHtml(item.code)}</code></pre>
        </div>
      `;
    }).join('');
  }

  // Initialize
  initLearnSection();
  initPracticeSection();
  initCheatSheet();

})();

