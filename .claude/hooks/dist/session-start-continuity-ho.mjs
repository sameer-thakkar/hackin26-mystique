// src/session-start-continuity-ho.ts
import * as fs from "fs";
import * as path from "path";
async function main() {
  const input = JSON.parse(await readStdin());
  if (input.type === "start") {
    const output2 = { result: "continue" };
    console.log(JSON.stringify(output2));
    return;
  }
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const ledgerDir = path.join(projectDir, "thoughts", "ledgers");
  let ledgerFiles = [];
  try {
    ledgerFiles = fs.readdirSync(ledgerDir).filter((f) => f.endsWith(".md") && !f.startsWith("."));
  } catch {
    const output2 = { result: "continue" };
    console.log(JSON.stringify(output2));
    return;
  }
  if (ledgerFiles.length === 0) {
    const output2 = { result: "continue" };
    console.log(JSON.stringify(output2));
    return;
  }
  const mostRecent = ledgerFiles.sort((a, b) => {
    const statA = fs.statSync(path.join(ledgerDir, a));
    const statB = fs.statSync(path.join(ledgerDir, b));
    return statB.mtime.getTime() - statA.mtime.getTime();
  })[0];
  const ledgerPath = path.join(ledgerDir, mostRecent);
  const ledgerContent = fs.readFileSync(ledgerPath, "utf-8");
  const lines = [];
  lines.push(`[SessionStart:${input.type}] Continuity ledger loaded: ${mostRecent}`);
  lines.push("");
  lines.push("--- LEDGER START ---");
  lines.push(ledgerContent);
  lines.push("--- LEDGER END ---");
  const sessionName = mostRecent.replace(".md", "");
  const handoffDir = path.join(projectDir, "thoughts", "shared", "handoffs", sessionName);
  try {
    const handoffFiles = fs.readdirSync(handoffDir).filter((f) => f.endsWith(".md")).sort().reverse();
    if (handoffFiles.length > 0) {
      const latestHandoff = handoffFiles[0];
      const handoffContent = fs.readFileSync(path.join(handoffDir, latestHandoff), "utf-8");
      lines.push("");
      lines.push(`--- LATEST HANDOFF: ${latestHandoff} ---`);
      lines.push(handoffContent);
      lines.push("--- HANDOFF END ---");
    }
  } catch {
  }
  lines.push("");
  lines.push("Resume from the [\u2192] marker in State section. Verify any UNCONFIRMED items.");
  const output = {
    result: "continue",
    message: lines.join("\n")
  };
  console.log(JSON.stringify(output));
}
async function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => data += chunk);
    process.stdin.on("end", () => resolve(data));
  });
}
main().catch(console.error);
