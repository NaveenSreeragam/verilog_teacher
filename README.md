# Verilog Basics Lab

A clean, minimal, zero-dependency static web application designed to help engineering students learn Verilog HDL from scratch and practice with instant in-browser feedback for lab exams.

---

## Features

- **The Three Types of Verilog Modeling Covered for All Circuits:**
  1. **Dataflow Modeling:** Continuous assignments using `assign` with Boolean expressions (`&`, `|`, `^`, `~`).
  2. **Behavioral Modeling:** Procedural algorithmic modeling using `always @(*)` blocks with `output reg`, `if-else`, or `case`.
  3. **Structural Modeling:** Schematic-level gate instantiations using primitive gates (`and`, `or`, `not`, `xor`, `nand`, etc.) and internal `wire` interconnections.

- **Complete Topic Coverage:**
  - **Topic 0:** Verilog Basics & The 3 Modeling Styles (`wire` vs `reg`, blocking `=` vs non-blocking `<=`, compulsory keywords vs user variables).
  - **Logic Gates (1 to 7):** AND, OR, NOT, NAND, NOR, XOR, XNOR (each shown in Dataflow, Behavioral, and Structural).
  - **Arithmetic Circuits (8 to 11):**
    - **Half Adder:** Sum $S = A \oplus B$, Carry $C = A \cdot B$
    - **Full Adder:** $S = A \oplus B \oplus Cin$, $Cout = (A \cdot B) + (B \cdot Cin) + (A \cdot Cin)$
    - **Half Subtractor:** $Diff = A \oplus B$, $Borrow = \overline{A} \cdot B$
    - **Full Subtractor:** $Diff = A \oplus B \oplus Bin$, $Bout = (\overline{A} \cdot B) + \overline{(A \oplus B)} \cdot Bin$
  - **Multiplexers (12):** 2:1 and 4:1 Multiplexer (Dataflow, Behavioral `case`, and Structural).
  - **Demultiplexers (13):** 1:2 and 1:4 Demultiplexer (Dataflow, Behavioral, and Structural).
  - **Sequential Circuits / Flip-Flops (14 & 15):** D Flip-Flop and JK Flip-Flop with asynchronous active-high reset (`rst`).

- **Compulsory vs User-Defined Breakdown:**
  - Clearly identifies **Compulsory Fixed Keywords** (`module`, `endmodule`, `input`, `output`, `wire`, `reg`, `assign`, `always`, `begin`, `end`, `posedge`, etc.) versus **User-Named Variables** (`A`, `B`, `Y`, `S`, `C`, `Diff`, `Borrow`, `in`, `out`, `clk`).

- **Interactive In-Browser Checker (`verilog-checker.js`):**
  - Runs 100% client-side in the browser with no backend, no Node server, and no iverilog dependency.
  - Automatically simulates any of the 3 modeling styles student submits.

- **One-Page Printable Cheat Sheet:**
  - All syntax templates organized for physical printout and last-minute revision.

---

## File Structure

```text
├── index.html          # Main HTML structure with Learn, Practice & Cheat Sheet tabs
├── style.css           # Clean, minimal typography & responsive styling
├── app.js              # Tab controller, code editor logic, and DOM rendering
├── lessons.js          # Lessons 0 to 15 with Dataflow, Behavioral, and Structural styles
├── problems.js         # Practice problems, starter code, and simulation test cases
├── verilog-checker.js  # Client-side Verilog parser and multi-pass simulator
├── tests.js            # Automated Node test suite verifying all circuits & styles
└── README.md           # Documentation & deployment instructions
```

---

## Automated Verification

Run the test suite with Node:

```bash
node tests.js
```
All 34 tests covering Dataflow, Behavioral, and Structural implementations pass cleanly.

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
   git commit -m "Verilog Basics Lab with all 3 modeling styles"
   ```
2. Push to your GitHub repo and import the repo into Vercel with framework preset **Other**.
