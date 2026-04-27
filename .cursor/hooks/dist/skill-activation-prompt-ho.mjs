#!/usr/bin/env node

// src/skill-activation-prompt-ho.ts
import { readFileSync, existsSync } from "fs";
import { join } from "path";
async function main() {
  try {
    const input = readFileSync(0, "utf-8");
    const data = JSON.parse(input);
    const prompt = data.prompt.toLowerCase();
    let projectDir = process.cwd();
    if (projectDir.endsWith(".cursor/hooks") || projectDir.endsWith(".claude/hooks")) {
      projectDir = join(projectDir, "..", "..");
    } else if (projectDir.includes("/.cursor/") || projectDir.includes("/.claude/")) {
      projectDir = projectDir.replace(/\/\.(cursor|claude)\/.*$/, "");
    }
    const homeDir = process.env.HOME || "";
    const cursorProjectRulesPath = join(projectDir, ".cursor", "skills", "skill-rules.json");
    const claudeProjectRulesPath = join(projectDir, ".claude", "skills", "skill-rules.json");
    const cursorGlobalRulesPath = join(homeDir, ".cursor", "skills", "skill-rules.json");
    const claudeGlobalRulesPath = join(homeDir, ".claude", "skills", "skill-rules.json");
    let rulesPath = "";
    if (existsSync(cursorProjectRulesPath)) {
      rulesPath = cursorProjectRulesPath;
    } else if (existsSync(claudeProjectRulesPath)) {
      rulesPath = claudeProjectRulesPath;
    } else if (existsSync(cursorGlobalRulesPath)) {
      rulesPath = cursorGlobalRulesPath;
    } else if (existsSync(claudeGlobalRulesPath)) {
      rulesPath = claudeGlobalRulesPath;
    } else {
      process.exit(0);
    }
    const rules = JSON.parse(readFileSync(rulesPath, "utf-8"));
    const matchedSkills = [];
    for (const [skillName, config] of Object.entries(rules.skills)) {
      const triggers = config.promptTriggers;
      if (!triggers) continue;
      if (triggers.keywords) {
        const keywordMatch = triggers.keywords.some((kw) => {
          const words = kw.toLowerCase().split(/\s+/);
          return words.every((word) => prompt.includes(word));
        });
        if (keywordMatch) {
          matchedSkills.push({ name: skillName, matchType: "keyword", config });
          continue;
        }
      }
      if (triggers.intentPatterns) {
        const intentMatch = triggers.intentPatterns.some((pattern) => {
          const regex = new RegExp(pattern, "i");
          return regex.test(prompt);
        });
        if (intentMatch) {
          matchedSkills.push({ name: skillName, matchType: "intent", config });
        }
      }
    }
    const matchedAgents = [];
    if (rules.agents) {
      for (const [agentName, config] of Object.entries(rules.agents)) {
        const triggers = config.promptTriggers;
        if (!triggers) continue;
        if (triggers.keywords) {
          const keywordMatch = triggers.keywords.some((kw) => {
            const words = kw.toLowerCase().split(/\s+/);
            return words.every((word) => prompt.includes(word));
          });
          if (keywordMatch) {
            matchedAgents.push({ name: agentName, matchType: "keyword", config, isAgent: true });
            continue;
          }
        }
        if (triggers.intentPatterns) {
          const intentMatch = triggers.intentPatterns.some((pattern) => {
            const regex = new RegExp(pattern, "i");
            return regex.test(prompt);
          });
          if (intentMatch) {
            matchedAgents.push({ name: agentName, matchType: "intent", config, isAgent: true });
          }
        }
      }
    }
    const sessionId = process.env.CLAUDE_PPID || process.env.CLAUDE_SESSION_ID || "default";
    const contextFile = `/tmp/claude-context-pct-${sessionId}.txt`;
    let contextPct = 0;
    if (existsSync(contextFile)) {
      try {
        contextPct = parseInt(readFileSync(contextFile, "utf-8").trim(), 10);
      } catch {
      }
    }
    if (contextPct >= 85) {
      const hasHandoffSkill = matchedSkills.some((s) => s.name === "create_handoff");
      if (!hasHandoffSkill) {
        matchedSkills.unshift({
          name: "create_handoff",
          matchType: "context-trigger",
          config: {
            type: "domain",
            enforcement: "suggest",
            priority: "critical",
            description: `Context at ${contextPct}% - Create handoff NOW to preserve work`
          }
        });
      }
    }
    if (matchedSkills.length > 0 || matchedAgents.length > 0) {
      let output = "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n";
      output += "\u{1F3AF} SKILL ACTIVATION CHECK\n";
      output += "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n";
      const critical = matchedSkills.filter((s) => s.config.priority === "critical");
      const high = matchedSkills.filter((s) => s.config.priority === "high");
      const medium = matchedSkills.filter((s) => s.config.priority === "medium");
      const low = matchedSkills.filter((s) => s.config.priority === "low");
      if (critical.length > 0) {
        output += "\u26A0\uFE0F CRITICAL SKILLS (REQUIRED):\n";
        critical.forEach((s) => output += `  \u2192 ${s.name}
`);
        output += "\n";
      }
      if (high.length > 0) {
        output += "\u{1F4DA} RECOMMENDED SKILLS:\n";
        high.forEach((s) => output += `  \u2192 ${s.name}
`);
        output += "\n";
      }
      if (medium.length > 0) {
        output += "\u{1F4A1} SUGGESTED SKILLS:\n";
        medium.forEach((s) => output += `  \u2192 ${s.name}
`);
        output += "\n";
      }
      if (low.length > 0) {
        output += "\u{1F4CC} OPTIONAL SKILLS:\n";
        low.forEach((s) => output += `  \u2192 ${s.name}
`);
        output += "\n";
      }
      if (matchedAgents.length > 0) {
        output += "\u{1F916} RECOMMENDED AGENTS (token-efficient):\n";
        matchedAgents.forEach((a) => output += `  \u2192 ${a.name}
`);
        output += "\n";
      }
      if (matchedSkills.length > 0) {
        output += "ACTION: Use Skill tool BEFORE responding\n";
      }
      if (matchedAgents.length > 0) {
        output += "ACTION: Use Task tool with agent for exploration\n";
      }
      output += "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n";
      console.log(output);
    }
    if (contextPct >= 92) {
      const warning = "\n" + "=".repeat(50) + `
  \u{1F6A8} CONTEXT CRITICAL: ${contextPct}%
  AUTO-COMPACTION IMMINENT!
  Run: Skill("create_handoff") NOW
` + "=".repeat(50) + "\n";
      console.log(warning);
    } else if (contextPct >= 85) {
      const warning = "\n" + "=".repeat(50) + `
  \u26A0\uFE0F CONTEXT HIGH: ${contextPct}%
  Create handoff to preserve work:
  \u2192 Skill("create_handoff")
` + "=".repeat(50) + "\n";
      console.log(warning);
    } else if (contextPct >= 70) {
      console.log(`
Context at ${contextPct}%. Consider handoff when you reach a stopping point.
`);
    }
    process.exit(0);
  } catch (err) {
    console.error("Error in skill-activation-prompt-ho hook:", err);
    process.exit(1);
  }
}
main().catch((err) => {
  console.error("Uncaught error:", err);
  process.exit(1);
});
