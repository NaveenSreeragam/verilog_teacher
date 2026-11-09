/**
 * Problem definitions for Verilog Basics Lab.
 * Defines required ports, starter templates, reference solutions, and test cases.
 * Includes all gates, arithmetic circuits (Half Adder, Full Adder, Half Subtractor, Full Subtractor),
 * Multiplexers, Demultiplexers, and Flip-Flops.
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
      description: "Implement a 2-input AND gate. The output Y is 1 only when both A and B are 1.",
      moduleName: "and_gate",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module and_gate(Y,A,B);\ninput A,B;\noutput Y;",
      starterCode: "module and_gate(Y,A,B);\n  input A,B;\n  output Y;\n  // Write in Dataflow (assign Y=A&B;), Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module and_gate(Y,A,B);\n  input A,B;\n  output Y;\n  assign Y=A&B;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { Y: 0 } },
        { inputs: { A: 0, B: 1 }, expected: { Y: 0 } },
        { inputs: { A: 1, B: 0 }, expected: { Y: 0 } },
        { inputs: { A: 1, B: 1 }, expected: { Y: 1 } }
      ]
    },
    {
      id: "or_gate",
      title: "2. OR Gate",
      topicId: 2,
      description: "Implement a 2-input OR gate. The output Y is 1 if either A or B (or both) are 1.",
      moduleName: "or_gate",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module or_gate(A,B,Y);\ninput A,B;\noutput Y;",
      starterCode: "module or_gate(A,B,Y);\n  input A,B;\n  output Y;\n  // Write in Dataflow (assign Y=A|B;), Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module or_gate(A,B,Y);\n  input A,B;\n  output Y;\n  assign Y=A|B;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { Y: 0 } },
        { inputs: { A: 0, B: 1 }, expected: { Y: 1 } },
        { inputs: { A: 1, B: 0 }, expected: { Y: 1 } },
        { inputs: { A: 1, B: 1 }, expected: { Y: 1 } }
      ]
    },
    {
      id: "not_gate",
      title: "3. NOT Gate",
      topicId: 3,
      description: "Implement a 1-input NOT gate (inverter). The output Y is the inversion of input A.",
      moduleName: "not_gate",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "Y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module not_gate(A,Y);\ninput A;\noutput Y;",
      starterCode: "module not_gate(A,Y);\n  input A;\n  output Y;\n  // Write in Dataflow (assign Y=~A;), Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module not_gate(A,Y);\n  input A;\n  output Y;\n  assign Y=~A;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0 }, expected: { Y: 1 } },
        { inputs: { A: 1 }, expected: { Y: 0 } }
      ]
    },
    {
      id: "nand_gate",
      title: "4. NAND Gate",
      topicId: 4,
      description: "Implement a 2-input NAND gate. The output Y is 0 only when both inputs A and B are 1, otherwise 1.",
      moduleName: "nand_gate",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module nand_gate(A,B,Y);\ninput A,B;\noutput Y;",
      starterCode: "module nand_gate(A,B,Y);\n  input A,B;\n  output Y;\n  // Write in Dataflow (assign Y=~(A&B);), Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module nand_gate(A,B,Y);\n  input A,B;\n  output Y;\n  assign Y=~(A&B);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { Y: 1 } },
        { inputs: { A: 0, B: 1 }, expected: { Y: 1 } },
        { inputs: { A: 1, B: 0 }, expected: { Y: 1 } },
        { inputs: { A: 1, B: 1 }, expected: { Y: 0 } }
      ]
    },
    {
      id: "nor_gate",
      title: "5. NOR Gate",
      topicId: 5,
      description: "Implement a 2-input NOR gate. The output Y is 1 only when both A and B are 0.",
      moduleName: "nor_gate",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module nor_gate(A,B,Y);\ninput A,B;\noutput Y;",
      starterCode: "module nor_gate(A,B,Y);\n  input A,B;\n  output Y;\n  // Write in Dataflow (assign Y=~(A|B);), Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module nor_gate(A,B,Y);\n  input A,B;\n  output Y;\n  assign Y=~(A|B);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { Y: 1 } },
        { inputs: { A: 0, B: 1 }, expected: { Y: 0 } },
        { inputs: { A: 1, B: 0 }, expected: { Y: 0 } },
        { inputs: { A: 1, B: 1 }, expected: { Y: 0 } }
      ]
    },
    {
      id: "xor_gate",
      title: "6. XOR Gate",
      topicId: 6,
      description: "Implement a 2-input XOR gate. The output Y is 1 when inputs A and B differ.",
      moduleName: "xor_gate",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module xor_gate(A,B,Y);\ninput A,B;\noutput Y;",
      starterCode: "module xor_gate(A,B,Y);\n  input A,B;\n  output Y;\n  // Write in Dataflow (assign Y=A^B;), Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module xor_gate(A,B,Y);\n  input A,B;\n  output Y;\n  assign Y=A^B;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { Y: 0 } },
        { inputs: { A: 0, B: 1 }, expected: { Y: 1 } },
        { inputs: { A: 1, B: 0 }, expected: { Y: 1 } },
        { inputs: { A: 1, B: 1 }, expected: { Y: 0 } }
      ]
    },
    {
      id: "xnor_gate",
      title: "7. XNOR Gate",
      topicId: 7,
      description: "Implement a 2-input XNOR gate. The output Y is 1 when both inputs are equal.",
      moduleName: "xnor_gate",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module xnor_gate(A,B,Y);\ninput A,B;\noutput Y;",
      starterCode: "module xnor_gate(A,B,Y);\n  input A,B;\n  output Y;\n  // Write in Dataflow (assign Y=A~^B;), Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module xnor_gate(A,B,Y);\n  input A,B;\n  output Y;\n  assign Y=A~^B;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { Y: 1 } },
        { inputs: { A: 0, B: 1 }, expected: { Y: 0 } },
        { inputs: { A: 1, B: 0 }, expected: { Y: 0 } },
        { inputs: { A: 1, B: 1 }, expected: { Y: 1 } }
      ]
    },
    {
      id: "half_adder",
      title: "8. Half Adder",
      topicId: 8,
      description: "Implement a Half Adder with inputs A and B, producing Sum (S) and Carry (C). S = A ^ B, C = A & B.",
      moduleName: "half_adder",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "S", direction: "output", width: 1 },
        { name: "C", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module half_adder(A,B,S,C);\ninput A,B;\noutput S,C;",
      starterCode: "module half_adder(A,B,S,C);\n  input A,B;\n  output S,C;\n  // Dataflow: assign S=A^B; assign C=A&B;\n  // Structural: xor(S,A,B); and(C,A,B);\n  \nendmodule\n",
      solutionCode: "module half_adder(A,B,S,C);\n  input A,B;\n  output S,C;\n  assign S=A^B;\n  assign C=A&B;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { S: 0, C: 0 } },
        { inputs: { A: 0, B: 1 }, expected: { S: 1, C: 0 } },
        { inputs: { A: 1, B: 0 }, expected: { S: 1, C: 0 } },
        { inputs: { A: 1, B: 1 }, expected: { S: 0, C: 1 } }
      ]
    },
    {
      id: "full_adder",
      title: "9. Full Adder",
      topicId: 9,
      description: "Implement a Full Adder with inputs A, B, and Cin, producing Sum (S) and Cout. S = A ^ B ^ Cin, Cout = (A & B) | (B & Cin) | (A & Cin).",
      moduleName: "full_adder",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Cin", direction: "input", width: 1 },
        { name: "S", direction: "output", width: 1 },
        { name: "Cout", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module full_adder(A,B,Cin,S,Cout);\ninput A,B,Cin;\noutput S,Cout;",
      starterCode: "module full_adder(A,B,Cin,S,Cout);\n  input A,B,Cin;\n  output S,Cout;\n  // Write using Dataflow, Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module full_adder(A,B,Cin,S,Cout);\n  input A,B,Cin;\n  output S,Cout;\n  assign S = A ^ B ^ Cin;\n  assign Cout = (A & B) | (B & Cin) | (A & Cin);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0, Cin: 0 }, expected: { S: 0, Cout: 0 } },
        { inputs: { A: 0, B: 0, Cin: 1 }, expected: { S: 1, Cout: 0 } },
        { inputs: { A: 0, B: 1, Cin: 0 }, expected: { S: 1, Cout: 0 } },
        { inputs: { A: 0, B: 1, Cin: 1 }, expected: { S: 0, Cout: 1 } },
        { inputs: { A: 1, B: 0, Cin: 0 }, expected: { S: 1, Cout: 0 } },
        { inputs: { A: 1, B: 0, Cin: 1 }, expected: { S: 0, Cout: 1 } },
        { inputs: { A: 1, B: 1, Cin: 0 }, expected: { S: 0, Cout: 1 } },
        { inputs: { A: 1, B: 1, Cin: 1 }, expected: { S: 1, Cout: 1 } }
      ]
    },
    {
      id: "half_subtractor",
      title: "10. Half Subtractor",
      topicId: 10,
      description: "Implement a Half Subtractor with inputs A and B, producing Difference (Diff) and Borrow (Borrow). Diff = A ^ B, Borrow = ~A & B.",
      moduleName: "half_subtractor",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Diff", direction: "output", width: 1 },
        { name: "Borrow", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module half_subtractor(A,B,Diff,Borrow);\ninput A,B;\noutput Diff,Borrow;",
      starterCode: "module half_subtractor(A,B,Diff,Borrow);\n  input A,B;\n  output Diff,Borrow;\n  // Dataflow: assign Diff=A^B; assign Borrow=~A&B;\n  \nendmodule\n",
      solutionCode: "module half_subtractor(A,B,Diff,Borrow);\n  input A,B;\n  output Diff,Borrow;\n  assign Diff=A^B;\n  assign Borrow=~A&B;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0 }, expected: { Diff: 0, Borrow: 0 } },
        { inputs: { A: 0, B: 1 }, expected: { Diff: 1, Borrow: 1 } },
        { inputs: { A: 1, B: 0 }, expected: { Diff: 1, Borrow: 0 } },
        { inputs: { A: 1, B: 1 }, expected: { Diff: 0, Borrow: 0 } }
      ]
    },
    {
      id: "full_subtractor",
      title: "11. Full Subtractor",
      topicId: 11,
      description: "Implement a Full Subtractor with inputs A, B, and Bin, producing Difference (Diff) and Bout. Diff = A ^ B ^ Bin, Bout = (~A & B) | (~(A ^ B) & Bin).",
      moduleName: "full_subtractor",
      requiredPorts: [
        { name: "A", direction: "input", width: 1 },
        { name: "B", direction: "input", width: 1 },
        { name: "Bin", direction: "input", width: 1 },
        { name: "Diff", direction: "output", width: 1 },
        { name: "Bout", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module full_subtractor(A,B,Bin,Diff,Bout);\ninput A,B,Bin;\noutput Diff,Bout;",
      starterCode: "module full_subtractor(A,B,Bin,Diff,Bout);\n  input A,B,Bin;\n  output Diff,Bout;\n  // Write using Dataflow, Behavioral, or Structural\n  \nendmodule\n",
      solutionCode: "module full_subtractor(A,B,Bin,Diff,Bout);\n  input A,B,Bin;\n  output Diff,Bout;\n  assign Diff = A ^ B ^ Bin;\n  assign Bout = (~A & B) | (~(A ^ B) & Bin);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { A: 0, B: 0, Bin: 0 }, expected: { Diff: 0, Bout: 0 } },
        { inputs: { A: 0, B: 0, Bin: 1 }, expected: { Diff: 1, Bout: 1 } },
        { inputs: { A: 0, B: 1, Bin: 0 }, expected: { Diff: 1, Bout: 1 } },
        { inputs: { A: 0, B: 1, Bin: 1 }, expected: { Diff: 0, Bout: 1 } },
        { inputs: { A: 1, B: 0, Bin: 0 }, expected: { Diff: 1, Bout: 0 } },
        { inputs: { A: 1, B: 0, Bin: 1 }, expected: { Diff: 0, Bout: 0 } },
        { inputs: { A: 1, B: 1, Bin: 0 }, expected: { Diff: 0, Bout: 0 } },
        { inputs: { A: 1, B: 1, Bin: 1 }, expected: { Diff: 1, Bout: 1 } }
      ]
    },
    {
      id: "mux_2to1",
      title: "12a. 2:1 Multiplexer",
      topicId: 12,
      description: "Implement a 2:1 Multiplexer. When sel is 0, out is d0. When sel is 1, out is d1.",
      moduleName: "mux_2to1",
      requiredPorts: [
        { name: "d0", direction: "input", width: 1 },
        { name: "d1", direction: "input", width: 1 },
        { name: "sel", direction: "input", width: 1 },
        { name: "y", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module mux_2to1(d0,d1,sel,y);\ninput d0,d1,sel;\noutput y;",
      starterCode: "module mux_2to1(d0,d1,sel,y);\n  input d0,d1,sel;\n  output y;\n  assign y = (~sel & d0) | (sel & d1);\nendmodule\n",
      solutionCode: "module mux_2to1(d0,d1,sel,y);\n  input d0,d1,sel;\n  output y;\n  assign y = (~sel & d0) | (sel & d1);\nendmodule\n",
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
      id: "mux4_1",
      title: "12b. 4:1 Multiplexer (Dataflow)",
      topicId: 12,
      description: "Implement a 4:1 Multiplexer in textbook dataflow modeling using inputs `s0, s1`, a 4-bit bus `in[3:0]`, and output `out`.",
      moduleName: "mux4_1",
      requiredPorts: [
        { name: "s0", direction: "input", width: 1 },
        { name: "s1", direction: "input", width: 1 },
        { name: "in", direction: "input", width: 4 },
        { name: "out", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module mux4_1(in,s0,s1,out);\ninput s0,s1;\ninput [3:0]in;\noutput out;",
      starterCode: "module mux4_1(in,s0,s1,out);\n  input s0,s1;\n  input [3:0]in;\n  output out;\n  // Textbook dataflow equation\n  assign out=(~s1&~s0&in[0])|(~s1&s0&in[1])|(s1&~s0&in[2])|(s1&s0&in[3]);\nendmodule\n",
      solutionCode: "module mux4_1(in,s0,s1,out);\n  input s0,s1;\n  input [3:0]in;\n  output out;\n  assign out=(~s1&~s0&in[0])|(~s1&s0&in[1])|(s1&~s0&in[2])|(s1&s0&in[3]);\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { in: 1, s0: 0, s1: 0 }, expected: { out: 1 } },
        { inputs: { in: 0, s0: 0, s1: 0 }, expected: { out: 0 } },
        { inputs: { in: 2, s0: 1, s1: 0 }, expected: { out: 1 } },
        { inputs: { in: 1, s0: 1, s1: 0 }, expected: { out: 0 } },
        { inputs: { in: 4, s0: 0, s1: 1 }, expected: { out: 1 } },
        { inputs: { in: 2, s0: 0, s1: 1 }, expected: { out: 0 } },
        { inputs: { in: 8, s0: 1, s1: 1 }, expected: { out: 1 } },
        { inputs: { in: 4, s0: 1, s1: 1 }, expected: { out: 0 } }
      ]
    },
    {
      id: "demux_1to2",
      title: "13a. 1:2 Demultiplexer",
      topicId: 13,
      description: "Implement a 1:2 Demultiplexer with input `d`, select `sel`, and outputs `y0, y1`.",
      moduleName: "demux_1to2",
      requiredPorts: [
        { name: "d", direction: "input", width: 1 },
        { name: "sel", direction: "input", width: 1 },
        { name: "y0", direction: "output", width: 1 },
        { name: "y1", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module demux_1to2(d,sel,y0,y1);\ninput d,sel;\noutput y0,y1;",
      starterCode: "module demux_1to2(d,sel,y0,y1);\n  input d,sel;\n  output y0,y1;\n  assign y0 = ~sel & d;\n  assign y1 = sel & d;\nendmodule\n",
      solutionCode: "module demux_1to2(d,sel,y0,y1);\n  input d,sel;\n  output y0,y1;\n  assign y0 = ~sel & d;\n  assign y1 = sel & d;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { d: 0, sel: 0 }, expected: { y0: 0, y1: 0 } },
        { inputs: { d: 1, sel: 0 }, expected: { y0: 1, y1: 0 } },
        { inputs: { d: 0, sel: 1 }, expected: { y0: 0, y1: 0 } },
        { inputs: { d: 1, sel: 1 }, expected: { y0: 0, y1: 1 } }
      ]
    },
    {
      id: "demux1_4",
      title: "13b. 1:4 Demultiplexer (Dataflow)",
      topicId: 13,
      description: "Implement a 1:4 Demultiplexer in textbook dataflow modeling with inputs `s0, s1, in` and a 4-bit output vector `out[3:0]`.",
      moduleName: "demux1_4",
      requiredPorts: [
        { name: "s0", direction: "input", width: 1 },
        { name: "s1", direction: "input", width: 1 },
        { name: "in", direction: "input", width: 1 },
        { name: "out", direction: "output", width: 4 }
      ],
      portDeclarationStr: "module demux1_4(in,s0,s1,out);\ninput s0,s1,in;\noutput [3:0]out;",
      starterCode: "module demux1_4(in,s0,s1,out);\n  input s0,s1,in;\n  output [3:0]out;\n  assign out[0]=~s1&~s0&in;\n  assign out[1]=~s1&s0&in;\n  assign out[2]=s1&~s0&in;\n  assign out[3]=s1&s0&in;\nendmodule\n",
      solutionCode: "module demux1_4(in,s0,s1,out);\n  input s0,s1,in;\n  output [3:0]out;\n  assign out[0]=~s1&~s0&in;\n  assign out[1]=~s1&s0&in;\n  assign out[2]=s1&~s0&in;\n  assign out[3]=s1&s0&in;\nendmodule\n",
      type: "combinational",
      tests: [
        { inputs: { in: 1, s0: 0, s1: 0 }, expected: { out: 1 } },
        { inputs: { in: 0, s0: 0, s1: 0 }, expected: { out: 0 } },
        { inputs: { in: 1, s0: 1, s1: 0 }, expected: { out: 2 } },
        { inputs: { in: 1, s0: 0, s1: 1 }, expected: { out: 4 } },
        { inputs: { in: 1, s0: 1, s1: 1 }, expected: { out: 8 } }
      ]
    },
    {
      id: "d_ff",
      title: "14. D Flip-Flop (Behavioral)",
      topicId: 14,
      description: "Implement a D Flip-Flop using Behavioral Modeling with an `always` procedural block and asynchronous active-high reset (`rst`).",
      moduleName: "d_ff",
      requiredPorts: [
        { name: "clk", direction: "input", width: 1 },
        { name: "rst", direction: "input", width: 1 },
        { name: "d", direction: "input", width: 1 },
        { name: "q", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module d_ff(clk,rst,d,q);\ninput clk,rst,d;\noutput reg q;",
      starterCode: "module d_ff(clk,rst,d,q);\n  input clk,rst,d;\n  output reg q;\n  always @(posedge clk or posedge rst) begin\n    if (rst)\n      q <= 1'b0;\n    else\n      q <= d;\n  end\nendmodule\n",
      solutionCode: "module d_ff(clk,rst,d,q);\n  input clk,rst,d;\n  output reg q;\n  always @(posedge clk or posedge rst) begin\n    if (rst)\n      q <= 1'b0;\n    else\n      q <= d;\n  end\nendmodule\n",
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
      title: "15. JK Flip-Flop (Behavioral)",
      topicId: 15,
      description: "Implement a JK Flip-Flop using Behavioral Modeling with asynchronous active-high reset (`rst`).",
      moduleName: "jk_ff",
      requiredPorts: [
        { name: "clk", direction: "input", width: 1 },
        { name: "rst", direction: "input", width: 1 },
        { name: "j", direction: "input", width: 1 },
        { name: "k", direction: "input", width: 1 },
        { name: "q", direction: "output", width: 1 }
      ],
      portDeclarationStr: "module jk_ff(clk,rst,j,k,q);\ninput clk,rst,j,k;\noutput reg q;",
      starterCode: "module jk_ff(clk,rst,j,k,q);\n  input clk,rst,j,k;\n  output reg q;\n  always @(posedge clk or posedge rst) begin\n    if (rst)\n      q <= 1'b0;\n    else begin\n      case ({j, k})\n        2'b00: q <= q;       // Hold\n        2'b01: q <= 1'b0;    // Reset\n        2'b10: q <= 1'b1;    // Set\n        2'b11: q <= ~q;      // Toggle\n      endcase\n    end\n  end\nendmodule\n",
      solutionCode: "module jk_ff(clk,rst,j,k,q);\n  input clk,rst,j,k;\n  output reg q;\n  always @(posedge clk or posedge rst) begin\n    if (rst)\n      q <= 1'b0;\n    else begin\n      case ({j, k})\n        2'b00: q <= q;\n        2'b01: q <= 1'b0;\n        2'b10: q <= 1'b1;\n        2'b11: q <= ~q;\n      endcase\n    end\n  end\nendmodule\n",
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
