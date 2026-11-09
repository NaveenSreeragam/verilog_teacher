/**
 * Lesson contents for Verilog Basics Lab.
 * Covers Topic 0 to 11 exactly as specified.
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
        <p class="lead">Welcome to Verilog! Verilog is a <strong>Hardware Description Language (HDL)</strong>. Unlike C or Python, which run code sequentially line by line on a CPU, Verilog describes physical electronic circuits where multiple components run simultaneously (in parallel).</p>

        <h3>1. What is a Module?</h3>
        <p>A <strong>module</strong> is the fundamental building block in Verilog, just like an integrated circuit (IC) chip. It has input pins, output pins, and internal hardware logic. Every module starts with <code>module &lt;name&gt;(...);</code> and ends with <code>endmodule</code> (notice: no semicolon after <code>endmodule</code>).</p>

        <h3>2. Input & Output Ports</h3>
        <p>Ports are the external pins connecting the module to the outside world:</p>
        <ul>
          <li><code>input a, b;</code> &mdash; Signals coming into your circuit.</li>
          <li><code>output y;</code> &mdash; Signals driven out of your circuit.</li>
          <li><code>input [1:0] sel;</code> &mdash; A 2-bit wide bus with bit 1 (MSB) and bit 0 (LSB).</li>
        </ul>

        <h3>3. <code>wire</code> vs <code>reg</code></h3>
        <ul>
          <li><strong><code>wire</code>:</strong> Represents a physical copper wire. It cannot store data; it merely carries a signal driven by something else (like an <code>assign</code> statement or a gate). Used for continuous combinational assignments.</li>
          <li><strong><code>reg</code>:</strong> Can hold a value between events. Any output assigned inside an <code>always</code> block (sequential or procedural) <strong>must</strong> be declared as <code>reg</code> (e.g. <code>output reg q;</code>).</li>
        </ul>

        <h3>4. <code>assign</code> vs <code>always</code> block</h3>
        <ul>
          <li><strong><code>assign</code>:</strong> Continuous assignment used for combinational logic. For example: <code>assign y = a & b;</code>. The output <code>y</code> updates immediately whenever <code>a</code> or <code>b</code> changes.</li>
          <li><strong><code>always @(*)</code>:</strong> Procedural block that evaluates whenever any input changes. Used for combinational logic using <code>if/else</code> or <code>case</code> statements.</li>
          <li><strong><code>always @(posedge clk or posedge rst)</code>:</strong> Triggered only on signal transitions (edges). Used for sequential circuits like flip-flops.</li>
        </ul>

        <h3>5. Blocking (<code>=</code>) vs Non-Blocking (<code>&lt;=</code>)</h3>
        <ul>
          <li><strong><code>=</code> (Blocking):</strong> Executes sequentially in the block. Use this inside combinational <code>always @(*)</code> blocks.</li>
          <li><strong><code>&lt;=</code> (Non-Blocking):</strong> All right-hand side expressions are evaluated first, then updated concurrently at the clock edge. <strong>Always use <code>&lt;=</code> in clocked flip-flops!</strong></li>
        </ul>

        <h3>6. What is a Testbench? (Concept)</h3>
        <p>A testbench is a simulation file that generates clock signals and input values over time to test your hardware module. It observes the outputs to check if your circuit works correctly before manufacturing the chip.</p>

        <h3>7. What is a Truth Table?</h3>
        <p>A truth table lists all possible binary combinations of inputs (0s and 1s) alongside the expected output for each combination. For 2 inputs, there are 2<sup>2</sup> = 4 combinations (00, 01, 10, 11).</p>

        <h3>8. Basic Syntax & Literals</h3>
        <ul>
          <li><strong>Semicolons:</strong> Every statement ends with <code>;</code>, except <code>begin</code>, <code>end</code>, and <code>endmodule</code>.</li>
          <li><strong>Comments:</strong> <code>// Single line comment</code> and <code>/* Multi-line comment */</code>.</li>
          <li><strong>Bit Literals:</strong> Format is <code>&lt;size&gt;'&lt;base&gt;&lt;value&gt;</code>:
            <ul>
              <li><code>1'b0</code> &mdash; 1-bit binary with value 0</li>
              <li><code>1'b1</code> &mdash; 1-bit binary with value 1</li>
              <li><code>2'b10</code> &mdash; 2-bit binary with value 2</li>
            </ul>
          </li>
        </ul>
      `
    },
    {
      id: "and_gate",
      title: "1. AND Gate",
      topicId: 1,
      practiceId: "and_gate",
      explanation: "An AND gate outputs 1 (HIGH) if and only if all of its inputs are 1. If any input is 0, the output is 0.",
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
      verilogCode1: `// Style 1: Dataflow modeling using 'assign'
module and_gate(input a, input b, output y);
  assign y = a & b; // Bitwise AND operator '&'
endmodule`,
      verilogCode2: `// Style 2: Gate primitive style
module and_gate(input a, input b, output y);
  and g1(y, a, b); // Built-in gate primitive: (output, input1, input2)
endmodule`,
      lineByLine: [
        "<code>module and_gate(input a, input b, output y);</code>: Declares the module named 'and_gate' with inputs a, b and output y.",
        "<code>assign y = a & b;</code>: Drives output y with the logical AND of a and b continuously.",
        "<code>and g1(y, a, b);</code>: Instantiates the built-in 'and' gate named g1 with output y and inputs a, b.",
        "<code>endmodule</code>: Closes the module definition."
      ],
      commonMistakes: [
        "Using <code>&&</code> (logical AND) instead of <code>&</code> (bitwise AND). While both work for 1-bit, <code>&</code> is standard for hardware synthesis.",
        "Declaring <code>output reg y;</code> when using <code>assign</code>. Signals driven by <code>assign</code> must be wires (the default for outputs).",
        "Forgetting the semicolon at the end of the <code>assign</code> line."
      ]
    },
    {
      id: "or_gate",
      title: "2. OR Gate",
      topicId: 2,
      practiceId: "or_gate",
      explanation: "An OR gate outputs 1 if at least one of its inputs is 1. The output is 0 only when all inputs are 0.",
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
      verilogCode1: `// Style 1: Dataflow modeling using 'assign'
module or_gate(input a, input b, output y);
  assign y = a | b; // Bitwise OR operator '|'
endmodule`,
      verilogCode2: `// Style 2: Gate primitive style
module or_gate(input a, input b, output y);
  or g1(y, a, b); // Built-in gate primitive: (output, input1, input2)
endmodule`,
      lineByLine: [
        "<code>module or_gate(input a, input b, output y);</code>: Declares module 'or_gate' with inputs a, b and output y.",
        "<code>assign y = a | b;</code>: Continuously drives y with the bitwise OR of a and b.",
        "<code>or g1(y, a, b);</code>: Gate-level instantiation of an OR primitive.",
        "<code>endmodule</code>: Terminates the module."
      ],
      commonMistakes: [
        "Confusing bitwise OR <code>|</code> with XOR <code>^</code>.",
        "Putting a semicolon after <code>endmodule</code> (it should be bare <code>endmodule</code>).",
        "Mixing up port order in gate primitives: output comes first in Verilog primitives!"
      ]
    },
    {
      id: "not_gate",
      title: "3. NOT Gate",
      topicId: 3,
      practiceId: "not_gate",
      explanation: "A NOT gate (inverter) inverts its single input: a 0 becomes 1, and a 1 becomes 0.",
      booleanExpr: "Y = ~A",
      truthTable: {
        headers: ["A", "Y"],
        rows: [
          [0, 1],
          [1, 0]
        ]
      },
      verilogCode1: `// Style 1: Dataflow modeling using 'assign'
module not_gate(input a, output y);
  assign y = ~a; // Bitwise NOT operator '~'
endmodule`,
      verilogCode2: `// Style 2: Gate primitive style
module not_gate(input a, output y);
  not n1(y, a); // Built-in gate primitive: (output, input)
endmodule`,
      lineByLine: [
        "<code>module not_gate(input a, output y);</code>: Declares module 'not_gate' with single input a and output y.",
        "<code>assign y = ~a;</code>: Drives y with the inverted bit of a using tilde <code>~</code>.",
        "<code>not n1(y, a);</code>: Gate primitive for an inverter where y is output, a is input.",
        "<code>endmodule</code>: Closes the module definition."
      ],
      commonMistakes: [
        "Using <code>!</code> instead of <code>~</code>. <code>~</code> is bitwise negation, which is standard in digital logic.",
        "Forgetting that NOT gate takes only one input, not two."
      ]
    },
    {
      id: "nand_gate",
      title: "4. NAND Gate",
      topicId: 4,
      practiceId: "nand_gate",
      explanation: "A NAND gate is an AND gate followed by an inverter. Its output is 0 only when all inputs are 1; otherwise, it is 1.",
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
      verilogCode1: `// Style 1: Dataflow modeling using 'assign'
module nand_gate(input a, input b, output y);
  assign y = ~(a & b); // Inverted AND operation
endmodule`,
      verilogCode2: `// Style 2: Gate primitive style
module nand_gate(input a, input b, output y);
  nand g1(y, a, b); // Built-in gate primitive: (output, input1, input2)
endmodule`,
      lineByLine: [
        "<code>module nand_gate(input a, input b, output y);</code>: Defines the NAND module.",
        "<code>assign y = ~(a & b);</code>: Evaluates (a & b) first, then inverts with <code>~</code>.",
        "<code>nand g1(y, a, b);</code>: Instantiates the built-in 'nand' gate primitive.",
        "<code>endmodule</code>: Closes the module."
      ],
      commonMistakes: [
        "Missing parentheses: writing <code>~a & b</code> inverts only <code>a</code>! Always write <code>~(a & b)</code>.",
        "Confusing NAND with NOR."
      ]
    },
    {
      id: "nor_gate",
      title: "5. NOR Gate",
      topicId: 5,
      practiceId: "nor_gate",
      explanation: "A NOR gate is an OR gate followed by an inverter. Its output is 1 only when both inputs are 0; otherwise, it is 0.",
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
      verilogCode1: `// Style 1: Dataflow modeling using 'assign'
module nor_gate(input a, input b, output y);
  assign y = ~(a | b); // Inverted OR operation
endmodule`,
      verilogCode2: `// Style 2: Gate primitive style
module nor_gate(input a, input b, output y);
  nor g1(y, a, b); // Built-in gate primitive: (output, input1, input2)
endmodule`,
      lineByLine: [
        "<code>module nor_gate(input a, input b, output y);</code>: Defines the NOR module.",
        "<code>assign y = ~(a | b);</code>: Computes OR first, then negates the result.",
        "<code>nor g1(y, a, b);</code>: Built-in NOR primitive.",
        "<code>endmodule</code>: Ends the module."
      ],
      commonMistakes: [
        "Forgetting parentheses around <code>(a | b)</code>.",
        "Misinterpreting truth table: NOR is 1 ONLY at 0-0."
      ]
    },
    {
      id: "xor_gate",
      title: "6. XOR Gate",
      topicId: 6,
      practiceId: "xor_gate",
      explanation: "An XOR (Exclusive OR) gate outputs 1 if the inputs are different (one is 1, the other is 0). If both are identical (both 0 or both 1), it outputs 0.",
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
      verilogCode1: `// Style 1: Dataflow modeling using 'assign'
module xor_gate(input a, input b, output y);
  assign y = a ^ b; // Caret '^' is the XOR operator in Verilog
endmodule`,
      verilogCode2: `// Style 2: Gate primitive style
module xor_gate(input a, input b, output y);
  xor g1(y, a, b); // Built-in gate primitive: (output, input1, input2)
endmodule`,
      lineByLine: [
        "<code>module xor_gate(input a, input b, output y);</code>: Defines XOR gate module.",
        "<code>assign y = a ^ b;</code>: The caret <code>^</code> performs bitwise exclusive OR.",
        "<code>xor g1(y, a, b);</code>: Built-in XOR gate primitive.",
        "<code>endmodule</code>: Ends module."
      ],
      commonMistakes: [
        "Confusing <code>^</code> (XOR) with exponentiation (in Verilog, <code>**</code> is exponent, <code>^</code> is always XOR).",
        "Writing <code>a != b</code> instead of <code>a ^ b</code> (while boolean result is similar for 1-bit, <code>^</code> is the standard hardware gate)."
      ]
    },
    {
      id: "xnor_gate",
      title: "7. XNOR Gate",
      topicId: 7,
      practiceId: "xnor_gate",
      explanation: "An XNOR gate outputs 1 when both inputs are equal (both 0 or both 1). It is an inverted XOR gate (equivalence detector).",
      booleanExpr: "Y = ~(A ^ B)  or  Y = A ~^ B",
      truthTable: {
        headers: ["A", "B", "Y"],
        rows: [
          [0, 0, 1],
          [0, 1, 0],
          [1, 0, 0],
          [1, 1, 1]
        ]
      },
      verilogCode1: `// Style 1: Dataflow modeling using 'assign'
module xnor_gate(input a, input b, output y);
  assign y = ~(a ^ b); // Inverted XOR (or use ~^ operator)
endmodule`,
      verilogCode2: `// Style 2: Gate primitive style
module xnor_gate(input a, input b, output y);
  xnor g1(y, a, b); // Built-in gate primitive: (output, input1, input2)
endmodule`,
      lineByLine: [
        "<code>module xnor_gate(input a, input b, output y);</code>: Defines XNOR module.",
        "<code>assign y = ~(a ^ b);</code>: Inverts the XOR operation so equal inputs produce 1.",
        "<code>xnor g1(y, a, b);</code>: Built-in XNOR gate primitive.",
        "<code>endmodule</code>: Ends module."
      ],
      commonMistakes: [
        "Writing <code>~a ^ b</code> without parentheses.",
        "Inverting both inputs individually (<code>~a ^ ~b</code>), which still results in XOR, not XNOR!"
      ]
    },
    {
      id: "multiplexers",
      title: "8. Multiplexers (2:1 and 4:1)",
      topicId: 8,
      practiceId: "mux_2to1",
      explanation: "A Multiplexer (MUX) acts as a digitally controlled switch. It selects one of several input lines and directs it to a single output line based on select (sel) control bits.",
      booleanExpr: "2:1 Mux: Y = (~sel & d0) | (sel & d1)   or   Y = sel ? d1 : d0",
      truthTable: {
        headers: ["sel", "d0", "d1", "Y"],
        rows: [
          [0, 0, 0, 0],
          [0, 1, 0, 1],
          [1, 0, 0, 0],
          [1, 0, 1, 1]
        ]
      },
      verilogCode1: `// 2:1 Multiplexer using conditional (ternary) operator
module mux_2to1(input d0, input d1, input sel, output y);
  assign y = sel ? d1 : d0; // If sel is 1 -> d1; else -> d0
endmodule`,
      verilogCode2: `// 4:1 Multiplexer with 2-bit select bus
module mux_4to1(input d0, input d1, input d2, input d3, input [1:0] sel, output y);
  assign y = (sel == 2'b00) ? d0 :
             (sel == 2'b01) ? d1 :
             (sel == 2'b10) ? d2 : d3;
endmodule`,
      lineByLine: [
        "<code>input [1:0] sel;</code>: Declares a 2-bit input bus for selecting 1 of 4 inputs.",
        "<code>assign y = sel ? d1 : d0;</code>: The ternary operator <code>condition ? true_val : false_val</code> creates multiplexer hardware in synthesis.",
        "<code>2'b00</code>: Verilog literal for 2-bit binary number 00.",
        "<code>endmodule</code>: Closes the module."
      ],
      commonMistakes: [
        "Inverting <code>d0</code> and <code>d1</code>: Remember that when <code>sel = 0</code>, <code>d0</code> is selected, and when <code>sel = 1</code>, <code>d1</code> is selected.",
        "Incorrect bus width for 4:1 mux: <code>sel</code> must be 2 bits wide (<code>[1:0]</code>)."
      ]
    },
    {
      id: "demultiplexers",
      title: "9. Demultiplexers (1:2 and 1:4)",
      topicId: 9,
      practiceId: "demux_1to2",
      explanation: "A Demultiplexer (DEMUX) takes a single data input and steers it to one of multiple output lines depending on the select signals. All unselected outputs remain 0.",
      booleanExpr: "1:2 Demux: y0 = ~sel & d,  y1 = sel & d",
      truthTable: {
        headers: ["sel", "d", "y0", "y1"],
        rows: [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 0, 0, 0],
          [1, 1, 0, 1]
        ]
      },
      verilogCode1: `// 1:2 Demultiplexer using assign
module demux_1to2(input d, input sel, output y0, output y1);
  assign y0 = ~sel & d; // Active when sel is 0
  assign y1 = sel & d;  // Active when sel is 1
endmodule`,
      verilogCode2: `// 1:4 Demultiplexer using assign with 2-bit select
module demux_1to4(input d, input [1:0] sel, output y0, output y1, output y2, output y3);
  assign y0 = (sel == 2'b00) ? d : 1'b0;
  assign y1 = (sel == 2'b01) ? d : 1'b0;
  assign y2 = (sel == 2'b10) ? d : 1'b0;
  assign y3 = (sel == 2'b11) ? d : 1'b0;
endmodule`,
      lineByLine: [
        "<code>assign y0 = ~sel & d;</code>: Passes input d to y0 only when sel is 0.",
        "<code>assign y1 = sel & d;</code>: Passes input d to y1 only when sel is 1.",
        "<code>1'b0</code>: Tied to constant low when unselected.",
        "<code>endmodule</code>: Closes the module."
      ],
      commonMistakes: [
        "Leaving unselected outputs unconnected (floating) instead of driving them to <code>1'b0</code>.",
        "Confusing MUX (many-to-one) with DEMUX (one-to-many)."
      ]
    },
    {
      id: "d_ff",
      title: "10. D Flip-Flop",
      topicId: 10,
      practiceId: "d_ff",
      explanation: "A D (Data) Flip-Flop stores 1 bit of information. On the rising edge of the clock (posedge clk), the input D is captured into output Q. With an asynchronous active-high reset (rst), whenever rst is 1, Q immediately clears to 0.",
      booleanExpr: "Q_next = rst ? 0 : D  (sampled at posedge clk)",
      truthTable: {
        headers: ["clk", "rst", "D", "Q_next", "Comment"],
        rows: [
          ["X", 1, "X", 0, "Asynchronous Reset"],
          ["↑", 0, 0, 0, "Clock edge: D=0 captured"],
          ["↑", 0, 1, 1, "Clock edge: D=1 captured"],
          ["0/1", 0, "X", "Q", "No clock edge: Hold state"]
        ]
      },
      verilogCode1: `// Positive edge-triggered D flip-flop with asynchronous reset
module d_ff(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst)
      q <= 1'b0; // Active-high asynchronous reset
    else
      q <= d;    // Non-blocking assignment capturing D
  end
endmodule`,
      verilogCode2: `// Alternative style with explicit comparison
module d_ff(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst == 1'b1) begin
      q <= 1'b0;
    end else begin
      q <= d;
    end
  end
endmodule`,
      lineByLine: [
        "<code>output reg q;</code>: Because q is assigned inside an always block, it must be declared as <code>reg</code>.",
        "<code>always @(posedge clk or posedge rst)</code>: Sensitivity list triggers on either rising clock edge OR rising reset edge.",
        "<code>if (rst) q <= 1'b0;</code>: Checks reset first (highest priority). Asynchronous reset clears output.",
        "<code>else q <= d;</code>: If not resetting, on clock edge, assigns D to Q using non-blocking <code>&lt;=</code>.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Using blocking assignment <code>=</code> instead of non-blocking <code>&lt;=</code>. For sequential logic/flip-flops, always use <code>&lt;=</code>.",
        "Forgetting <code>reg</code> keyword for output <code>q</code>.",
        "Forgetting <code>posedge rst</code> in the sensitivity list for asynchronous reset."
      ]
    },
    {
      id: "jk_ff",
      title: "11. JK Flip-Flop",
      topicId: 11,
      practiceId: "jk_ff",
      explanation: "A JK Flip-Flop is a universal flip-flop that avoids the invalid state of an SR flip-flop. Inputs J and K control state transitions: Hold (00), Reset to 0 (01), Set to 1 (10), and Toggle Q (11).",
      booleanExpr: "Characteristic equation: Q_next = (J & ~Q) | (~K & Q)",
      truthTable: {
        headers: ["J", "K", "Q_next", "Operation / Behavior"],
        rows: [
          [0, 0, "Q", "Hold (No change)"],
          [0, 1, 0, "Reset (Q forced to 0)"],
          [1, 0, 1, "Set (Q forced to 1)"],
          [1, 1, "~Q", "Toggle (Invert Q)"]
        ]
      },
      verilogCode1: `// JK Flip-Flop with asynchronous active-high reset using case
module jk_ff(input clk, input rst, input j, input k, output reg q);
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
      verilogCode2: `// JK Flip-Flop using if-else logic
module jk_ff(input clk, input rst, input j, input k, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst)
      q <= 1'b0;
    else if (j == 0 && k == 1)
      q <= 1'b0;
    else if (j == 1 && k == 0)
      q <= 1'b1;
    else if (j == 1 && k == 1)
      q <= ~q;
    // else j=0, k=0 maintains q
  end
endmodule`,
      lineByLine: [
        "<code>output reg q;</code>: q is procedural, so it is declared as <code>reg</code>.",
        "<code>always @(posedge clk or posedge rst)</code>: Triggered on rising edge of clk or reset.",
        "<code>case ({j, k})</code>: Concatenates j and k into a 2-bit value <code>{j, k}</code>.",
        "<code>2'b11: q <= ~q;</code>: When both J and K are 1, toggles the existing state of Q.",
        "<code>endmodule</code>: Closes module."
      ],
      commonMistakes: [
        "Confusing J and K roles: J acts like 'Set' (J=1, K=0 -> 1), K acts like 'Reset' (J=0, K=1 -> 0).",
        "Using <code>=</code> instead of <code>&lt;=</code>.",
        "Omitting <code>output reg q;</code>."
      ]
    }
  ];

  return lessons;
}));

