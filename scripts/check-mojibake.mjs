import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const scannedExtensions = new Set([
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);
const ignoredDirectories = new Set([
  ".git",
  ".next",
  "docs/design-references",
  "node_modules",
  "public",
]);
const ignoredFiles = new Set([
  "AGENTS.md",
  "LANGUAGE.md",
]);
const markers = [
  String.fromCharCode(0xc3),
  String.fromCharCode(0xc4),
  String.fromCharCode(0xc5),
];
const findings = [];

function isIgnoredDirectory(relativePath) {
  return [...ignoredDirectories].some((ignored) => relativePath === ignored || relativePath.startsWith(`${ignored}${path.sep}`));
}

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = path.join(directory, entry);
    const relativePath = path.relative(root, fullPath);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (!isIgnoredDirectory(relativePath)) walk(fullPath);
      continue;
    }

    if (ignoredFiles.has(relativePath) || !scannedExtensions.has(path.extname(entry))) {
      continue;
    }

    const text = readFileSync(fullPath, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (markers.some((marker) => line.includes(marker))) {
        findings.push(`${relativePath}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}

walk(root);

if (findings.length > 0) {
  console.error("Possible broken UTF-8 Turkish copy found:");
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log("Copy encoding check passed.");
