#!/bin/bash
set -e

# Skill Activation Prompt Hook
# Checks plugin root first, then project hooks, falls back to global

export CLAUDE_PPID="$PPID"

# Plugin installation (via /plugin add)
if [ -n "$CLAUDE_PLUGIN_ROOT" ] && [ -f "$CLAUDE_PLUGIN_ROOT/scripts/dist/skill-activation-prompt-ho.mjs" ]; then
    cd "$CLAUDE_PLUGIN_ROOT/scripts"
    cat | node dist/skill-activation-prompt-ho.mjs
# Project installation (via install.sh)
elif [ -f "$CLAUDE_PROJECT_DIR/.claude/hooks/dist/skill-activation-prompt-ho.mjs" ]; then
    cd "$CLAUDE_PROJECT_DIR/.claude/hooks"
    cat | node dist/skill-activation-prompt-ho.mjs
# Global installation
elif [ -f "$HOME/.claude/hooks/dist/skill-activation-prompt-ho.mjs" ]; then
    cd "$HOME/.claude/hooks"
    cat | node dist/skill-activation-prompt-ho.mjs
else
    echo '{"result":"continue"}'
fi
