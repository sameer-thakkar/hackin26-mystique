#!/bin/bash
set -e

# Pre-Compact Continuity Hook
# Creates auto-handoff before context compaction

if [ -f "$FACTORY_PROJECT_DIR/.claude/hooks/dist/pre-compact-continuity-ho.mjs" ]; then
    cd "$FACTORY_PROJECT_DIR/.claude/hooks"
    cat | node dist/pre-compact-continuity-ho.mjs
elif [ -f "$HOME/.claude/hooks/dist/pre-compact-continuity-ho.mjs" ]; then
    cd "$HOME/.claude/hooks"
    cat | node dist/pre-compact-continuity-ho.mjs
else
    echo '{"continue":true}'
fi
