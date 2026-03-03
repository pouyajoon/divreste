#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer";
import { generateMarkdown, generateHTML, type GeneratorOptions } from "./generator.js";

const HELP = `
divreste - Générateur de feuilles de divisions euclidiennes

Usage:
  divreste [options] [output]

Options:
  -n, --count N      Nombre de divisions (défaut: 20)
  -d, --divisors A-B Diviseurs min-max (défaut: 2-10)
  -o, --output DIR   Dossier de sortie (défaut: .)
  --md               Générer .md
  --html             Générer .html
  --pdf              Générer .pdf directement (défaut)
  --all              Générer md + html + pdf
  -h, --help         Afficher l'aide

Exemples:
  divreste             → génère feuille-divisions-reste.pdf (20 divisions, gros format)
  divreste -n 20 --all
  divreste -d 2-10 --pdf
`;

function parseArgs(): { options: GeneratorOptions; outputDir: string; formats: ("md" | "html" | "pdf")[] } {
  const args = process.argv.slice(2);
  const formats: ("md" | "html" | "pdf")[] = [];
  let outputDir = ".";
  const options: GeneratorOptions = {};

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-h" || a === "--help") {
      console.log(HELP);
      process.exit(0);
    }
    if (a === "-n" || a === "--count") {
      options.count = parseInt(args[++i] ?? "20", 10);
      continue;
    }
    if (a === "-d" || a === "--divisors") {
      const range = (args[++i] ?? "2-10").split("-").map(Number);
      options.divisorRange = [range[0] ?? 2, range[1] ?? 10];
      continue;
    }
    if (a === "-o" || a === "--output") {
      outputDir = args[++i] ?? ".";
      continue;
    }
    if (a === "--md") formats.push("md");
    else if (a === "--html") formats.push("html");
    else if (a === "--pdf") formats.push("pdf");
    else if (a === "--all") {
      formats.length = 0;
      formats.push("md", "html", "pdf");
    } else if (!a.startsWith("-") && formats.length === 0) {
      outputDir = a;
    }
  }

  if (formats.length === 0) formats.push("pdf");
  return { options, outputDir, formats };
}

async function main() {
  const { options, outputDir, formats } = parseArgs();
  const base = resolve(outputDir, "feuille-divisions-reste");

  if (formats.includes("md")) {
    const md = generateMarkdown(options);
    writeFileSync(`${base}.md`, md);
    console.log(`Écrit: ${base}.md`);
  }

  if (formats.includes("html")) {
    const html = generateHTML(options);
    writeFileSync(`${base}.html`, html);
    console.log(`Écrit: ${base}.html`);
  }

  if (formats.includes("pdf")) {
    const html = generateHTML(options);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: `${base}.pdf`,
      format: "A4",
      margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
    });
    await browser.close();
    console.log(`Écrit: ${base}.pdf`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
