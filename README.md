# Verilog Basics Lab

A clean, minimal, zero-dependency static web application designed to help engineering students learn Verilog HDL from scratch and practice with instant in-browser feedback for lab exams.

---

## Features

- **Topic Coverage from Absolute Zero (Topic 0 to 11):**
  - **Topic 0:** Verilog basics, modules, wire vs reg, assign vs always block, blocking (`=`) vs non-blocking (`<=`), testbenches, truth tables, and syntax rules.
  - **Logic Gates (1 to 7):** AND, OR, NOT, NAND, NOR, XOR, XNOR (with both `assign` and gate primitive styles).
  - **Multiplexers (8):** 2:1 and 4:1 Multiplexers (with `?:` and `case` styles).
  - **Demultiplexers (9):** 1:2 and 1:4 Demultiplexers.
  - **Flip-Flops (10 & 11):** D flip-flop and JK flip-flop with asynchronous active-high reset (`rst`).

- **Interactive In-Browser Checker (`verilog-checker.js`):**
  - No backend, no Node server, no iverilog required — 100% runs client-side in the browser.
  - Supports ANSI and non-ANSI module declarations, multi-bit buses (`[1:0] sel`), continuous assignments (`assign`), gate primitives, `always @(*)` combinational blocks, and `always @(posedge clk or posedge rst)` sequential blocks.
  - Immediate test verification:
    - **Verified - Correct** (green) with full truth table / clock step table verification.
    - **Not Correct** (red) highlighting specific input mismatches.
    - **Compile Error** (red) with friendly hints (e.g. missing semicolons, missing endmodule, port mismatches).

- **One-Page Printable Cheat Sheet:**
  - Compact code templates for all topics, formatted for last-minute revision and printed lab exams.

---

## File Structure

```text
├── index.html          # Main HTML structure with Learn, Practice & Cheat Sheet tabs
├── style.css           # Clean, minimal, readable typography & responsive styling
├── app.js              # Tab controller, code editor logic, and DOM rendering
├── lessons.js          # Topic 0-11 lessons, truth tables, and explanations
├── problems.js         # Problem specifications, ports, starter code, and test cases
├── verilog-checker.js  # Client-side Verilog subset parser and simulator
├── tests.js            # Node-executable test suite for automated checker verification
└── README.md           # Documentation & deployment instructions
```

---

## How to Test Locally

You can test the checker test suite with Node:

```bash
node tests.js
```

To view the website in your browser, either double-click `index.html` to open it locally, or serve it using any simple local server:

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
3. Under the **Deploy from a local folder** or drop area, drag and drop the `verilog_teacher` folder.
4. Click **Deploy**. Vercel will immediately deploy the static files and provide you with a live URL.

### Option B: Push to GitHub / Git Provider
1. Initialize a git repository in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Verilog Basics Lab"
   ```
2. Create a repository on GitHub and push your code:
   ```bash
   git remote add origin https://github.com/<your-username>/verilog-basics-lab.git
   git branch -M main
   git push -u origin main
   ```
3. In your Vercel Dashboard, click **Add New Project** and select your GitHub repository.
4. Keep the default settings (Framework Preset: **Other**, Build Command: empty, Output Directory: empty) and click **Deploy**.

