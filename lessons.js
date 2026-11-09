/**
 * Lesson contents for Verilog Basics Lab.
 * Presents textbook syntax as the primary main syntax,
 * explains each line, and clearly differentiates compulsory keywords
 * vs user-defined variable/module identifiers.
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
      title: "0. Verilog Basics",
      isBasics: true,
      contentHtml: `
        <h2>0. Verilog Basics (Zero to Hero)</h2>
        <p class="lead">Welcome! Verilog is a <strong>Hardware Description Language (HDL)</strong> used to model digital circuits. Unlike C or Python which execute sequentially step-by-step on a processor, Verilog constructs describe physical electronic gates that operate simultaneously in parallel.</p>

        <div class="callout callout-info">
          <div class="callout-title">🔑 Compulsory Keywords vs. User-Defined Names (Crucial for Exams!)</div>
          <p>In every Verilog program, elements are split into two groups:</p>
          <ul>
            <li><strong>Compulsory Fixed Keywords (Reserved by Verilog):</strong> You CANNOT change these words or misspell them. Examples: <code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>wire</code>, <code>reg</code>, <code>assign</code>, <code>always</code>, <code>begin</code>, <code>end</code>, <code>posedge</code>, <code>case</code>, <code>endcase</code>.</li>
            <li><strong>User-Defined Identifiers (Variables & Names):</strong> These are names chosen by the circuit designer (you or your exam paper). Examples: module name (<code>and_gate</code>, <code>mux4_1</code>), input port names (<code>A</code>, <code>B</code>, <code>in</code>, <code>s0</code>, <code>clk</code>), and output port names (<code>Y</code>, <code>out</code>, <code>q</code>).</li>
          </ul>
        </div>

        <h3>1. What is a Module?</h3>
        <p>A <strong>module</strong> is the fundamental circuit block in Verilog (analogous to an IC chip). It begins with <code>module &lt;name&gt;(&lt;ports&gt;);</code> and ends with <code>endmodule</code> (notice: <strong>no semicolon</strong> after <code>endmodule</code>).</p>

        <h3>2. Input & Output Ports</h3>
        <p>Ports are external electrical pins connecting your circuit to the outside:</p>
        <ul>
          <li><code>input A, B;</code> &mdash; Compulsory keyword <code>input</code> followed by user variables <code>A, B</code>.</li>
          <li><code>output Y;</code> &mdash; Compulsory keyword <code>output</code> followed by user variable <code>Y</code>.</li>
          <li><code>input [3:0] in;</code> &mdash; A 4-bit wide vector bus containing bits <code>in[3], in[2], in[1], in[0]</code>.</li>
        </ul>

        <h3>3. wire vs reg</h3>
        <ul>
          <li><strong><code>wire</code>:</strong> Represents a physical electrical connection. It cannot hold state; it only carries a continuous voltage driven by an <code>assign</code> statement or logic gate.</li>
          <li><strong><code>reg</code>:</strong> A variable that holds its value between simulation events. Any signal driven inside an <code>always</code> procedural block <strong>must</strong> be declared as <code>reg</code> (e.g. <code>output reg q;</code>).</li>
        </ul>

        <h3>4. Three Modeling Styles Used in Lab Exams</h3>
        <ul>
          <li><strong>Dataflow Modeling:</strong> Uses continuous <code>assign</code> statements with Boolean logic equations (e.g. <code>assign Y = A & B;</code> or <code>assign out = (~s1 & ~s0 & in[0]) | ...;</code>). Used for gates, mux, and demux.</li>
          <li><strong>Gate-Level (Primitive) Modeling:</strong> Uses built-in hardware primitives (<code>and</code>, <code>or</code>, <code>not</code>, <code>nand</code>, etc.).</li>
          <li><strong>Behavioral Modeling:</strong> Uses procedural <code>always</code> blocks (e.g. <code>always @(posedge clk or posedge rst)</code>) with algorithmic statements like <code>if-else</code> or <code>case</code>. Used for sequential circuits like D and JK flip-flops.</li>
        </ul>

        <h3>5. Blocking (<code>=</code>) vs Non-Blocking (<code>&lt;=</code>)</h3>
        <ul>
          <li><strong><code>=</code> (Blocking):</strong> Evaluates immediately. Used for combinational logic.</li>
          <li><strong><code>&lt;=</code> (Non-Blocking):</strong> Transfers values at clock triggers concurrently. <strong>Always use <code>&lt;=</code> in clocked flip-flops!</strong></li>
        </ul>

        <h3>6. Basic Syntax & Literals</h3>
        <ul>
          <li><strong>Semicolons:</strong> Every statement ends with <code>;</code>, except <code>begin</code>, <code>end</code>, and <code>endmodule</code>.</li>
          <li><strong>Bit Literals:</strong> <code>1'b0</code> (1-bit 0), <code>1'b1</code> (1-bit 1), <code>2'b00</code> (2-bit binary 00), <code>4'b0000</code> (4-bit binary).</li>
          <li><strong>Operators:</strong> Bitwise AND (<code>&</code>), OR (<code>|</code>), NOT (<code>~</code>), XOR (<code>^</code>), XNOR (<code>~^</code> or <code>^~</code>).</li>
        </ul>
      `
    },
    {
      id: "and_gate",
      title: "1. AND Gate",
      topicId: 1,
      practiceId: "and_gate",
      explanation: "An AND gate outputs 1 (HIGH) if and only if all inputs are 1. If any input is 0, the output Y is 0.",
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module and_gate(Y,A,B);
input A,B;
output Y;
assign Y=A&B;
endmodule`,
      verilogCode2: `// Alternative Style 1: ANSI port declaration
module and_gate(input A, input B, output Y);
  assign Y = A & B;
endmodule

// Alternative Style 2: Gate primitive style
module and_gate(Y,A,B);
  input A,B;
  output Y;
  and g1(Y, A, B); // built-in primitive: (output, input1, input2)
endmodule`,
      compulsoryElements: [
        "<code>module</code> and <code>endmodule</code>: Compulsory keywords enclosing the hardware module definition.",
        "<code>input</code> and <code>output</code>: Compulsory direction keywords declaring port roles.",
        "<code>assign</code>: Compulsory keyword for continuous dataflow assignment.",
        "<code>&</code>: Compulsory bitwise AND operator.",
        "Semicolons (<code>;</code>): Compulsory terminators after port list and assign statements."
      ],
      userElements: [
        "<code>and_gate</code>: Module name chosen by the user or specified by the lab question.",
        "<code>Y</code>: Output variable name (can be named out, result, etc.).",
        "<code>A, B</code>: Input variable names (can be named in1, in2, etc.)."
      ],
      lineByLine: [
        "<code>module and_gate(Y,A,B);</code>: Declares module <code>and_gate</code> with ports Y, A, B listed in parentheses.",
        "<code>input A,B;</code>: Declares A and B as input signal pins.",
        "<code>output Y;</code>: Declares Y as the output signal pin.",
        "<code>assign Y=A&B;</code>: Continuously computes the bitwise AND of A and B and drives the result onto wire Y.",
        "<code>endmodule</code>: Closes the module definition (no semicolon)."
      ],
      commonMistakes: [
        "Using logical AND <code>&&</code> instead of bitwise AND <code>&</code>.",
        "Adding a semicolon after <code>endmodule;</code> (must be bare <code>endmodule</code>).",
        "Declaring <code>output reg Y;</code> while using <code>assign</code> (continuous assign requires wire output)."
      ]
    },
    {
      id: "or_gate",
      title: "2. OR Gate",
      topicId: 2,
      practiceId: "or_gate",
      explanation: "An OR gate outputs 1 if at least one input is 1. It only outputs 0 when both inputs A and B are 0.",
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module or_gate(A,B,Y);
input A,B;
output Y;
assign Y=A|B;
endmodule`,
      verilogCode2: `// Alternative Style 1: ANSI port declaration
module or_gate(input A, input B, output Y);
  assign Y = A | B;
endmodule

// Alternative Style 2: Gate primitive style
module or_gate(A,B,Y);
  input A,B;
  output Y;
  or g1(Y, A, B); // primitive: (output, input1, input2)
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>|</code>: Compulsory bitwise OR operator."
      ],
      userElements: [
        "<code>or_gate</code>: Module identifier.",
        "<code>A, B</code>: Input pin variables.",
        "<code>Y</code>: Output pin variable."
      ],
      lineByLine: [
        "<code>module or_gate(A,B,Y);</code>: Declares module <code>or_gate</code> with ports A, B, Y.",
        "<code>input A,B;</code>: Declares A and B as inputs.",
        "<code>output Y;</code>: Declares Y as output.",
        "<code>assign Y=A|B;</code>: Continuously drives Y with the bitwise OR (<code>|</code>) of A and B.",
        "<code>endmodule</code>: Ends the module."
      ],
      commonMistakes: [
        "Confusing bitwise OR <code>|</code> with XOR <code>^</code>.",
        "Forgetting semicolon after <code>assign Y=A|B;</code>."
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module not_gate(A,Y);
input A;
output Y;
assign Y=~A;
endmodule`,
      verilogCode2: `// Alternative Style 1: ANSI port style
module not_gate(input A, output Y);
  assign Y = ~A;
endmodule

// Alternative Style 2: Gate primitive style
module not_gate(A,Y);
  input A;
  output Y;
  not n1(Y, A); // primitive: (output, input)
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>~</code>: Compulsory bitwise inversion (tilde) operator."
      ],
      userElements: [
        "<code>not_gate</code>: Module name.",
        "<code>A</code>: Single input variable.",
        "<code>Y</code>: Inverted output variable."
      ],
      lineByLine: [
        "<code>module not_gate(A,Y);</code>: Module header with input A and output Y.",
        "<code>input A;</code>: Defines single input A.",
        "<code>output Y;</code>: Defines single output Y.",
        "<code>assign Y=~A;</code>: Continuously inverts input A using tilde <code>~</code>.",
        "<code>endmodule</code>: Terminates module."
      ],
      commonMistakes: [
        "Using exclamation mark <code>!</code> instead of bitwise tilde <code>~</code>.",
        "Declaring two inputs for a NOT gate (NOT gate has only one input!)."
      ]
    },
    {
      id: "nand_gate",
      title: "4. NAND Gate",
      topicId: 4,
      practiceId: "nand_gate",
      explanation: "A NAND gate is an inverted AND gate. The output Y is 0 only when both inputs A and B are 1; otherwise, it is 1.",
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module nand_gate(A,B,Y);
input A,B;
output Y;
assign Y=~(A&B);
endmodule`,
      verilogCode2: `// Alternative Style 1: ANSI port style
module nand_gate(input A, input B, output Y);
  assign Y = ~(A & B);
endmodule

// Alternative Style 2: Gate primitive style
module nand_gate(A,B,Y);
  input A,B;
  output Y;
  nand g1(Y, A, B);
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>~</code> and <code>&</code> with parentheses <code>~(A&B)</code>: Compulsory operators."
      ],
      userElements: [
        "<code>nand_gate</code>: Module identifier.",
        "<code>A, B</code>: Input port names.",
        "<code>Y</code>: Output port name."
      ],
      lineByLine: [
        "<code>module nand_gate(A,B,Y);</code>: Declares NAND gate module.",
        "<code>input A,B;</code>: Declares inputs A and B.",
        "<code>output Y;</code>: Declares output Y.",
        "<code>assign Y=~(A&B);</code>: Computes A & B first inside parentheses, then inverts with <code>~</code>.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Missing parentheses: writing <code>~A & B</code> inverts only A instead of the combined AND result.",
        "Writing <code>~&</code> between variables: <code>A ~& B</code> is invalid syntax in expressions; use <code>~(A & B)</code>."
      ]
    },
    {
      id: "nor_gate",
      title: "5. NOR Gate",
      topicId: 5,
      practiceId: "nor_gate",
      explanation: "A NOR gate is an inverted OR gate. The output Y is 1 only when both inputs A and B are 0; otherwise, it is 0.",
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module nor_gate(A,B,Y);
input A,B;
output Y;
assign Y=~(A|B);
endmodule`,
      verilogCode2: `// Alternative Style 1: ANSI port style
module nor_gate(input A, input B, output Y);
  assign Y = ~(A | B);
endmodule

// Alternative Style 2: Gate primitive style
module nor_gate(A,B,Y);
  input A,B;
  output Y;
  nor g1(Y, A, B);
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>~</code>, <code>|</code>, and parentheses <code>~(A|B)</code>: Compulsory operators."
      ],
      userElements: [
        "<code>nor_gate</code>: Module name.",
        "<code>A, B</code>: Inputs.",
        "<code>Y</code>: Output."
      ],
      lineByLine: [
        "<code>module nor_gate(A,B,Y);</code>: Declares module nor_gate.",
        "<code>input A,B;</code>: Sets A, B as input ports.",
        "<code>output Y;</code>: Sets Y as output port.",
        "<code>assign Y=~(A|B);</code>: Computes (A | B) and inverts the output.",
        "<code>endmodule</code>: Ends module."
      ],
      commonMistakes: [
        "Omitting parentheses around <code>(A | B)</code>.",
        "Confusing NOR truth table with NAND (NOR is only 1 at 00)."
      ]
    },
    {
      id: "xor_gate",
      title: "6. XOR Gate",
      topicId: 6,
      practiceId: "xor_gate",
      explanation: "An XOR (Exclusive OR) gate outputs 1 when the inputs are different (one is 0, the other is 1). If both inputs are equal, output is 0.",
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module xor_gate(A,B,Y);
input A,B;
output Y;
assign Y=A^B;
endmodule`,
      verilogCode2: `// Alternative Style 1: ANSI port style
module xor_gate(input A, input B, output Y);
  assign Y = A ^ B;
endmodule

// Alternative Style 2: Gate primitive style
module xor_gate(A,B,Y);
  input A,B;
  output Y;
  xor g1(Y, A, B);
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>^</code>: Compulsory bitwise XOR (caret) operator."
      ],
      userElements: [
        "<code>xor_gate</code>: Module name.",
        "<code>A, B</code>: Inputs.",
        "<code>Y</code>: Output."
      ],
      lineByLine: [
        "<code>module xor_gate(A,B,Y);</code>: Defines module header with A, B, Y.",
        "<code>input A,B;</code>: Declares A and B as inputs.",
        "<code>output Y;</code>: Declares Y as output.",
        "<code>assign Y=A^B;</code>: Performs exclusive OR using the caret <code>^</code>.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Confusing XOR <code>^</code> with power/exponentiation.",
        "Writing <code>A != B</code> instead of standard hardware XOR <code>A ^ B</code>."
      ]
    },
    {
      id: "xnor_gate",
      title: "7. XNOR Gate",
      topicId: 7,
      practiceId: "xnor_gate",
      explanation: "An XNOR gate outputs 1 when both inputs are equal (both 0 or both 1). It acts as an equivalence detector.",
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module xnor_gate(A,B,Y);
input A,B;
output Y;
assign Y=A~^B;
endmodule`,
      verilogCode2: `// Alternative Style 1: Using ~(A^B)
module xnor_gate(A,B,Y);
  input A,B;
  output Y;
  assign Y = ~(A ^ B);
endmodule

// Alternative Style 2: Gate primitive style
module xnor_gate(A,B,Y);
  input A,B;
  output Y;
  xnor g1(Y, A, B);
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>~^</code> (or <code>^~</code> or <code>~(A^B)</code>): Compulsory XNOR operator combination."
      ],
      userElements: [
        "<code>xnor_gate</code>: Module name.",
        "<code>A, B</code>: Inputs.",
        "<code>Y</code>: Output."
      ],
      lineByLine: [
        "<code>module xnor_gate(A,B,Y);</code>: Declares XNOR module header.",
        "<code>input A,B;</code>: Declares inputs A and B.",
        "<code>output Y;</code>: Declares output Y.",
        "<code>assign Y=A~^B;</code>: Drives Y with the XNOR operation using the textbook <code>~^</code> operator.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Writing <code>~A ^ B</code> without parentheses (inverts only A).",
        "Confusing <code>~^</code> (XNOR) with <code>~&</code> (NAND)."
      ]
    },
    {
      id: "multiplexers",
      title: "8. Multiplexers (2:1 and 4:1 Dataflow)",
      topicId: 8,
      practiceId: "mux4_1",
      explanation: "A Multiplexer (MUX) is a digital data selector. In Dataflow Modeling, we write sum-of-products Boolean expressions where each data input is ANDed with its corresponding decoded select combinations.",
      booleanExpr: "4:1 Mux: out = (~s1 & ~s0 & in[0]) | (~s1 & s0 & in[1]) | (s1 & ~s0 & in[2]) | (s1 & s0 & in[3])",
      truthTable: {
        headers: ["s1", "s0", "Selected Input", "out"],
        rows: [
          [0, 0, "in[0]", "in[0]"],
          [0, 1, "in[1]", "in[1]"],
          [1, 0, "in[2]", "in[2]"],
          [1, 1, "in[3]", "in[3]"]
        ]
      },
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module mux4_1(in,s0,s1,out);
input s0,s1;
input [3:0]in;
output out;
assign out=(~s1&~s0&in[0])|(~s1&s0&in[1])|(s1&~s0&in[2])|(s1&s0&in[3]);
endmodule`,
      verilogCode2: `// Alternative Style 1: 2:1 Multiplexer in Dataflow modeling
module mux_2to1(d0,d1,sel,y);
  input d0,d1,sel;
  output y;
  assign y = (~sel & d0) | (sel & d1);
endmodule

// Alternative Style 2: Using ternary operator (?:)
module mux4_1(input [3:0] in, input s0, input s1, output out);
  assign out = s1 ? (s0 ? in[3] : in[2]) : (s0 ? in[1] : in[0]);
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>[3:0]</code>: Compulsory vector bus range definition (declares 4 bits wide: bits 3, 2, 1, 0).",
        "<code>~</code>, <code>&</code>, <code>|</code>, and parentheses: Compulsory Boolean operators."
      ],
      userElements: [
        "<code>mux4_1</code>: Module name.",
        "<code>s0, s1</code>: 1-bit select control input variable names.",
        "<code>in</code>: 4-bit data input vector variable name (accessed via <code>in[0]</code>, <code>in[1]</code>, etc.).",
        "<code>out</code>: Output variable name."
      ],
      lineByLine: [
        "<code>module mux4_1(in,s0,s1,out);</code>: Defines module with inputs <code>in, s0, s1</code> and output <code>out</code>.",
        "<code>input s0,s1;</code>: Declares two 1-bit select inputs s0 and s1.",
        "<code>input [3:0]in;</code>: Declares a 4-bit vector input bus <code>in</code> with indices 0, 1, 2, 3.",
        "<code>output out;</code>: Declares single bit output wire <code>out</code>.",
        "<code>assign out=(~s1&~s0&in[0])|...;</code>: Dataflow equation: when s1=0,s0=0 routes in[0]; when 01 routes in[1]; when 10 routes in[2]; when 11 routes in[3].",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Typo in indexing: writing <code>in[0]</code> for both the first and last term (make sure the last term has <code>in[3]</code>).",
        "Declaring <code>input in[3:0];</code> with brackets after the variable (in Verilog, range comes BEFORE the identifier: <code>input [3:0] in;</code>)."
      ]
    },
    {
      id: "demultiplexers",
      title: "9. Demultiplexers (1:2 and 1:4 Dataflow)",
      topicId: 9,
      practiceId: "demux1_4",
      explanation: "A Demultiplexer takes a single data input pin and directs it to one of many output pins based on select lines. Unselected outputs remain 0.",
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
      syntaxType: "Dataflow Modeling (Textbook Syntax)",
      verilogCode1: `module demux1_4(in,s0,s1,out);
input s0,s1,in;
output [3:0]out;
assign out[0]=~s1&~s0&in;
assign out[1]=~s1&s0&in;
assign out[2]=s1&~s0&in;
assign out[3]=s1&s0&in;
endmodule`,
      verilogCode2: `// Alternative Style: 1:2 Demultiplexer in Dataflow modeling
module demux_1to2(d,sel,y0,y1);
  input d,sel;
  output y0,y1;
  assign y0 = ~sel & d;
  assign y1 = sel & d;
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>, <code>assign</code>: Compulsory keywords.",
        "<code>[3:0]</code>: Vector declaration defining 4 output lines.",
        "<code>~</code> and <code>&</code>: Compulsory bitwise logic operators."
      ],
      userElements: [
        "<code>demux1_4</code>: Module name.",
        "<code>s0, s1</code>: Select input names.",
        "<code>in</code>: Data input line name.",
        "<code>out</code>: 4-bit output vector name."
      ],
      lineByLine: [
        "<code>module demux1_4(in,s0,s1,out);</code>: Declares module demux1_4 with its port list.",
        "<code>input s0,s1,in;</code>: Declares s0, s1, and in as 1-bit input lines.",
        "<code>output [3:0]out;</code>: Declares a 4-bit vector output bus <code>out</code>.",
        "<code>assign out[0]=~s1&~s0&in;</code>: Connects input <code>in</code> to out[0] when s1=0, s0=0.",
        "<code>assign out[1]=~s1&s0&in;</code>: Connects input <code>in</code> to out[1] when s1=0, s0=1.",
        "<code>assign out[2]=s1&~s0&in;</code>: Connects input <code>in</code> to out[2] when s1=1, s0=0.",
        "<code>assign out[3]=s1&s0&in;</code>: Connects input <code>in</code> to out[3] when s1=1, s0=1.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Forgetting semicolons after each of the four <code>assign</code> statements.",
        "Swapping s0 and s1: s1 is MSB, s0 is LSB."
      ]
    },
    {
      id: "d_ff",
      title: "10. D Flip-Flop (Behavioral Modeling)",
      topicId: 10,
      practiceId: "d_ff",
      explanation: "A D Flip-Flop is modeled in Behavioral Modeling using an `always` procedural block. On each rising clock edge (posedge clk), the input D is stored into output Q. An active-high asynchronous reset (rst) immediately clears Q to 0.",
      booleanExpr: "Q_next = rst ? 0 : D  (evaluated on posedge clk or posedge rst)",
      truthTable: {
        headers: ["clk", "rst", "D", "Q_next", "State / Behavior"],
        rows: [
          ["X", 1, "X", 0, "Asynchronous Reset"],
          ["↑", 0, 0, 0, "Clock edge: D=0 captured"],
          ["↑", 0, 1, 1, "Clock edge: D=1 captured"],
          ["0/1", 0, "X", "Q", "Hold (No clock edge)"]
        ]
      },
      syntaxType: "Behavioral Modeling (Procedural always block)",
      verilogCode1: `module d_ff(clk,rst,d,q);
input clk,rst,d;
output reg q;
always @(posedge clk or posedge rst)
begin
  if (rst)
    q <= 1'b0;
  else
    q <= d;
end
endmodule`,
      verilogCode2: `// Alternative Style: ANSI port header with if (rst == 1'b1)
module d_ff(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst == 1'b1)
      q <= 1'b0;
    else
      q <= d;
  end
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>: Compulsory module syntax.",
        "<code>reg</code>: COMPULSORY keyword because <code>q</code> is assigned procedurally inside an <code>always</code> block.",
        "<code>always @(posedge clk or posedge rst)</code>: Compulsory procedural sensitivity list for edge-triggered behavior.",
        "<code>begin</code> and <code>end</code>: Compulsory keywords grouping block statements.",
        "<code>&lt;=</code>: Non-blocking assignment operator (compulsory for sequential flip-flop hardware synthesis)."
      ],
      userElements: [
        "<code>d_ff</code>: Module name.",
        "<code>clk</code>: Clock signal input name.",
        "<code>rst</code>: Reset signal input name.",
        "<code>d</code>: Data input name.",
        "<code>q</code>: Output register name."
      ],
      lineByLine: [
        "<code>module d_ff(clk,rst,d,q);</code>: Declares D flip-flop module with ports clk, rst, d, q.",
        "<code>input clk,rst,d;</code>: Declares clock, reset, and data as inputs.",
        "<code>output reg q;</code>: Declares output <code>q</code> as a register (<code>reg</code>) so it retains memory.",
        "<code>always @(posedge clk or posedge rst)</code>: Behavioral trigger: activates on either clock rising edge or reset rising edge.",
        "<code>begin ... end</code>: Delimits the procedural statement block.",
        "<code>if (rst) q <= 1'b0;</code>: High-priority asynchronous reset: clears Q to 0.",
        "<code>else q <= d;</code>: If not resetting, on clock edge captures input D into Q using non-blocking <code>&lt;=</code>.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Omitting <code>reg</code> from output (writing <code>output q;</code> causes a compile error in procedural blocks).",
        "Using blocking assignment <code>=</code> instead of non-blocking <code>&lt;=</code> in flip-flops.",
        "Missing <code>posedge rst</code> in the sensitivity list (needed for asynchronous reset)."
      ]
    },
    {
      id: "jk_ff",
      title: "11. JK Flip-Flop (Behavioral Modeling)",
      topicId: 11,
      practiceId: "jk_ff",
      explanation: "A JK Flip-Flop is modeled in Behavioral Modeling using an `always` block with `case` or `if-else`. It supports Hold (00), Reset (01), Set (10), and Toggle (11).",
      booleanExpr: "Q_next = (J & ~Q) | (~K & Q)",
      truthTable: {
        headers: ["J", "K", "Q_next", "Operation / Behavior"],
        rows: [
          [0, 0, "Q", "Hold (No change)"],
          [0, 1, 0, "Reset (Q forced to 0)"],
          [1, 0, 1, "Set (Q forced to 1)"],
          [1, 1, "~Q", "Toggle (Inverts existing Q)"]
        ]
      },
      syntaxType: "Behavioral Modeling (Procedural case statement)",
      verilogCode1: `module jk_ff(clk,rst,j,k,q);
input clk,rst,j,k;
output reg q;
always @(posedge clk or posedge rst)
begin
  if (rst)
    q <= 1'b0;
  else
  begin
    case ({j, k})
      2'b00: q <= q;       // Hold
      2'b01: q <= 1'b0;    // Reset
      2'b10: q <= 1'b1;    // Set
      2'b11: q <= ~q;      // Toggle
    endcase
  end
end
endmodule`,
      verilogCode2: `// Alternative Style: Behavioral modeling using if-else
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
endmodule`,
      compulsoryElements: [
        "<code>module</code>, <code>endmodule</code>, <code>input</code>, <code>output</code>: Compulsory keywords.",
        "<code>output reg q;</code>: Compulsory <code>reg</code> for procedural assignment.",
        "<code>always @(posedge clk or posedge rst)</code>: Compulsory sensitivity header.",
        "<code>case ({j, k})</code> and <code>endcase</code>: Compulsory procedural case keywords.",
        "<code>&lt;=</code>: Non-blocking operator."
      ],
      userElements: [
        "<code>jk_ff</code>: Module name.",
        "<code>clk, rst, j, k</code>: Input variable names.",
        "<code>q</code>: Output register name."
      ],
      lineByLine: [
        "<code>module jk_ff(clk,rst,j,k,q);</code>: Declares JK flip-flop module.",
        "<code>input clk,rst,j,k;</code>: Declares clock, reset, and J/K inputs.",
        "<code>output reg q;</code>: Declares procedural output register <code>q</code>.",
        "<code>always @(posedge clk or posedge rst)</code>: Triggers on positive edges of clock or asynchronous reset.",
        "<code>if (rst) q <= 1'b0;</code>: Checks reset first: immediately clears <code>q</code>.",
        "<code>case ({j, k})</code>: Concatenates j and k into a 2-bit value to evaluate all 4 states.",
        "<code>2'b00: q <= q;</code>: Hold state (maintains current value).",
        "<code>2'b01: q <= 1'b0;</code>: Reset state (forces output to 0).",
        "<code>2'b10: q <= 1'b1;</code>: Set state (forces output to 1).",
        "<code>2'b11: q <= ~q;</code>: Toggle state (inverts current output).",
        "<code>endcase</code>: Closes case block.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Confusing J and K: J is Set, K is Reset.",
        "Forgetting <code>endcase</code> before <code>end</code>.",
        "Using <code>=</code> instead of <code>&lt;=</code>."
      ]
    }
  ];

  return lessons;
}));
