import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Generates a minimal but valid placeholder PDF at public/resume.pdf so the
// "Resume" buttons don't 404. Replace the file with a real resume later.
const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "resume.pdf");

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const lines = [
  ["/F1", 30, "Shami Mukasa"],
  ["/F2", 14, "AI and Full Stack Developer"],
  ["/F2", 11, "Networking  |  Machine Learning  |  IoT"],
  ["/F2", 11, ""],
  ["/F2", 11, "---------------------------------------------"],
  ["/F2", 11, "PLACEHOLDER FILE - replace public/resume.pdf with your real resume."],
  ["/F2", 11, "The Download / Resume buttons on the site point to this file."],
  ["/F2", 11, "---------------------------------------------"],
  ["/F2", 11, "shamimukasa@gmail.com   |   github.com/shamimukasa"],
];

let stream = "BT\n";
let first = true;
for (const [font, size, text] of lines) {
  stream += `${font} ${size} Tf\n`;
  stream += first ? "60 720 Td\n" : `0 -${size + 10} Td\n`;
  first = false;
  if (text) stream += `(${esc(text)}) Tj\n`;
}
stream += "ET";

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
  `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];

let pdf = "%PDF-1.4\n";
const offsets = [];
objects.forEach((body, i) => {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});
const xrefStart = Buffer.byteLength(pdf, "latin1");
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (const off of offsets) {
  pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

writeFileSync(out, Buffer.from(pdf, "latin1"));
console.log(`Wrote ${out}`);
