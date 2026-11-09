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
module and_gate(Y,A,B);
  input A,B;
  output Y;
  and g1(Y, A, B);
endmodule
`;
const andProb = problems.find(p => p.id === 'and_gate');
const andPrimRes = VerilogChecker.checkSolution(andGatePrimitive, andProb);
assert(andPrimRes.status === 'correct', "AND Gate using gate primitive 'and g1(Y, A, B);' should pass", andPrimRes);

// 3. Test AND gate with ANSI port style
const andAnsi = `
module and_gate(input A, input B, output Y);
  assign Y = A & B;
endmodule
`;
const andAnsiRes = VerilogChecker.checkSolution(andAnsi, andProb);
assert(andAnsiRes.status === 'correct', "AND Gate with ANSI ports should pass", andAnsiRes);

// 4. Test NOT gate primitive
const notProb = problems.find(p => p.id === 'not_gate');
const notPrimitive = `
module not_gate(A, Y);
  input A;
  output Y;
  not n1(Y, A);
endmodule
`;
const notPrimRes = VerilogChecker.checkSolution(notPrimitive, notProb);
assert(notPrimRes.status === 'correct', "NOT Gate using gate primitive 'not n1(Y, A);' should pass", notPrimRes);

// 5. Test Wrong XOR (e.g. someone using OR '|' instead of '^')
const xorProb = problems.find(p => p.id === 'xor_gate');
const wrongXor = `
module xor_gate(A,B,Y);
  input A,B;
  output Y;
  assign Y = A | B; // Bug: using OR instead of XOR
endmodule
`;
const wrongXorRes = VerilogChecker.checkSolution(wrongXor, xorProb);
assert(wrongXorRes.status === 'wrong', "Wrong XOR (using OR logic) should be flagged as 'wrong'", wrongXorRes);

// 6. Test 4:1 Mux with textbook dataflow equation
const mux4Prob = problems.find(p => p.id === 'mux4_1');
const mux4Dataflow = `
module mux4_1(in,s0,s1,out);
input s0,s1;
input [3:0]in;
output out;
assign out=(~s1&~s0&in[0])|(~s1&s0&in[1])|(s1&~s0&in[2])|(s1&s0&in[3]);
endmodule
`;
const mux4Res = VerilogChecker.checkSolution(mux4Dataflow, mux4Prob);
assert(mux4Res.status === 'correct', "4:1 Mux with textbook dataflow assign should pass", mux4Res);

// 7. Test 1:4 Demux with textbook dataflow equations
const demux4Prob = problems.find(p => p.id === 'demux1_4');
const demux4Dataflow = `
module demux1_4(in,s0,s1,out);
input s0,s1,in;
output [3:0]out;
assign out[0]=~s1&~s0&in;
assign out[1]=~s1&s0&in;
assign out[2]=s1&~s0&in;
assign out[3]=s1&s0&in;
endmodule
`;
const demux4Res = VerilogChecker.checkSolution(demux4Dataflow, demux4Prob);
assert(demux4Res.status === 'correct', "1:4 Demux with textbook dataflow assign should pass", demux4Res);

// 8. Test D flip-flop with alternative syntax (if-else)
const dffProb = problems.find(p => p.id === 'd_ff');
const dffCorrect = `
module d_ff(clk,rst,d,q);
  input clk,rst,d;
  output reg q;
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
module jk_ff(clk,rst,j,k,q);
  input clk,rst,j,k;
  output reg q;
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
module and_gate(Y,A,B);
  input A,B;
  output Y;
  assign Y = A & B
endmodule
`;
const missingSemiRes = VerilogChecker.checkSolution(missingSemi, andProb);
assert(missingSemiRes.status === 'error', "Missing semicolon should report 'error'", missingSemiRes);

// 11. Test Module Name Mismatch
const wrongModName = `
module my_and(Y,A,B);
  input A,B;
  output Y;
  assign Y = A & B;
endmodule
`;
const wrongModRes = VerilogChecker.checkSolution(wrongModName, andProb);
assert(wrongModRes.status === 'error' && wrongModRes.errorType === 'module_name', "Wrong module name should report 'module_name' error", wrongModRes);

// 12. Test Missing Port Error
const missingPort = `
module and_gate(Y,A);
  input A;
  output Y;
  assign Y = A;
endmodule
`;
const missingPortRes = VerilogChecker.checkSolution(missingPort, andProb);
assert(missingPortRes.status === 'error' && missingPortRes.errorType === 'missing_port', "Missing port 'B' should report 'missing_port' error", missingPortRes);

console.log("\n==========================================");
console.log(` Results: ${passedTests} / ${totalTests} tests passed`);
console.log("==========================================");

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log("All tests completed successfully!");
}
