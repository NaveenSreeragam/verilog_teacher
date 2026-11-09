# Verilog Basics Lab

A clean, minimal, zero-dependency static web application designed to help engineering students learn Verilog HDL from scratch and practice with instant in-browser feedback for lab exams.

---

## Features

- **Textbook Syntax as Primary Main Reference:**
  - Logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) follow the exact standard textbook dataflow syntax (`module and_gate(Y,A,B); input A,B; output Y; assign Y=A&B; endmodule`).
  - Multiplexers & Demultiplexers implemented in textbook **Dataflow Modeling** (`assign out = (~s1&~s0&in[0]) | ...;` and `assign out[0] = ~s1&~s0&in;`).
  - D flip-flop and JK flip-flop implemented in **Behavioral Modeling** (`always @(posedge clk or posedge rst)` with `case` / `if-else` and non-blocking `<=` assignments).
  - Shows ANSI syntax and gate primitives as **Alternative Styles**.
- **Clear Syntax Breakdown:**
  - Clearly differentiates **Compulsory Keywords** (reserved words like `module`, `endmodule`, `input`, `output`, `assign`, `reg`, `always`, `begin`, `end`) from **User-Defined Variables** (`A`, `B`, `Y`, `in`, `out`, `clk`, etc.).
  - Detailed line-by-line explanation for every circuit.
- **Interactive In-Browser Checker (`verilog-checker.js`):**
  - Runs 100% in the browser with zero backend, Node server, or iverilog dependency.
  - Case-insensitive port and module recognition, handling both ANSI and non-ANSI textbook declarations.
- **One-Page Printable Cheat Sheet:**
  - Formatted for last-minute revision and physical printouts.

---

## File Structure

```text
├── index.html          # Main HTML structure with Learn, Practice & Cheat Sheet tabs
├── style.css           # Clean, minimal typography & responsive styling
├── app.js              # Tab controller, code editor logic, and DOM rendering
├── lessons.js          # Topic 0-11 lessons with textbook syntax, breakdown & line-by-line notes
├── problems.js         # Practice problems using textbook syntax, ports, and test vectors
├── verilog-checker.js  # Client-side Verilog subset parser and simulator
├── tests.js            # Node-executable test suite verifying solutions and edge cases
└── README.md           # Documentation & deployment instructions
```

---

## How to Test Locally

Run the automated test suite with Node:

```bash
node tests.js
```

To view the website in your browser, double-click `index.html` or run any static server:

```bash
npx serve .
# or
python -m http.server 8000
```

---

## How to Deploy on Vercel

Because this site is built with pure static HTML, CSS, and vanilla JavaScript, deploying to [Vercel](https://vercel.com) requires **no configuration, no build step, and no backend**.

### Option A: Drag and Drop (Easiest)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** &rarr; **Project**.
3. Under the drop area, drag and drop the `verilog_teacher` folder.
4. Click **Deploy**. Vercel will immediately deploy the static files and provide you with a live URL.

### Option B: Push to GitHub
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Verilog Basics Lab with textbook syntax"
   ```
2. Push to your GitHub repo and import the repo into Vercel with framework preset **Other**.
