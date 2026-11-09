/**
 * Lesson contents for Verilog Basics Lab.
 * Presents all 3 modeling styles:
 * 1. Dataflow Modeling
 * 2. Behavioral Modeling
 * 3. Structural Modeling
 * Covers: Verilog Basics (0), Gates (1-7), Adders & Subtractors (8-11), Multiplexers (12), Demultiplexers (13), Flip-Flops (14-15).
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VerilogLessons = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  var lessons = [
    {
      id: "basics",
      title: "0. Verilog Basics & 3 Modeling Styles",
      isBasics: true,
      contentHtml: `
        <h2>0. Verilog Basics & The 3 Modeling Styles</h2>
        <p class="lead">Welcome! Verilog is a <strong>Hardware Description Language (HDL)</strong> used to design, simulate, and implement digital electronic circuits. In digital design and lab exams, every circuit can be described using <strong>Three Different Modeling Styles</strong>:</p>

        <div class="callout callout-info" style="margin: 1.25rem 0;">
          <div class="callout-title">🏛️ The Three Fundamental Modeling Styles in Verilog</div>
          <ol style="margin-top: 0.5rem; padding-left: 1.2rem;">
            <li><strong>1. Dataflow Modeling (Continuous Assignment):</strong>
              Uses the compulsory <code>assign</code> keyword with Boolean algebra operators (<code>&</code>, <code>|</code>, <code>^</code>, <code>~</code>, etc.). Hardware is described by specifying how data flows directly from inputs to outputs.
              <br><em>Example:</em> <code>assign Y = A & B;</code>
            </li>
            <li style="margin-top: 0.5rem;"><strong>2. Behavioral Modeling (Algorithmic / Procedural):</strong>
              Uses an <code>always @(...)</code> block with procedural statements like <code>if-else</code> or <code>case</code>. The output <strong>must</strong> be declared as <code>reg</code> because it holds state inside procedural blocks.
              <br><em>Example:</em> <code>always @(*) begin Y = A & B; end</code>
            </li>
            <li style="margin-top: 0.5rem;"><strong>3. Structural Modeling (Gate-Level / Interconnection):</strong>
              Explicitly connects built-in primitive gate instances (<code>and</code>, <code>or</code>, <code>not</code>, <code>xor</code>, etc.) or sub-modules using interconnecting <code>wire</code> declarations. This mirrors physical schematic wire connections.
              <br><em>Example:</em> <code>and g1(Y, A, B);</code>
            </li>
          </ol>
        </div>

        <div class="callout callout-warning">
          <div class="callout-title">🔑 Compulsory Reserved Keywords vs. User Variables (Exam Rule)</div>
          <ul>
            <li><strong>Compulsory Fixed Keywords:</strong> <code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>wire</code>, <code>reg</code>, <code>assign</code>, <code>always</code>, <code>begin</code>, <code>end</code>, <code>posedge</code>, <code>case</code>, <code>endcase</code>. Never change or misspell these!</li>
            <li><strong>User-Defined Variables:</strong> Module names (e.g. <code>and_gate</code>, <code>half_adder</code>), port names (e.g. <code>A</code>, <code>B</code>, <code>Y</code>, <code>S</code>, <code>C</code>, <code>clk</code>, <code>rst</code>), and internal wires (e.g. <code>w1</code>, <code>w2</code>).</li>
          </ul>
        </div>

        <h3>wire vs reg Rule</h3>
        <ul>
          <li><strong><code>wire</code>:</strong> Used for <strong>Dataflow</strong> (continuous <code>assign</code>) and <strong>Structural</strong> (connecting gate pins). Cannot store values.</li>
          <li><strong><code>reg</code>:</strong> Required for any output assigned inside a <strong>Behavioral</strong> (<code>always</code>) block.</li>
        </ul>

        <h3>Blocking (<code>=</code>) vs Non-Blocking (<code>&lt;=</code>)</h3>
        <ul>
          <li><strong><code>=</code> (Blocking):</strong> Used in combinational <code>always @(*)</code> blocks.</li>
          <li><strong><code>&lt;=</code> (Non-Blocking):</strong> Used in sequential clocked flip-flops (<code>always @(posedge clk or posedge rst)</code>) to evaluate updates concurrently.</li>
        </ul>
      `
    },
    {
      id: "and_gate",
      title: "1. AND Gate",
      topicId: 1,
      practiceId: "and_gate",
      explanation: "An AND gate outputs 1 if and only if all inputs are 1. If any input is 0, the output Y is 0.",
      booleanExpr: "Y = A & B",
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          [0, 0, 0],
          [0, 1, 0],
          [1, 0, 0],
          [1, 1, 1]
        ]
      },
      styles: {
        dataflow: `module and_gate(Y,A,B);
input A,B;
output Y;
assign Y = A & B;
endmodule`,
        behavioral: `module and_gate(Y,A,B);
input A,B;
output reg Y;
always @(*) begin
  Y = A & B; // or: if (A && B) Y = 1'b1; else Y = 1'b0;
end
endmodule`,
        structural: `module and_gate(Y,A,B);
input A,B;
output Y;
and g1(Y, A, B); // primitive: (output, input1, input2)
endmodule`
      },
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>: Core module structure.",
        "<code>assign</code>: Compulsory in Dataflow.",
        "<code>reg</code> and <code>always @(*)</code>: Compulsory in Behavioral.",
        "<code>and</code>: Built-in gate primitive name in Structural."
      ],
      userElements: [
        "<code>and_gate</code>: Module name.",
        "<code>A, B</code>: Input pins.",
        "<code>Y</code>: Output pin.",
        "<code>g1</code>: Optional gate instance label in Structural."
      ],
      lineByLine: [
        "<code>module and_gate(Y,A,B);</code>: Declares module name and port list.",
        "<code>input A,B; output Y;</code>: Defines port directions.",
        "<strong>Dataflow:</strong> <code>assign Y = A & B;</code> continuously drives Y with bitwise AND of A and B.",
        "<strong>Behavioral:</strong> <code>output reg Y; always @(*) Y = A & B;</code> evaluates procedurally whenever inputs change.",
        "<strong>Structural:</strong> <code>and g1(Y, A, B);</code> instantiates a hardware AND gate where Y is output and A, B are inputs."
      ],
      commonMistakes: [
        "In Structural modeling, placing inputs before output: gate primitives always take output FIRST: <code>and(output, in1, in2);</code>.",
        "Forgetting <code>reg</code> on output Y when writing Behavioral code.",
        "Using <code>&&</code> instead of <code>&</code> for bitwise operations."
      ]
    },
    {
      id: "or_gate",
      title: "2. OR Gate",
      topicId: 2,
      practiceId: "or_gate",
      explanation: "An OR gate outputs 1 if at least one input is 1. It only outputs 0 when all inputs are 0.",
      booleanExpr: "Y = A | B",
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          [0, 0, 0],
          [0, 1, 1],
          [1, 0, 1],
          [1, 1, 1]
        ]
      },
      styles: {
        dataflow: `module or_gate(A,B,Y);
input A,B;
output Y;
assign Y = A | B;
endmodule`,
        behavioral: `module or_gate(A,B,Y);
input A,B;
output reg Y;
always @(*) begin
  Y = A | B;
end
endmodule`,
        structural: `module or_gate(A,B,Y);
input A,B;
output Y;
or g1(Y, A, B); // primitive: (output, input1, input2)
endmodule`
      },
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>.",
        "<code>assign</code> with <code>|</code> in Dataflow.",
        "<code>reg</code> with <code>always @(*)</code> in Behavioral.",
        "<code>or</code> primitive in Structural."
      ],
      userElements: [
        "<code>or_gate</code>: Module identifier.",
        "<code>A, B</code>: Inputs.",
        "<code>Y</code>: Output."
      ],
      lineByLine: [
        "<code>module or_gate(A,B,Y);</code>: Defines module ports.",
        "<strong>Dataflow:</strong> <code>assign Y = A | B;</code> drives Y using bitwise OR.",
        "<strong>Behavioral:</strong> Procedurally assigns Y inside an <code>always @(*)</code> block with <code>output reg Y;</code>.",
        "<strong>Structural:</strong> <code>or g1(Y, A, B);</code> wires built-in OR gate primitive."
      ],
      commonMistakes: [
        "Confusing OR <code>|</code> with XOR <code>^</code>.",
        "Forgetting semicolon after <code>assign</code>."
      ]
    },
    {
      id: "not_gate",
      title: "3. NOT Gate",
      topicId: 3,
      practiceId: "not_gate",
      explanation: "A NOT gate (inverter) inverts its single input: 0 becomes 1, and 1 becomes 0.",
      booleanExpr: "Y = ~A",
      truthTable: {
        headers: ["A", "Y"],
        rows: [
          [0, 1],
          [1, 0]
        ]
      },
      styles: {
        dataflow: `module not_gate(A,Y);
input A;
output Y;
assign Y = ~A;
endmodule`,
        behavioral: `module not_gate(A,Y);
input A;
output reg Y;
always @(*) begin
  Y = ~A;
end
endmodule`,
        structural: `module not_gate(A,Y);
input A;
output Y;
not n1(Y, A); // primitive: (output, input)
endmodule`
      },
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>.",
        "<code>~</code>: Bitwise inversion operator.",
        "<code>not</code>: Gate primitive in Structural."
      ],
      userElements: [
        "<code>not_gate</code>: Module name.",
        "<code>A</code>: Input.",
        "<code>Y</code>: Output."
      ],
      lineByLine: [
        "<code>module not_gate(A,Y);</code>: Single input module header.",
        "<strong>Dataflow:</strong> <code>assign Y = ~A;</code> inverts A continuously.",
        "<strong>Behavioral:</strong> <code>always @(*) Y = ~A;</code> updates procedural reg Y.",
        "<strong>Structural:</strong> <code>not n1(Y, A);</code> invokes hardware inverter primitive."
      ],
      commonMistakes: [
        "Using <code>!</code> instead of <code>~</code>.",
        "Declaring two inputs for a NOT gate."
      ]
    },
    {
      id: "nand_gate",
      title: "4. NAND Gate",
      topicId: 4,
      practiceId: "nand_gate",
      explanation: "A NAND gate is an inverted AND gate: output Y is 0 only when both inputs are 1; otherwise, it is 1.",
      booleanExpr: "Y = ~(A & B)",
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          [0, 0, 1],
          [0, 1, 1],
          [1, 0, 1],
          [1, 1, 0]
        ]
      },
      styles: {
        dataflow: `module nand_gate(A,B,Y);
input A,B;
output Y;
assign Y = ~(A & B);
endmodule`,
        behavioral: `module nand_gate(A,B,Y);
input A,B;
output reg Y;
always @(*) begin
  Y = ~(A & B);
end
endmodule`,
        structural: `module nand_gate(A,B,Y);
input A,B;
output Y;
nand g1(Y, A, B); // primitive: (output, input1, input2)
endmodule`
      },
      compulsoryElements: [
        "<code>assign Y = ~(A & B);</code> in Dataflow.",
        "<code>output reg Y;</code> in Behavioral.",
        "<code>nand g1(Y, A, B);</code> in Structural."
      ],
      userElements: [
        "<code>nand_gate</code>, <code>A</code>, <code>B</code>, <code>Y</code>."
      ],
      lineByLine: [
        "<strong>Dataflow:</strong> Evaluates A & B then negates with <code>~</code>.",
        "<strong>Behavioral:</strong> Computes ~(A & B) procedurally.",
        "<strong>Structural:</strong> Uses built-in <code>nand</code> primitive."
      ],
      commonMistakes: [
        "Missing parentheses: <code>~A & B</code> negates only A!"
      ]
    },
    {
      id: "nor_gate",
      title: "5. NOR Gate",
      topicId: 5,
      practiceId: "nor_gate",
      explanation: "A NOR gate is an inverted OR gate: output Y is 1 only when both inputs are 0; otherwise, it is 0.",
      booleanExpr: "Y = ~(A | B)",
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          [0, 0, 1],
          [0, 1, 0],
          [1, 0, 0],
          [1, 1, 0]
        ]
      },
      styles: {
        dataflow: `module nor_gate(A,B,Y);
input A,B;
output Y;
assign Y = ~(A | B);
endmodule`,
        behavioral: `module nor_gate(A,B,Y);
input A,B;
output reg Y;
always @(*) begin
  Y = ~(A | B);
end
endmodule`,
        structural: `module nor_gate(A,B,Y);
input A,B;
output Y;
nor g1(Y, A, B); // primitive: (output, input1, input2)
endmodule`
      },
      compulsoryElements: [
        "<code>~(A | B)</code> in Dataflow.",
        "<code>nor</code> primitive in Structural."
      ],
      userElements: [
        "<code>nor_gate</code>, <code>A</code>, <code>B</code>, <code>Y</code>."
      ],
      lineByLine: [
        "<strong>Dataflow:</strong> Inverts (A | B).",
        "<strong>Behavioral:</strong> Procedural block assigns ~(A | B).",
        "<strong>Structural:</strong> Built-in <code>nor</code> gate."
      ],
      commonMistakes: [
        "Forgetting parentheses around <code>(A | B)</code>."
      ]
    },
    {
      id: "xor_gate",
      title: "6. XOR Gate",
      topicId: 6,
      practiceId: "xor_gate",
      explanation: "An XOR (Exclusive OR) gate outputs 1 when the inputs differ (one 0 and one 1). If both inputs are equal, output is 0.",
      booleanExpr: "Y = A ^ B",
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          [0, 0, 0],
          [0, 1, 1],
          [1, 0, 1],
          [1, 1, 0]
        ]
      },
      styles: {
        dataflow: `module xor_gate(A,B,Y);
input A,B;
output Y;
assign Y = A ^ B;
endmodule`,
        behavioral: `module xor_gate(A,B,Y);
input A,B;
output reg Y;
always @(*) begin
  Y = A ^ B;
end
endmodule`,
        structural: `module xor_gate(A,B,Y);
input A,B;
output Y;
xor g1(Y, A, B); // primitive: (output, input1, input2)
endmodule`
      },
      compulsoryElements: [
        "<code>^</code>: Bitwise XOR operator in Dataflow/Behavioral.",
        "<code>xor</code> primitive in Structural."
      ],
      userElements: [
        "<code>xor_gate</code>, <code>A</code>, <code>B</code>, <code>Y</code>."
      ],
      lineByLine: [
        "<strong>Dataflow:</strong> Caret <code>^</code> computes exclusive OR.",
        "<strong>Behavioral:</strong> Procedural assignment with <code>output reg Y;</code>.",
        "<strong>Structural:</strong> Built-in <code>xor</code> gate."
      ],
      commonMistakes: [
        "Confusing <code>^</code> with power or exponentiation."
      ]
    },
    {
      id: "xnor_gate",
      title: "7. XNOR Gate",
      topicId: 7,
      practiceId: "xnor_gate",
      explanation: "An XNOR gate outputs 1 when both inputs are equal (both 0 or both 1). It acts as an equality detector.",
      booleanExpr: "Y = A ~^ B  (or Y = ~(A ^ B))",
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          [0, 0, 1],
          [0, 1, 0],
          [1, 0, 0],
          [1, 1, 1]
        ]
      },
      styles: {
        dataflow: `module xnor_gate(A,B,Y);
input A,B;
output Y;
assign Y = A ~^ B; // or assign Y = ~(A ^ B);
endmodule`,
        behavioral: `module xnor_gate(A,B,Y);
input A,B;
output reg Y;
always @(*) begin
  Y = A ~^ B;
end
endmodule`,
        structural: `module xnor_gate(A,B,Y);
input A,B;
output Y;
xnor g1(Y, A, B); // primitive: (output, input1, input2)
endmodule`
      },
      compulsoryElements: [
        "<code>~^</code> or <code>~(A ^ B)</code>.",
        "<code>xnor</code> primitive in Structural."
      ],
      userElements: [
        "<code>xnor_gate</code>, <code>A</code>, <code>B</code>, <code>Y</code>."
      ],
      lineByLine: [
        "<strong>Dataflow:</strong> Uses textbook operator <code>~^</code>.",
        "<strong>Behavioral:</strong> Computes equality in procedural block.",
        "<strong>Structural:</strong> Built-in <code>xnor</code> gate."
      ],
      commonMistakes: [
        "Confusing <code>~^</code> (XNOR) with <code>~&</code> (NAND)."
      ]
    },
    {
      id: "half_adder",
      title: "8. Half Adder",
      topicId: 8,
      practiceId: "half_adder",
      explanation: "A Half Adder adds two 1-bit binary inputs A and B, producing two outputs: Sum (S) and Carry (C). It does not have a carry-in from previous stages.",
      booleanExpr: "Sum: S = A ^ B   |   Carry: C = A & B",
      truthTable: {
        headers: ["A", "B", "S (Sum)", "C (Carry)"],
        rows: [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 0, 1, 0],
          [1, 1, 0, 1]
        ]
      },
      styles: {
        dataflow: `module half_adder(A,B,S,C);
input A,B;
output S,C;
assign S = A ^ B;
assign C = A & B;
endmodule`,
        behavioral: `module half_adder(A,B,S,C);
input A,B;
output reg S,C;
always @(*) begin
  S = A ^ B;
  C = A & B;
end
endmodule`,
        structural: `module half_adder(A,B,S,C);
input A,B;
output S,C;
xor g1(S, A, B); // Sum = A ^ B
and g2(C, A, B); // Carry = A & B
endmodule`
      },
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>.",
        "<code>assign S = A ^ B; assign C = A & B;</code> in Dataflow.",
        "<code>output reg S, C;</code> in Behavioral.",
        "<code>xor</code> and <code>and</code> primitives in Structural."
      ],
      userElements: [
        "<code>half_adder</code>: Module name.",
        "<code>A, B</code>: Inputs.",
        "<code>S, C</code>: Outputs (Sum, Carry).",
        "<code>g1, g2</code>: Instance names in Structural."
      ],
      lineByLine: [
        "<code>module half_adder(A,B,S,C);</code>: Declares half adder with 2 inputs and 2 outputs.",
        "<code>input A,B; output S,C;</code>: Defines ports.",
        "<strong>Dataflow:</strong> <code>assign S = A ^ B;</code> and <code>assign C = A & B;</code> continuously evaluate sum and carry.",
        "<strong>Behavioral:</strong> Procedural assignments inside <code>always @(*)</code>.",
        "<strong>Structural:</strong> Wires a hardware <code>xor</code> gate for Sum S and an <code>and</code> gate for Carry C."
      ],
      commonMistakes: [
        "Swapping Sum and Carry equations (remember: Sum is XOR, Carry is AND).",
        "Declaring reg on outputs when writing Dataflow or Structural code."
      ]
    },
    {
      id: "full_adder",
      title: "9. Full Adder",
      topicId: 9,
      practiceId: "full_adder",
      explanation: "A Full Adder adds three 1-bit inputs: two operands A and B, plus an incoming carry Cin. It produces Sum (S) and Carry-out (Cout).",
      booleanExpr: "S = A ^ B ^ Cin   |   Cout = (A & B) | (B & Cin) | (A & Cin)",
      truthTable: {
        headers: ["A", "B", "Cin", "S (Sum)", "Cout (Carry)"],
        rows: [
          [0, 0, 0, 0, 0],
          [0, 0, 1, 1, 0],
          [0, 1, 0, 1, 0],
          [0, 1, 1, 0, 1],
          [1, 0, 0, 1, 0],
          [1, 0, 1, 0, 1],
          [1, 1, 0, 0, 1],
          [1, 1, 1, 1, 1]
        ]
      },
      styles: {
        dataflow: `module full_adder(A,B,Cin,S,Cout);
input A,B,Cin;
output S,Cout;
assign S = A ^ B ^ Cin;
assign Cout = (A & B) | (B & Cin) | (A & Cin);
endmodule`,
        behavioral: `module full_adder(A,B,Cin,S,Cout);
input A,B,Cin;
output reg S,Cout;
always @(*) begin
  S = A ^ B ^ Cin;
  Cout = (A & B) | (B & Cin) | (A & Cin);
end
endmodule`,
        structural: `module full_adder(A,B,Cin,S,Cout);
input A,B,Cin;
output S,Cout;
wire w1, w2, w3;
xor g1(w1, A, B);
xor g2(S, w1, Cin);
and g3(w2, w1, Cin);
and g4(w3, A, B);
or  g5(Cout, w2, w3);
endmodule`
      },
      compulsoryElements: [
        "<code>wire w1, w2, w3;</code>: Compulsory in Structural modeling to connect internal intermediate outputs between gates.",
        "<code>output reg S, Cout;</code>: Compulsory in Behavioral."
      ],
      userElements: [
        "<code>full_adder</code>: Module name.",
        "<code>A, B, Cin</code>: Input signals.",
        "<code>S, Cout</code>: Output signals.",
        "<code>w1, w2, w3</code>: Internal interconnecting wire names in Structural."
      ],
      lineByLine: [
        "<code>module full_adder(A,B,Cin,S,Cout);</code>: Full adder header with 3 inputs and 2 outputs.",
        "<strong>Dataflow:</strong> Computes 3-input XOR for S, and sum of pairwise AND products for Cout.",
        "<strong>Behavioral:</strong> Procedural assignment of S and Cout inside <code>always @(*)</code>.",
        "<strong>Structural:</strong> Uses internal wires (<code>wire w1, w2, w3;</code>) to cascade 2 XOR gates, 2 AND gates, and 1 OR gate (implementing 2 half adders combined)."
      ],
      commonMistakes: [
        "Forgetting internal <code>wire</code> declarations for intermediate signals in Structural modeling.",
        "Typo in Cout: writing <code>(A | B)</code> instead of <code>(A & B)</code>."
      ]
    },
    {
      id: "half_subtractor",
      title: "10. Half Subtractor",
      topicId: 10,
      practiceId: "half_subtractor",
      explanation: "A Half Subtractor subtracts 1-bit input B from input A (A - B), producing Difference (Diff) and Borrow. Borrow is needed when subtracting 1 from 0 (0 - 1 = 1 with Borrow 1).",
      booleanExpr: "Diff = A ^ B   |   Borrow = ~A & B",
      truthTable: {
        headers: ["A", "B", "Diff (Difference)", "Borrow"],
        rows: [
          [0, 0, 0, 0],
          [0, 1, 1, 1],
          [1, 0, 1, 0],
          [1, 1, 0, 0]
        ]
      },
      styles: {
        dataflow: `module half_subtractor(A,B,Diff,Borrow);
input A,B;
output Diff,Borrow;
assign Diff = A ^ B;
assign Borrow = ~A & B;
endmodule`,
        behavioral: `module half_subtractor(A,B,Diff,Borrow);
input A,B;
output reg Diff,Borrow;
always @(*) begin
  Diff = A ^ B;
  Borrow = ~A & B;
end
endmodule`,
        structural: `module half_subtractor(A,B,Diff,Borrow);
input A,B;
output Diff,Borrow;
wire w1;
xor g1(Diff, A, B);
not g2(w1, A);
and g3(Borrow, w1, B);
endmodule`
      },
      compulsoryElements: [
        "<code>Diff = A ^ B; Borrow = ~A & B;</code> in Dataflow.",
        "<code>wire w1;</code> in Structural to hold the inverted <code>~A</code> signal.",
        "<code>xor</code>, <code>not</code>, <code>and</code> primitives in Structural."
      ],
      userElements: [
        "<code>half_subtractor</code>: Module name.",
        "<code>A, B</code>: Inputs (minuend A, subtrahend B).",
        "<code>Diff, Borrow</code>: Outputs.",
        "<code>w1</code>: Internal inverted wire."
      ],
      lineByLine: [
        "<code>module half_subtractor(A,B,Diff,Borrow);</code>: Declares half subtractor ports.",
        "<strong>Dataflow:</strong> Diff is XOR of A and B; Borrow is <code>~A & B</code> (active when A=0 and B=1).",
        "<strong>Behavioral:</strong> Procedurally updates Diff and Borrow.",
        "<strong>Structural:</strong> Inverts A with <code>not g2(w1, A);</code> then ANDs with B to form Borrow."
      ],
      commonMistakes: [
        "Inverting B instead of A: Borrow is <code>~A & B</code>, NOT <code>A & ~B</code>!",
        "Confusing Difference with Half Adder Sum (Difference is also XOR, but Borrow requires NOT on A)."
      ]
    },
    {
      id: "full_subtractor",
      title: "11. Full Subtractor",
      topicId: 11,
      practiceId: "full_subtractor",
      explanation: "A Full Subtractor performs subtraction on three 1-bit inputs: Minuend A, Subtrahend B, and previous Borrow-in Bin (A - B - Bin). It outputs Difference (Diff) and Borrow-out (Bout).",
      booleanExpr: "Diff = A ^ B ^ Bin   |   Bout = (~A & B) | (~(A ^ B) & Bin)",
      truthTable: {
        headers: ["A", "B", "Bin", "Diff", "Bout"],
        rows: [
          [0, 0, 0, 0, 0],
          [0, 0, 1, 1, 1],
          [0, 1, 0, 1, 1],
          [0, 1, 1, 0, 1],
          [1, 0, 0, 1, 0],
          [1, 0, 1, 0, 0],
          [1, 1, 0, 0, 0],
          [1, 1, 1, 1, 1]
        ]
      },
      styles: {
        dataflow: `module full_subtractor(A,B,Bin,Diff,Bout);
input A,B,Bin;
output Diff,Bout;
assign Diff = A ^ B ^ Bin;
assign Bout = (~A & B) | (~(A ^ B) & Bin);
endmodule`,
        behavioral: `module full_subtractor(A,B,Bin,Diff,Bout);
input A,B,Bin;
output reg Diff,Bout;
always @(*) begin
  Diff = A ^ B ^ Bin;
  Bout = (~A & B) | (~(A ^ B) & Bin);
end
endmodule`,
        structural: `module full_subtractor(A,B,Bin,Diff,Bout);
input A,B,Bin;
output Diff,Bout;
wire w1, w2, w3, w4;
xor g1(w1, A, B);
xor g2(Diff, w1, Bin);
not g3(w2, w1);
and g4(w3, w2, Bin);
wire notA;
not g5(notA, A);
and g6(w4, notA, B);
or  g7(Bout, w3, w4);
endmodule`
      },
      compulsoryElements: [
        "<code>wire w1, w2, w3, w4, notA;</code>: Compulsory interconnecting wires in Structural.",
        "<code>output reg Diff, Bout;</code> in Behavioral."
      ],
      userElements: [
        "<code>full_subtractor</code>: Module name.",
        "<code>A, B, Bin</code>: Inputs.",
        "<code>Diff, Bout</code>: Outputs.",
        "<code>w1, w2...</code>: Internal wires in Structural."
      ],
      lineByLine: [
        "<code>module full_subtractor(A,B,Bin,Diff,Bout);</code>: Full subtractor module header.",
        "<strong>Dataflow:</strong> Evaluates Diff via 3-way XOR; Bout via <code>(~A & B) | (~(A ^ B) & Bin)</code>.",
        "<strong>Behavioral:</strong> Procedural assignment in <code>always @(*)</code>.",
        "<strong>Structural:</strong> Connects two half subtractors and an OR gate using internal wires."
      ],
      commonMistakes: [
        "Confusing Full Adder Cout with Full Subtractor Bout (Bout requires inversion of minuend terms).",
        "Forgetting parentheses in <code>(~(A ^ B) & Bin)</code>."
      ]
    },
    {
      id: "multiplexers",
      title: "12. Multiplexers (2:1 and 4:1)",
      topicId: 12,
      practiceId: "mux4_1",
      explanation: "A Multiplexer (MUX) is a digital data selector that directs one of multiple data inputs to a single output line based on select control inputs.",
      booleanExpr: "4:1 Mux: out = (~s1 & ~s0 & in[0]) | (~s1 & s0 & in[1]) | (s1 & ~s0 & in[2]) | (s1 & s0 & in[3])",
      truthTable: {
        headers: ["s1", "s0", "Selected Line", "out"],
        rows: [
          [0, 0, "in[0]", "in[0]"],
          [0, 1, "in[1]", "in[1]"],
          [1, 0, "in[2]", "in[2]"],
          [1, 1, "in[3]", "in[3]"]
        ]
      },
      styles: {
        dataflow: `module mux4_1(in,s0,s1,out);
input s0,s1;
input [3:0]in;
output out;
assign out = (~s1 & ~s0 & in[0]) |
             (~s1 &  s0 & in[1]) |
             ( s1 & ~s0 & in[2]) |
             ( s1 &  s0 & in[3]);
endmodule`,
        behavioral: `module mux4_1(in,s0,s1,out);
input s0,s1;
input [3:0]in;
output reg out;
always @(*) begin
  case ({s1, s0})
    2'b00: out = in[0];
    2'b01: out = in[1];
    2'b10: out = in[2];
    2'b11: out = in[3];
    default: out = 1'b0;
  endcase
end
endmodule`,
        structural: `module mux4_1(in,s0,s1,out);
input s0,s1;
input [3:0]in;
output out;
wire ns0, ns1, w0, w1, w2, w3;
not g1(ns0, s0);
not g2(ns1, s1);
and g3(w0, in[0], ns1, ns0);
and g4(w1, in[1], ns1, s0);
and g5(w2, in[2], s1, ns0);
and g6(w3, in[3], s1, s0);
or  g7(out, w0, w1, w2, w3);
endmodule`
      },
      compulsoryElements: [
        "<code>[3:0]</code>: Vector bus declaration (bits 3, 2, 1, 0).",
        "<code>case ({s1, s0}) ... endcase</code>: Compulsory in Behavioral case construct.",
        "<code>assign</code> with Boolean sum of products in Dataflow."
      ],
      userElements: [
        "<code>mux4_1</code>, <code>in</code>, <code>s0, s1</code>, <code>out</code>."
      ],
      lineByLine: [
        "<strong>Dataflow:</strong> Uses Boolean equation to route each bit of <code>in</code> based on s1 and s0.",
        "<strong>Behavioral:</strong> Uses <code>case ({s1, s0})</code> to select input line.",
        "<strong>Structural:</strong> Inverters decode select signals, 4 AND gates gate each data bit, and an OR gate merges the output."
      ],
      commonMistakes: [
        "Confusing s1 (MSB) and s0 (LSB).",
        "Writing <code>input in[3:0];</code> instead of <code>input [3:0] in;</code>."
      ]
    },
    {
      id: "demultiplexers",
      title: "13. Demultiplexers (1:2 and 1:4)",
      topicId: 13,
      practiceId: "demux1_4",
      explanation: "A Demultiplexer routes a single input data signal to one of multiple outputs depending on the select inputs. Unselected lines stay 0.",
      booleanExpr: "out[0]=~s1&~s0&in, out[1]=~s1&s0&in, out[2]=s1&~s0&in, out[3]=s1&s0&in",
      truthTable: {
        headers: ["s1", "s0", "in", "out[3]", "out[2]", "out[1]", "out[0]"],
        rows: [
          [0, 0, "in", 0, 0, 0, "in"],
          [0, 1, "in", 0, 0, "in", 0],
          [1, 0, "in", 0, "in", 0, 0],
          [1, 1, "in", "in", 0, 0, 0]
        ]
      },
      styles: {
        dataflow: `module demux1_4(in,s0,s1,out);
input s0,s1,in;
output [3:0]out;
assign out[0] = ~s1 & ~s0 & in;
assign out[1] = ~s1 &  s0 & in;
assign out[2] =  s1 & ~s0 & in;
assign out[3] =  s1 &  s0 & in;
endmodule`,
        behavioral: `module demux1_4(in,s0,s1,out);
input s0,s1,in;
output reg [3:0]out;
always @(*) begin
  out = 4'b0000; // default all to 0
  case ({s1, s0})
    2'b00: out[0] = in;
    2'b01: out[1] = in;
    2'b10: out[2] = in;
    2'b11: out[3] = in;
  endcase
end
endmodule`,
        structural: `module demux1_4(in,s0,s1,out);
input s0,s1,in;
output [3:0]out;
wire ns0, ns1;
not g1(ns0, s0);
not g2(ns1, s1);
and g3(out[0], in, ns1, ns0);
and g4(out[1], in, ns1, s0);
and g5(out[2], in, s1, ns0);
and g6(out[3], in, s1, s0);
endmodule`
      },
      compulsoryElements: [
        "<code>output [3:0]out;</code>: Declares 4-bit output bus.",
        "<code>out[0] ... out[3]</code>: Bit selects for bus signals."
      ],
      userElements: [
        "<code>demux1_4</code>, <code>in</code>, <code>s0, s1</code>, <code>out</code>."
      ],
      lineByLine: [
        "<strong>Dataflow:</strong> Four assign statements drive each bit of <code>out</code>.",
        "<strong>Behavioral:</strong> Procedural block defaults out to 0 and writes only to selected bit.",
        "<strong>Structural:</strong> Inverters decode selects and feed 4 AND gates."
      ],
      commonMistakes: [
        "Leaving unselected outputs floating instead of 0."
      ]
    },
    {
      id: "d_ff",
      title: "14. D Flip-Flop",
      topicId: 14,
      practiceId: "d_ff",
      explanation: "A positive edge-triggered D Flip-Flop with asynchronous active-high reset. When reset is high, Q clears to 0 immediately. Otherwise on posedge clk, Q samples D.",
      booleanExpr: "Q_next = rst ? 0 : D (evaluated on posedge clk or posedge rst)",
      truthTable: {
        headers: ["clk", "rst", "D", "Q_next", "State / Note"],
        rows: [
          ["X", 1, "X", 0, "Asynchronous Reset"],
          ["↑", 0, 0, 0, "Clock edge: D=0 captured"],
          ["↑", 0, 1, 1, "Clock edge: D=1 captured"],
          ["0/1", 0, "X", "Q", "Hold state"]
        ]
      },
      styles: {
        behavioral: `module d_ff(clk,rst,d,q);
input clk,rst,d;
output reg q;
always @(posedge clk or posedge rst) begin
  if (rst)
    q <= 1'b0;
  else
    q <= d;
end
endmodule`,
        dataflow: `// Note: Flip-flops are sequential circuits with internal memory.
// In standard Verilog, flip-flops are always written using Behavioral Modeling (always @(posedge clk)).
// Below is a behavioral model with ternary dataflow style inside the block:
module d_ff(clk,rst,d,q);
input clk,rst,d;
output reg q;
always @(posedge clk or posedge rst) begin
  q <= rst ? 1'b0 : d;
end
endmodule`,
        structural: `// Structural representation: interconnecting a D latch / flip-flop primitive or sub-module
module d_ff(clk,rst,d,q);
input clk,rst,d;
output reg q;
// Note: Synthesizers map 'always @(posedge clk)' directly to the hardware DFF cell in the library!
always @(posedge clk or posedge rst) begin
  if (rst) q <= 1'b0; else q <= d;
end
endmodule`
      },
      compulsoryElements: [
        "<code>always @(posedge clk or posedge rst)</code>: Compulsory edge trigger list.",
        "<code>output reg q;</code>: Compulsory <code>reg</code> for procedural assignment.",
        "<code>&lt;=</code>: Non-blocking assignment operator."
      ],
      userElements: [
        "<code>d_ff</code>, <code>clk</code>, <code>rst</code>, <code>d</code>, <code>q</code>."
      ],
      lineByLine: [
        "<code>output reg q;</code>: q retains memory, so it is declared as <code>reg</code>.",
        "<code>always @(posedge clk or posedge rst)</code>: Activates on clock rising edge or reset rising edge.",
        "<code>if (rst) q <= 1'b0;</code>: Checks reset first (highest priority).",
        "<code>else q <= d;</code>: Captures D at clock edge."
      ],
      commonMistakes: [
        "Using blocking <code>=</code> instead of non-blocking <code>&lt;=</code>.",
        "Forgetting <code>posedge rst</code> in the sensitivity list for asynchronous reset."
      ]
    },
    {
      id: "jk_ff",
      title: "15. JK Flip-Flop",
      topicId: 15,
      practiceId: "jk_ff",
      explanation: "A positive edge-triggered JK Flip-Flop with asynchronous active-high reset. Features 4 modes: Hold (00), Reset (01), Set (10), and Toggle (11).",
      booleanExpr: "Q_next = (J & ~Q) | (~K & Q)",
      truthTable: {
        headers: ["J", "K", "Q_next", "Operation / Behavior"],
        rows: [
          [0, 0, "Q", "Hold (No change)"],
          [0, 1, 0, "Reset (Q forced to 0)"],
          [1, 0, 1, "Set (Q forced to 1)"],
          [1, 1, "~Q", "Toggle (Invert Q)"]
        ]
      },
      styles: {
        behavioral: `module jk_ff(clk,rst,j,k,q);
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
endmodule`,
        dataflow: `// Behavioral style with if-else ladder (characteristic equation):
module jk_ff(clk,rst,j,k,q);
input clk,rst,j,k;
output reg q;
always @(posedge clk or posedge rst) begin
  if (rst)
    q <= 1'b0;
  else
    q <= (j & ~q) | (~k & q); // Characteristic equation
end
endmodule`,
        structural: `// Behavioral style using if-else:
module jk_ff(clk,rst,j,k,q);
input clk,rst,j,k;
output reg q;
always @(posedge clk or posedge rst) begin
  if (rst)
    q <= 1'b0;
  else if (j == 0 && k == 1)
    q <= 1'b0;
  else if (j == 1 && k == 0)
    q <= 1'b1;
  else if (j == 1 && k == 1)
    q <= ~q;
end
endmodule`
      },
      compulsoryElements: [
        "<code>always @(posedge clk or posedge rst)</code>.",
        "<code>output reg q;</code>.",
        "<code>case ({j, k}) ... endcase</code>.",
        "<code>&lt;=</code>: Non-blocking operator."
      ],
      userElements: [
        "<code>jk_ff</code>, <code>clk</code>, <code>rst</code>, <code>j</code>, <code>k</code>, <code>q</code>."
      ],
      lineByLine: [
        "<code>output reg q;</code>: Declares memory register q.",
        "<code>always @(posedge clk or posedge rst)</code>: Triggers on positive transitions.",
        "<code>case ({j, k})</code>: Concatenates j and k to evaluate Hold, Reset, Set, Toggle.",
        "<code>2'b11: q <= ~q;</code>: Toggles current state of Q."
      ],
      commonMistakes: [
        "Confusing J and K: J is Set, K is Reset.",
        "Forgetting <code>endcase</code> before <code>end</code>."
      ]
    }
  ];

  return lessons;
}));
