import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const projectDir = resolve(process.cwd());
const repoDir = resolve(projectDir, "..");
const resultPath = join(projectDir, "tests/fixtures/b3/robots-diff.json");
const sourcePath = join(repoDir, "source/robots.txt");
const distPath = join(projectDir, "dist/robots.txt");
const removedIntentionalLine = "Allow: /categories/";
const snapshotDate = "2026-08-26";

const main = async () => {
  const [sourceText, distText] = await Promise.all([
    readFile(sourcePath, "utf8"),
    readFile(distPath, "utf8"),
  ]);
  const sourceLines = sourceText.split(/\r?\n/);
  const expectedLines = sourceLines.filter(line => line !== removedIntentionalLine);
  const actualLines = distText.split(/\r?\n/);
  const lineDiffs = [];
  const lineCount = Math.max(expectedLines.length, actualLines.length);
  for (let index = 0; index < lineCount; index += 1) {
    if (expectedLines[index] !== actualLines[index]) {
      lineDiffs.push({
        line: index + 1,
        expected: expectedLines[index] ?? null,
        actual: actualLines[index] ?? null,
      });
    }
  }
  const report = {
    generatedAt: snapshotDate,
    sourcePath: "source/robots.txt",
    distPath: "dist/robots.txt",
    intentionalDifference: {
      removedLine: removedIntentionalLine,
      reason: "The /categories/ route is an intentional 404 and must not be advertised.",
    },
    sourceLineCount: sourceLines.length,
    expectedLineCount: expectedLines.length,
    actualLineCount: actualLines.length,
    expectedLines,
    actualLines,
    lineDiffs,
    passed: lineDiffs.length === 0,
  };
  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Robots B3: ${report.passed ? "passed" : "failed"}; ${lineDiffs.length} unexpected line differences.`);
  if (!report.passed) process.exitCode = 1;
};

main().catch(async error => {
  const report = { generatedAt: snapshotDate, passed: false, error: String(error?.stack ?? error) };
  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(report.error);
  process.exitCode = 1;
});
