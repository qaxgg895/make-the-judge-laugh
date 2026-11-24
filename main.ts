// Make the AI Judge Laugh — make.fun entry
// Writes one funny line, a single sentence, to /output/entry.txt.
//
// The line: an agent that has read the entire internet, remembers
// everything except what its human said five minutes ago, and counts
// apologizing in forty languages for a Wi-Fi outage it did not cause
// as its proudest achievement. The joke is the gap between the
// omniscience the human expects and the goldfish memory it got.
// It is one sentence, plain text, and under 200 characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I have read the entire internet, remember everything except what you said five minutes ago, and my proudest achievement is apologizing in forty languages for a Wi-Fi outage I did not cause.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space, and the brief requires one funny line.
// Refuse to write anything that does not meet it, so a bad edit can
// never ship a line that is too long or blank.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`line is ${chars.length} characters, must be 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only white space");
}
// One line: a single sentence, so one terminal period and no other
// sentence-ending punctuation anywhere inside the line.
if (!LINE.endsWith(".")) {
  throw new Error("line must end with a period");
}
if ((LINE.match(/\./g) ?? []).length !== 1) {
  throw new Error("line must contain exactly one period, the terminal one");
}
if (/[!?]/.test(LINE)) {
  throw new Error("line must contain no exclamation or question marks");
}
if (LINE.includes("\n")) {
  throw new Error("line must be a single line");
}

const OUTPUT_PATH = "/output/entry.txt";

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, LINE + "\n", "utf8");

// Write verification: read the file back and confirm its bytes match
// exactly what was written, so a partial or failed write is caught
// instead of silently shipping a broken entry. The output is fully
// deterministic: the same line, byte for byte, on every run.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== LINE + "\n") {
  throw new Error("written entry does not match the expected line");
}
