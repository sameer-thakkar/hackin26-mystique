#!/bin/bash
set -e

# Skill Activation Prompt Hook (Cursor-adapted)
# Uses $PWD instead of $CLAUDE_PROJECT_DIR

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/dist/skill-activation-prompt-ho.mjs" ]; then
    cd "$SCRIPT_DIR"
    cat | node dist/skill-activation-prompt-ho.mjs
elif [ -f "$PWD/.cursor/hooks/dist/skill-activation-prompt-ho.mjs" ]; then
    cd "$PWD/.cursor/hooks"
    cat | node dist/skill-activation-prompt-ho.mjs
else
    echo '{"result":"continue"}'
fi
