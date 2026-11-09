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

    // Compulsory vs User Variables HTML
    var syntaxBreakdownHtml = '';
    if (lesson.compulsoryElements && lesson.userElements) {
      var compItems = lesson.compulsoryElements.map(function (item) { return '<li>' + item + '</li>'; }).join('');
      var userItems = lesson.userElements.map(function (item) { return '<li>' + item + '</li>'; }).join('');

      syntaxBreakdownHtml = `
        <div class="callout callout-info" style="margin-top: 1.25rem;">
          <div class="callout-title">🔍 Syntax Breakdown: Compulsory Keywords vs. User Variables</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
            <div>
              <strong style="color: #0969da;">Fixed / Compulsory Elements (Reserved by Verilog):</strong>
              <ul style="padding-left: 1.2rem; margin-top: 0.25rem;">${compItems}</ul>
            </div>
            <div>
              <strong style="color: #6a4b00;">User-Named Variables (Customizable):</strong>
              <ul style="padding-left: 1.2rem; margin-top: 0.25rem;">${userItems}</ul>
            </div>
          </div>
        </div>
      `;
    }

    // Three Modeling Styles Display
    var stylesHtml = '';
    if (lesson.styles) {
      var dfCode = lesson.styles.dataflow ? `
        <div style="margin-bottom: 1rem;">
          <h4 style="color: #0969da; margin-bottom: 0.25rem;">1. Dataflow Modeling (using assign)</h4>
          <pre><code>${escapeHtml(lesson.styles.dataflow)}</code></pre>
        </div>` : '';

      var behCode = lesson.styles.behavioral ? `
        <div style="margin-bottom: 1rem;">
          <h4 style="color: #1a7f37; margin-bottom: 0.25rem;">2. Behavioral Modeling (using always procedural block)</h4>
          <pre><code>${escapeHtml(lesson.styles.behavioral)}</code></pre>
        </div>` : '';

      var structCode = lesson.styles.structural ? `
        <div style="margin-bottom: 1rem;">
          <h4 style="color: #6a4b00; margin-bottom: 0.25rem;">3. Structural Modeling (using gate primitives / internal wires)</h4>
          <pre><code>${escapeHtml(lesson.styles.structural)}</code></pre>
        </div>` : '';

      stylesHtml = `
        <div style="margin-top: 1.25rem;">
          <h3>Three Types of Verilog Modeling</h3>
          ${dfCode}
          ${behCode}
          ${structCode}
        </div>
      `;
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

      ${stylesHtml}

      ${syntaxBreakdownHtml}

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

    practiceDetailsEl.innerHTML = `
      <h2>${prob.title}</h2>
      <p class="lead">${prob.description}</p>
      <div class="callout callout-info" style="margin-bottom: 1rem;">
        <div class="callout-title">Required Module & Port Header:</div>
        <pre style="margin: 0.3rem 0; padding: 0.5rem; background:#fff;"><code>${escapeHtml(prob.portDeclarationStr)}</code></pre>
      </div>
    `;

    codeEditor.value = userCodeCache[prob.id] !== undefined ? userCodeCache[prob.id] : prob.starterCode;

    hideResult();
  }

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
        title: "The 3 Modeling Styles Summary",
        code: `// 1. DATAFLOW: assign Y = A & B; (wire output)
// 2. BEHAVIORAL: always @(*) Y = A & B; (output reg Y)
// 3. STRUCTURAL: and g1(Y, A, B); (wires & primitives)`
      },
      {
        title: "1. AND Gate (All 3 Styles)",
        code: `// Dataflow:
assign Y = A & B;

// Behavioral:
always @(*) Y = A & B; // output reg Y;

// Structural:
and g1(Y, A, B);`
      },
      {
        title: "2. OR Gate (All 3 Styles)",
        code: `// Dataflow:
assign Y = A | B;

// Behavioral:
always @(*) Y = A | B; // output reg Y;

// Structural:
or g1(Y, A, B);`
      },
      {
        title: "3. NOT Gate (All 3 Styles)",
        code: `// Dataflow:
assign Y = ~A;

// Behavioral:
always @(*) Y = ~A; // output reg Y;

// Structural:
not n1(Y, A);`
      },
      {
        title: "4. NAND Gate (All 3 Styles)",
        code: `// Dataflow:
assign Y = ~(A & B);

// Behavioral:
always @(*) Y = ~(A & B); // output reg Y;

// Structural:
nand g1(Y, A, B);`
      },
      {
        title: "5. NOR Gate (All 3 Styles)",
        code: `// Dataflow:
assign Y = ~(A | B);

// Behavioral:
always @(*) Y = ~(A | B); // output reg Y;

// Structural:
nor g1(Y, A, B);`
      },
      {
        title: "6. XOR Gate (All 3 Styles)",
        code: `// Dataflow:
assign Y = A ^ B;

// Behavioral:
always @(*) Y = A ^ B; // output reg Y;

// Structural:
xor g1(Y, A, B);`
      },
      {
        title: "7. XNOR Gate (All 3 Styles)",
        code: `// Dataflow:
assign Y = A ~^ B;

// Behavioral:
always @(*) Y = A ~^ B; // output reg Y;

// Structural:
xnor g1(Y, A, B);`
      },
      {
        title: "8. Half Adder (All 3 Styles)",
        code: `// Dataflow:
assign S = A ^ B;
assign C = A & B;

// Behavioral:
always @(*) begin S = A ^ B; C = A & B; end // output reg S, C;

// Structural:
xor g1(S, A, B);
and g2(C, A, B);`
      },
      {
        title: "9. Full Adder (All 3 Styles)",
        code: `// Dataflow:
assign S = A ^ B ^ Cin;
assign Cout = (A & B) | (B & Cin) | (A & Cin);

// Behavioral:
always @(*) begin S = A ^ B ^ Cin; Cout = (A & B) | (B & Cin) | (A & Cin); end

// Structural:
wire w1, w2, w3;
xor g1(w1, A, B);
xor g2(S, w1, Cin);
and g3(w2, w1, Cin);
and g4(w3, A, B);
or  g5(Cout, w2, w3);`
      },
      {
        title: "10. Half Subtractor (All 3 Styles)",
        code: `// Dataflow:
assign Diff = A ^ B;
assign Borrow = ~A & B;

// Behavioral:
always @(*) begin Diff = A ^ B; Borrow = ~A & B; end

// Structural:
wire w1;
xor g1(Diff, A, B);
not g2(w1, A);
and g3(Borrow, w1, B);`
      },
      {
        title: "11. Full Subtractor (All 3 Styles)",
        code: `// Dataflow:
assign Diff = A ^ B ^ Bin;
assign Bout = (~A & B) | (~(A ^ B) & Bin);

// Behavioral:
always @(*) begin Diff = A ^ B ^ Bin; Bout = (~A & B) | (~(A ^ B) & Bin); end

// Structural:
wire w1, w2, w3, notA, w4;
xor g1(w1, A, B);
xor g2(Diff, w1, Bin);
not g3(w2, w1);
and g4(w3, w2, Bin);
not g5(notA, A);
and g6(w4, notA, B);
or  g7(Bout, w3, w4);`
      },
      {
        title: "12. 4:1 Multiplexer (Dataflow & Behavioral)",
        code: `// Dataflow:
assign out = (~s1 & ~s0 & in[0]) | (~s1 & s0 & in[1]) |
             (s1 & ~s0 & in[2])  | (s1 & s0 & in[3]);

// Behavioral:
always @(*) begin
  case ({s1, s0})
    2'b00: out = in[0];
    2'b01: out = in[1];
    2'b10: out = in[2];
    2'b11: out = in[3];
  endcase
end`
      },
      {
        title: "13. 1:4 Demultiplexer (Dataflow & Behavioral)",
        code: `// Dataflow:
assign out[0] = ~s1 & ~s0 & in;
assign out[1] = ~s1 &  s0 & in;
assign out[2] =  s1 & ~s0 & in;
assign out[3] =  s1 &  s0 & in;

// Behavioral:
always @(*) begin
  out = 4'b0000;
  case ({s1, s0})
    2'b00: out[0] = in;
    2'b01: out[1] = in;
    2'b10: out[2] = in;
    2'b11: out[3] = in;
  endcase
end`
      },
      {
        title: "14. D Flip-Flop (Behavioral)",
        code: `module d_ff(clk,rst,d,q);
input clk,rst,d;
output reg q;
always @(posedge clk or posedge rst) begin
  if (rst)
    q <= 1'b0;
  else
    q <= d;
end
endmodule`
      },
      {
        title: "15. JK Flip-Flop (Behavioral)",
        code: `module jk_ff(clk,rst,j,k,q);
input clk,rst,j,k;
output reg q;
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
