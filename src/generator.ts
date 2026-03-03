export interface DivisionProblem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

export interface GeneratorOptions {
  /** Nombre de divisions par feuille (≈36 pour A4) */
  count?: number;
  /** Diviseurs min/max (ex: [4, 12]) */
  divisorRange?: [number, number];
  /** Dividende max (optionnel, sinon auto) */
  dividendMax?: number;
  /** Nombre de tabulations avant la réponse */
  tabsBeforeAnswer?: number;
}

const DEFAULT_OPTIONS: Required<GeneratorOptions> = {
  count: 20,
  divisorRange: [2, 10],
  dividendMax: 99,
  tabsBeforeAnswer: 5,
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Génère une division euclidienne aléatoire avec reste > 0 */
export function generateOneDivision(
  divisorMin: number,
  divisorMax: number,
  dividendMax: number
): DivisionProblem {
  const divisor = randomInt(divisorMin, divisorMax);
  const quotient = randomInt(1, Math.floor(dividendMax / divisor));
  const remainder = randomInt(1, divisor - 1);
  const dividend = quotient * divisor + remainder;
  return { dividend, divisor, quotient, remainder };
}

/** Génère une liste de divisions uniques (évite doublons) */
export function generateDivisions(options: GeneratorOptions = {}): DivisionProblem[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [divMin, divMax] = opts.divisorRange;
  const seen = new Set<string>();
  const problems: DivisionProblem[] = [];

  while (problems.length < opts.count) {
    const p = generateOneDivision(divMin, divMax, opts.dividendMax);
    const key = `${p.dividend}÷${p.divisor}`;
    if (!seen.has(key)) {
      seen.add(key);
      problems.push(p);
    }
  }

  return problems;
}

/** Formate une ligne : "38 ÷ 6  =     reste       .   .   .   6.2" */
export function formatLine(problem: DivisionProblem, _tabs: number): string {
  const answer = `${problem.quotient}.${problem.remainder}`;
  const left = `${problem.dividend} ÷ ${problem.divisor}`.padEnd(8);
  return `${left} =     reste       .   .   .   ${answer}`;
}

/** Génère le contenu Markdown */
export function generateMarkdown(options: GeneratorOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const problems = generateDivisions(opts);
  const lines = problems.map((p) => formatLine(p, opts.tabsBeforeAnswer));
  return "```\n" + lines.join("\n") + "\n```\n";
}

/** Génère le contenu HTML (20 divisions, gros format) */
export function generateHTML(options: GeneratorOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const problems = generateDivisions(opts);
  const lines = problems.map((p) => formatLine(p, opts.tabsBeforeAnswer));
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Feuille de divisions</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body {
      font-family: "SF Mono", "Consolas", monospace;
      font-size: 14pt;
      line-height: 2;
      margin: 12mm;
      white-space: pre;
      max-width: 100%;
    }
  </style>
</head>
<body>
${lines.join("\n")}
</body>
</html>`;
}
