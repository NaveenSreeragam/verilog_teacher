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

// 2. Test Half Adder in Structural Modeling
const haStructural = `
module half_adder(A,B,S,C);
  input A,B;
  output S,C;
  xor g1(S, A, B);
  and g2(C, A, B);
endmodule
`;
const haProb = problems.find(p => p.id === 'half_adder');
const haStructRes = VerilogChecker.checkSolution(haStructural, haProb);
assert(haStructRes.status === 'correct', "Half Adder in Structural Modeling should pass", haStructRes);

// 3. Test Half Adder in Behavioral Modeling
const haBehavioral = `
module half_adder(A,B,S,C);
  input A,B;
  output reg S,C;
  always @(*) begin
    S = A ^ B;
    C = A & B;
  end
endmodule
`;
const haBehRes = VerilogChecker.checkSolution(haBehavioral, haProb);
assert(haBehRes.status === 'correct', "Half Adder in Behavioral Modeling should pass", haBehRes);

// 4. Test Full Adder in Structural Modeling
const faStructural = `
module full_adder(A,B,Cin,S,Cout);
  input A,B,Cin;
  output S,Cout;
  wire w1, w2, w3;
  xor g1(w1, A, B);
  xor g2(S, w1, Cin);
  and g3(w2, w1, Cin);
  and g4(w3, A, B);
  or  g5(Cout, w2, w3);
endmodule
`;
const faProb = problems.find(p => p.id === 'full_adder');
const faStructRes = VerilogChecker.checkSolution(faStructural, faProb);
assert(faStructRes.status === 'correct', "Full Adder in Structural Modeling should pass", faStructRes);

// 5. Test Full Adder in Behavioral Modeling
const faBehavioral = `
module full_adder(A,B,Cin,S,Cout);
  input A,B,Cin;
  output reg S,Cout;
  always @(*) begin
    S = A ^ B ^ Cin;
    Cout = (A & B) | (B & Cin) | (A & Cin);
  end
endmodule
`;
const faBehRes = VerilogChecker.checkSolution(faBehavioral, faProb);
assert(faBehRes.status === 'correct', "Full Adder in Behavioral Modeling should pass", faBehRes);

// 6. Test Half Subtractor in Structural Modeling
const hsStructural = `
module half_subtractor(A,B,Diff,Borrow);
  input A,B;
  output Diff,Borrow;
  wire w1;
  xor g1(Diff, A, B);
  not g2(w1, A);
  and g3(Borrow, w1, B);
endmodule
`;
const hsProb = problems.find(p => p.id === 'half_subtractor');
const hsStructRes = VerilogChecker.checkSolution(hsStructural, hsProb);
assert(hsStructRes.status === 'correct', "Half Subtractor in Structural Modeling should pass", hsStructRes);

// 7. Test Full Subtractor in Structural Modeling
const fsStructural = `
module full_subtractor(A,B,Bin,Diff,Bout);
  input A,B,Bin;
  output Diff,Bout;
  wire w1, w2, w3, notA, w4;
  xor g1(w1, A, B);
  xor g2(Diff, w1, Bin);
  not g3(w2, w1);
  and g4(w3, w2, Bin);
  not g5(notA, A);
  and g6(w4, notA, B);
  or  g7(Bout, w3, w4);
endmodule
`;
const fsProb = problems.find(p => p.id === 'full_subtractor');
const fsStructRes = VerilogChecker.checkSolution(fsStructural, fsProb);
assert(fsStructRes.status === 'correct', "Full Subtractor in Structural Modeling should pass", fsStructRes);

// 8. Test AND gate in all 3 styles
const andProb = problems.find(p => p.id === 'and_gate');
const andDataflow = `module and_gate(Y,A,B); input A,B; output Y; assign Y = A & B; endmodule`;
const andBehavioral = `module and_gate(Y,A,B); input A,B; output reg Y; always @(*) Y = A & B; endmodule`;
const andStructural = `module and_gate(Y,A,B); input A,B; output Y; and g1(Y, A, B); endmodule`;
assert(VerilogChecker.checkSolution(andDataflow, andProb).status === 'correct', "AND Gate in Dataflow should pass");
assert(VerilogChecker.checkSolution(andBehavioral, andProb).status === 'correct', "AND Gate in Behavioral should pass");
assert(VerilogChecker.checkSolution(andStructural, andProb).status === 'correct', "AND Gate in Structural should pass");

// 9. Test OR gate in all 3 styles
const orProb = problems.find(p => p.id === 'or_gate');
const orStructural = `module or_gate(A,B,Y); input A,B; output Y; or g1(Y, A, B); endmodule`;
assert(VerilogChecker.checkSolution(orStructural, orProb).status === 'correct', "OR Gate in Structural should pass");

// 10. Test NOT gate in all 3 styles
const notProb = problems.find(p => p.id === 'not_gate');
const notStructural = `module not_gate(A,Y); input A; output Y; not n1(Y, A); endmodule`;
assert(VerilogChecker.checkSolution(notStructural, notProb).status === 'correct', "NOT Gate in Structural should pass");

// 11. Test XOR gate in all 3 styles
const xorProb = problems.find(p => p.id === 'xor_gate');
const xorStructural = `module xor_gate(A,B,Y); input A,B; output Y; xor g1(Y, A, B); endmodule`;
assert(VerilogChecker.checkSolution(xorStructural, xorProb).status === 'correct', "XOR Gate in Structural should pass");

// 12. Test Wrong XOR detection
const wrongXor = `module xor_gate(A,B,Y); input A,B; output Y; assign Y = A | B; endmodule`;
assert(VerilogChecker.checkSolution(wrongXor, xorProb).status === 'wrong', "Wrong XOR should be flagged as 'wrong'");

// 13. Test 4:1 Mux with case statement
const mux4Prob = problems.find(p => p.id === 'mux4_1');
const mux4Case = `
module mux4_1(in,s0,s1,out);
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
endmodule
`;
assert(VerilogChecker.checkSolution(mux4Case, mux4Prob).status === 'correct', "4:1 Mux in Behavioral case should pass");

// 14. Test D flip-flop
const dffProb = problems.find(p => p.id === 'd_ff');
const dffCode = `
module d_ff(clk,rst,d,q);
  input clk,rst,d;
  output reg q;
  always @(posedge clk or posedge rst) begin
    if (rst)
      q <= 1'b0;
    else
      q <= d;
  end
endmodule
`;
assert(VerilogChecker.checkSolution(dffCode, dffProb).status === 'correct', "D flip-flop Behavioral should pass");

// 15. Test JK flip-flop
const jkProb = problems.find(p => p.id === 'jk_ff');
const jkCode = `
module jk_ff(clk,rst,j,k,q);
  input clk,rst,j,k;
  output reg q;
  always @(posedge clk or posedge rst) begin
    if (rst)
      q <= 1'b0;
    else begin
      case ({j, k})
        2'b00: q <= q;
        2'b01: q <= 1'b0;
        2'b10: q <= 1'b1;
        2'b11: q <= ~q;
      endcase
    end
  end
endmodule
`;
assert(VerilogChecker.checkSolution(jkCode, jkProb).status === 'correct', "JK flip-flop Behavioral should pass");

// 16. Test Compile Error: missing semicolon
const missingSemi = `
module and_gate(Y,A,B);
  input A,B;
  output Y;
  assign Y = A & B
endmodule
`;
const missingSemiRes = VerilogChecker.checkSolution(missingSemi, andProb);
assert(missingSemiRes.status === 'error', "Missing semicolon should report 'error'", missingSemiRes);

console.log("\n==========================================");
console.log(` Results: ${passedTests} / ${totalTests} tests passed`);
console.log("==========================================");

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log("All tests completed successfully!");
}
