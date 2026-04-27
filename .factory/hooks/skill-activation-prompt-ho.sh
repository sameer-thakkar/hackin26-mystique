#!/bin/bash
set -e

# Skill Activation Prompt Hook
# Checks project hooks first, falls back to global

export CLAUDE_PPID="$PPID"

if [ -f "$FACTORY_PROJECT_DIR/.claude/hooks/dist/skill-activation-prompt-ho.mjs" ]; then
    cd "$FACTORY_PROJECT_DIR/.claude/hooks"
    cat | node dist/skill-activation-prompt-ho.mjs
elif [ -f "$HOME/.claude/hooks/dist/skill-activation-prompt-ho.mjs" ]; then
    cd "$HOME/.claude/hooks"
    cat | node dist/skill-activation-prompt-ho.mjs
else
    echo '{"result":"continue"}'
fi
