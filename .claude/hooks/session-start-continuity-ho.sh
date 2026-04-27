#!/bin/bash
set -e

# Session Start Continuity Hook
# Loads continuity ledger on resume/compact/clear

# Plugin installation (via /plugin add)
if [ -n "$CLAUDE_PLUGIN_ROOT" ] && [ -f "$CLAUDE_PLUGIN_ROOT/scripts/dist/session-start-continuity-ho.mjs" ]; then
    cd "$CLAUDE_PLUGIN_ROOT/scripts"
    cat | node dist/session-start-continuity-ho.mjs
# Project installation (via install.sh)
elif [ -f "$CLAUDE_PROJECT_DIR/.claude/hooks/dist/session-start-continuity-ho.mjs" ]; then
    cd "$CLAUDE_PROJECT_DIR/.claude/hooks"
    cat | node dist/session-start-continuity-ho.mjs
# Global installation
elif [ -f "$HOME/.claude/hooks/dist/session-start-continuity-ho.mjs" ]; then
    cd "$HOME/.claude/hooks"
    cat | node dist/session-start-continuity-ho.mjs
else
    echo '{"result":"continue"}'
fi
