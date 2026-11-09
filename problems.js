/**
 * Problem definitions for Verilog Basics Lab.
 * Defines required ports, starter templates, reference solutions, and test cases.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VerilogProblems = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  var problems = [
    {
      id: "and_gate",
      title: "1. AND Gate",
      topicId: 1,
      description: "Implement a 2-input AND gate. The output `y` is 1 only when both `a` and `b` are 1.",
      moduleName: "and_gate",
      requiredPorts: [
        { name: "a", direction: "input", width: 1 },
        { name: "b", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module and_gate(input a, input b, output y);",
      starterCode: "module and_gate(input a, input b, output y);\n  // Write your code here using assign or gate primitive\n  \nendmodule\n",
      solutionCode: "module and_gate(input a, input b, output y);\n  assign y = a & b;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { a: 0, b: 0 }, expected: { y: 0 } },
        { inputs: { a: 0, b: 1 }, expected: { y: 0 } },
        { inputs: { a: 1, b: 0 }, expected: { y: 0 } },
        { inputs: { a: 1, b: 1 }, expected: { y: 1 } }
      ]
    },
    {
      id: "or_gate",
      title: "2. OR Gate",
      topicId: 2,
      description: "Implement a 2-input OR gate. The output `y` is 1 if either `a` or `b` (or both) are 1.",
      moduleName: "or_gate",
      requiredPorts: [
        { name: "a", direction: "input", width: 1 },
        { name: "b", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module or_gate(input a, input b, output y);",
      starterCode: "module or_gate(input a, input b, output y);\n  // Write your code here\n  \nendmodule\n",
      solutionCode: "module or_gate(input a, input b, output y);\n  assign y = a | b;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { a: 0, b: 0 }, expected: { y: 0 } },
        { inputs: { a: 0, b: 1 }, expected: { y: 1 } },
        { inputs: { a: 1, b: 0 }, expected: { y: 1 } },
        { inputs: { a: 1, b: 1 }, expected: { y: 1 } }
      ]
    },
    {
      id: "not_gate",
      title: "3. NOT Gate",
      topicId: 3,
      description: "Implement a 1-input NOT gate (inverter). The output `y` is the inversion of input `a`.",
      moduleName: "not_gate",
      requiredPorts: [
        { name: "a", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module not_gate(input a, output y);",
      starterCode: "module not_gate(input a, output y);\n  // Write your code here\n  \nendmodule\n",
      solutionCode: "module not_gate(input a, output y);\n  assign y = ~a;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { a: 0 }, expected: { y: 1 } },
        { inputs: { a: 1 }, expected: { y: 0 } }
      ]
    },
    {
      id: "nand_gate",
      title: "4. NAND Gate",
      topicId: 4,
      description: "Implement a 2-input NAND gate. The output `y` is 0 only when both inputs `a` and `b` are 1, otherwise 1.",
      moduleName: "nand_gate",
      requiredPorts: [
        { name: "a", direction: "input", width: 1 },
        { name: "b", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module nand_gate(input a, input b, output y);",
      starterCode: "module nand_gate(input a, input b, output y);\n  // Write your code here\n  \nendmodule\n",
      solutionCode: "module nand_gate(input a, input b, output y);\n  assign y = ~(a & b);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { a: 0, b: 0 }, expected: { y: 1 } },
        { inputs: { a: 0, b: 1 }, expected: { y: 1 } },
        { inputs: { a: 1, b: 0 }, expected: { y: 1 } },
        { inputs: { a: 1, b: 1 }, expected: { y: 0 } }
      ]
    },
    {
      id: "nor_gate",
      title: "5. NOR Gate",
      topicId: 5,
      description: "Implement a 2-input NOR gate. The output `y` is 1 only when both `a` and `b` are 0.",
      moduleName: "nor_gate",
      requiredPorts: [
        { name: "a", direction: "input", width: 1 },
        { name: "b", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module nor_gate(input a, input b, output y);",
      starterCode: "module nor_gate(input a, input b, output y);\n  // Write your code here\n  \nendmodule\n",
      solutionCode: "module nor_gate(input a, input b, output y);\n  assign y = ~(a | b);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { a: 0, b: 0 }, expected: { y: 1 } },
        { inputs: { a: 0, b: 1 }, expected: { y: 0 } },
        { inputs: { a: 1, b: 0 }, expected: { y: 0 } },
        { inputs: { a: 1, b: 1 }, expected: { y: 0 } }
      ]
    },
    {
      id: "xor_gate",
      title: "6. XOR Gate",
      topicId: 6,
      description: "Implement a 2-input XOR (exclusive OR) gate. The output `y` is 1 when inputs `a` and `b` differ.",
      moduleName: "xor_gate",
      requiredPorts: [
        { name: "a", direction: "input", width: 1 },
        { name: "b", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module xor_gate(input a, input b, output y);",
      starterCode: "module xor_gate(input a, input b, output y);\n  // Write your code here\n  \nendmodule\n",
      solutionCode: "module xor_gate(input a, input b, output y);\n  assign y = a ^ b;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { a: 0, b: 0 }, expected: { y: 0 } },
        { inputs: { a: 0, b: 1 }, expected: { y: 1 } },
        { inputs: { a: 1, b: 0 }, expected: { y: 1 } },
        { inputs: { a: 1, b: 1 }, expected: { y: 0 } }
      ]
    },
    {
      id: "xnor_gate",
      title: "7. XNOR Gate",
      topicId: 7,
      description: "Implement a 2-input XNOR (exclusive NOR) gate. The output `y` is 1 when both inputs are equal.",
      moduleName: "xnor_gate",
      requiredPorts: [
        { name: "a", direction: "input", width: 1 },
        { name: "b", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module xnor_gate(input a, input b, output y);",
      starterCode: "module xnor_gate(input a, input b, output y);\n  // Write your code here\n  \nendmodule\n",
      solutionCode: "module xnor_gate(input a, input b, output y);\n  assign y = ~(a ^ b);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { a: 0, b: 0 }, expected: { y: 1 } },
        { inputs: { a: 0, b: 1 }, expected: { y: 0 } },
        { inputs: { a: 1, b: 0 }, expected: { y: 0 } },
        { inputs: { a: 1, b: 1 }, expected: { y: 1 } }
      ]
    },
    {
      id: "mux_2to1",
      title: "8a. 2:1 Multiplexer",
      topicId: 8,
      description: "Implement a 2:1 Multiplexer. When `sel` is 0, output `y` is `d0`. When `sel` is 1, output `y` is `d1`.",
      moduleName: "mux_2to1",
      requiredPorts: [
        { name: "d0", direction: "input", width: 1 },
        { name: "d1", direction: "input", width: 1 },
        { name: "sel", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module mux_2to1(input d0, input d1, input sel, output y);",
      starterCode: "module mux_2to1(input d0, input d1, input sel, output y);\n  // Hint: assign y = sel ? d1 : d0;\n  \nendmodule\n",
      solutionCode: "module mux_2to1(input d0, input d1, input sel, output y);\n  assign y = sel ? d1 : d0;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { d0: 0, d1: 0, sel: 0 }, expected: { y: 0 } },
        { inputs: { d0: 1, d1: 0, sel: 0 }, expected: { y: 1 } },
        { inputs: { d0: 0, d1: 1, sel: 0 }, expected: { y: 0 } },
        { inputs: { d0: 1, d1: 1, sel: 0 }, expected: { y: 1 } },
        { inputs: { d0: 0, d1: 0, sel: 1 }, expected: { y: 0 } },
        { inputs: { d0: 1, d1: 0, sel: 1 }, expected: { y: 0 } },
        { inputs: { d0: 0, d1: 1, sel: 1 }, expected: { y: 1 } },
        { inputs: { d0: 1, d1: 1, sel: 1 }, expected: { y: 1 } }
      ]
    },
    {
      id: "mux_4to1",
      title: "8b. 4:1 Multiplexer",
      topicId: 8,
      description: "Implement a 4:1 Multiplexer with a 2-bit select signal `sel[1:0]`. When `sel` is 00 -> `d0`, 01 -> `d1`, 10 -> `d2`, 11 -> `d3`.",
      moduleName: "mux_4to1",
      requiredPorts: [
        { name: "d0", direction: "input", width: 1 },
        { name: "d1", direction: "input", width: 1 },
        { name: "d2", direction: "input", width: 1 },
        { name: "d3", direction: "input", width: 1 },
        { name: "sel", direction: "input", width: 2 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module mux_4to1(input d0, input d1, input d2, input d3, input [1:0] sel, output y);",
      starterCode: "module mux_4to1(input d0, input d1, input d2, input d3, input [1:0] sel, output y);\n  // You can use conditional operator ?: or always @(*) with case\n  \nendmodule\n",
      solutionCode: "module mux_4to1(input d0, input d1, input d2, input d3, input [1:0] sel, output y);\n  assign y = (sel == 2'b00) ? d0 :\n             (sel == 2'b01) ? d1 :\n             (sel == 2'b10) ? d2 : d3;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { d0: 1, d1: 0, d2: 0, d3: 0, sel: 0 }, expected: { y: 1 } },
        { inputs: { d0: 0, d1: 1, d2: 0, d3: 0, sel: 0 }, expected: { y: 0 } },
        { inputs: { d0: 0, d1: 1, d2: 0, d3: 0, sel: 1 }, expected: { y: 1 } },
        { inputs: { d0: 1, d1: 0, d2: 0, d3: 0, sel: 1 }, expected: { y: 0 } },
        { inputs: { d0: 0, d1: 0, d2: 1, d3: 0, sel: 2 }, expected: { y: 1 } },
        { inputs: { d0: 0, d1: 1, d2: 0, d3: 0, sel: 2 }, expected: { y: 0 } },
        { inputs: { d0: 0, d1: 0, d2: 0, d3: 1, sel: 3 }, expected: { y: 1 } },
        { inputs: { d0: 0, d1: 0, d2: 1, d3: 0, sel: 3 }, expected: { y: 0 } }
      ]
    },
    {
      id: "demux_1to2",
      title: "9a. 1:2 Demultiplexer",
      topicId: 9,
      description: "Implement a 1:2 Demultiplexer. Input `d` is routed to `y0` when `sel == 0` (with `y1 = 0`), and to `y1` when `sel == 1` (with `y0 = 0`).",
      moduleName: "demux_1to2",
      requiredPorts: [
        { name: "d", direction: "input", width: 1 },
        { name: "sel", direction: "input", width: 1 },
        { name: "y0", direction: "output", width: 1 },
        { name: "y1", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module demux_1to2(input d, input sel, output y0, output y1);",
      starterCode: "module demux_1to2(input d, input sel, output y0, output y1);\n  // Hint: assign y0 = ~sel & d;\n  //       assign y1 = sel & d;\n  \nendmodule\n",
      solutionCode: "module demux_1to2(input d, input sel, output y0, output y1);\n  assign y0 = ~sel & d;\n  assign y1 = sel & d;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { d: 0, sel: 0 }, expected: { y0: 0, y1: 0 } },
        { inputs: { d: 1, sel: 0 }, expected: { y0: 1, y1: 0 } },
        { inputs: { d: 0, sel: 1 }, expected: { y0: 0, y1: 0 } },
        { inputs: { d: 1, sel: 1 }, expected: { y0: 0, y1: 1 } }
      ]
    },
    {
      id: "demux_1to4",
      title: "9b. 1:4 Demultiplexer",
      topicId: 9,
      description: "Implement a 1:4 Demultiplexer with input `d` and 2-bit select `sel[1:0]`. Routes `d` to `y0` for `2'b00`, `y1` for `2'b01`, `y2` for `2'b10`, and `y3` for `2'b11`. Other outputs remain 0.",
      moduleName: "demux_1to4",
      requiredPorts: [
        { name: "d", direction: "input", width: 1 },
        { name: "sel", direction: "input", width: 2 },
        { name: "y0", direction: "output", width: 1 },
        { name: "y1", direction: "output", width: 1 },
        { name: "y2", direction: "output", width: 1 },
        { name: "y3", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module demux_1to4(input d, input [1:0] sel, output y0, output y1, output y2, output y3);",
      starterCode: "module demux_1to4(input d, input [1:0] sel, output y0, output y1, output y2, output y3);\n  // Assign each output based on matching sel bits\n  \nendmodule\n",
      solutionCode: "module demux_1to4(input d, input [1:0] sel, output y0, output y1, output y2, output y3);\n  assign y0 = (sel == 2'b00) ? d : 1'b0;\n  assign y1 = (sel == 2'b01) ? d : 1'b0;\n  assign y2 = (sel == 2'b10) ? d : 1'b0;\n  assign y3 = (sel == 2'b11) ? d : 1'b0;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { d: 1, sel: 0 }, expected: { y0: 1, y1: 0, y2: 0, y3: 0 } },
        { inputs: { d: 0, sel: 0 }, expected: { y0: 0, y1: 0, y2: 0, y3: 0 } },
        { inputs: { d: 1, sel: 1 }, expected: { y0: 0, y1: 1, y2: 0, y3: 0 } },
        { inputs: { d: 1, sel: 2 }, expected: { y0: 0, y1: 0, y2: 1, y3: 0 } },
        { inputs: { d: 1, sel: 3 }, expected: { y0: 0, y1: 0, y2: 0, y3: 1 } }
      ]
    },
    {
      id: "d_ff",
      title: "10. D Flip-Flop",
      topicId: 10,
      description: "Implement a positive edge-triggered D flip-flop with asynchronous active-high reset (`rst`). When `rst` is high, `q` immediately resets to 0. Otherwise on the rising clock edge (`posedge clk`), `q` captures `d`.",
      moduleName: "d_ff",
      requiredPorts: [
        { name: "clk", direction: "input", width: 1 },
        { name: "rst", direction: "input", width: 1 },
        { name: "d", direction: "input", width: 1 },
        { name: "q", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module d_ff(input clk, input rst, input d, output reg q);",
      starterCode: "module d_ff(input clk, input rst, input d, output reg q);\n  always @(posedge clk or posedge rst) begin\n    // Check asynchronous reset first\n    \n  end\nendmodule\n",
      solutionCode: "module d_ff(input clk, input rst, input d, output reg q);\n  always @(posedge clk or posedge rst) begin\n    if (rst)\n      q <= 1'b0;\n    else\n      q <= d;\n  end\nendmodule\n",
      type: "sequential",
      sequence: [
        { step: 1, clk: 0, rst: 1, d: 1, expectedQ: 0, note: "Reset applied (Q=0)" },
        { step: 2, clk: 1, rst: 0, d: 1, clkEdge: "posedge", expectedQ: 1, note: "Posedge clk, D=1 -> Q becomes 1" },
        { step: 3, clk: 1, rst: 0, d: 0, clkEdge: "posedge", expectedQ: 0, note: "Posedge clk, D=0 -> Q becomes 0" },
        { step: 4, clk: 1, rst: 0, d: 1, clkEdge: "posedge", expectedQ: 1, note: "Posedge clk, D=1 -> Q becomes 1" },
        { step: 5, clk: 0, rst: 1, d: 1, expectedQ: 0, note: "Asynchronous reset asserts while D=1 -> Q becomes 0" }
      ]
    },
    {
      id: "jk_ff",
      title: "11. JK Flip-Flop",
      topicId: 11,
      description: "Implement a positive edge-triggered JK flip-flop with asynchronous active-high reset (`rst`). When `rst` is high, `q` resets to 0. Otherwise on `posedge clk`: J=0,K=0 (Hold); J=0,K=1 (Reset to 0); J=1,K=0 (Set to 1); J=1,K=1 (Toggle Q).",
      moduleName: "jk_ff",
      requiredPorts: [
        { name: "clk", direction: "input", width: 1 },
        { name: "rst", direction: "input", width: 1 },
        { name: "j", direction: "input", width: 1 },
        { name: "k", direction: "input", width: 1 },
        { name: "q", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module jk_ff(input clk, input rst, input j, input k, output reg q);",
      starterCode: "module jk_ff(input clk, input rst, input j, input k, output reg q);\n  always @(posedge clk or posedge rst) begin\n    if (rst)\n      q <= 1'b0;\n    else begin\n      case ({j, k})\n        2'b00: q <= q;       // No change\n        2'b01: q <= 1'b0;    // Reset\n        2'b10: q <= 1'b1;    // Set\n        2'b11: q <= ~q;      // Toggle\n      endcase\n    end\n  end\nendmodule\n",
      solutionCode: "module jk_ff(input clk, input rst, input j, input k, output reg q);\n  always @(posedge clk or posedge rst) begin\n    if (rst)\n      q <= 1'b0;\n    else begin\n      case ({j, k})\n        2'b00: q <= q;\n        2'b01: q <= 1'b0;\n        2'b10: q <= 1'b1;\n        2'b11: q <= ~q;\n      endcase\n    end\n  end\nendmodule\n",
      type: "sequential",
      sequence: [
        { step: 1, clk: 0, rst: 1, j: 0, k: 0, expectedQ: 0, note: "Async Reset active (Q=0)" },
        { step: 2, clk: 1, rst: 0, j: 1, k: 0, clkEdge: "posedge", expectedQ: 1, note: "SET: J=1, K=0 -> Q=1" },
        { step: 3, clk: 1, rst: 0, j: 0, k: 0, clkEdge: "posedge", expectedQ: 1, note: "HOLD: J=0, K=0 -> Q holds 1" },
        { step: 4, clk: 1, rst: 0, j: 0, k: 1, clkEdge: "posedge", expectedQ: 0, note: "RESET: J=0, K=1 -> Q=0" },
        { step: 5, clk: 1, rst: 0, j: 0, k: 0, clkEdge: "posedge", expectedQ: 0, note: "HOLD: J=0, K=0 -> Q holds 0" },
        { step: 6, clk: 1, rst: 0, j: 1, k: 1, clkEdge: "posedge", expectedQ: 1, note: "TOGGLE: J=1, K=1 from 0 -> Q=1" },
        { step: 7, clk: 1, rst: 0, j: 1, k: 1, clkEdge: "posedge", expectedQ: 0, note: "TOGGLE: J=1, K=1 from 1 -> Q=0" },
        { step: 8, clk: 0, rst: 1, j: 1, k: 0, expectedQ: 0, note: "Async Reset override (Q=0)" }
      ]
    }
  ];

  return problems;
}));

