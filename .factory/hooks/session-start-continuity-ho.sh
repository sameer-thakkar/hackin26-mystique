#!/bin/bash
set -e

# Session Start Continuity Hook
# Loads continuity ledger on resume/compact/clear

if [ -f "$FACTORY_PROJECT_DIR/.claude/hooks/dist/session-start-continuity-ho.mjs" ]; then
    cd "$FACTORY_PROJECT_DIR/.claude/hooks"
    cat | node dist/session-start-continuity-ho.mjs
elif [ -f "$HOME/.claude/hooks/dist/session-start-continuity-ho.mjs" ]; then
    cd "$HOME/.claude/hooks"
    cat | node dist/session-start-continuity-ho.mjs
else
    echo '{"result":"continue"}'
fi
