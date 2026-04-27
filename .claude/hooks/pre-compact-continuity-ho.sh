#!/bin/bash
set -e

# Pre-Compact Continuity Hook
# Creates auto-handoff before context compaction

# Plugin installation (via /plugin add)
if [ -n "$CLAUDE_PLUGIN_ROOT" ] && [ -f "$CLAUDE_PLUGIN_ROOT/scripts/dist/pre-compact-continuity-ho.mjs" ]; then
    cd "$CLAUDE_PLUGIN_ROOT/scripts"
    cat | node dist/pre-compact-continuity-ho.mjs
# Project installation (via install.sh)
elif [ -f "$CLAUDE_PROJECT_DIR/.claude/hooks/dist/pre-compact-continuity-ho.mjs" ]; then
    cd "$CLAUDE_PROJECT_DIR/.claude/hooks"
    cat | node dist/pre-compact-continuity-ho.mjs
# Global installation
elif [ -f "$HOME/.claude/hooks/dist/pre-compact-continuity-ho.mjs" ]; then
    cd "$HOME/.claude/hooks"
    cat | node dist/pre-compact-continuity-ho.mjs
else
    echo '{"continue":true}'
fi
