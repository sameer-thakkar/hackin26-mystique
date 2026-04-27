#!/bin/bash
set -e

# TypeScript Pre-flight Check Hook
# Runs after Edit/Write on .ts/.tsx files

if [ -f "$FACTORY_PROJECT_DIR/.claude/hooks/dist/typescript-preflight-ho.mjs" ]; then
    cd "$FACTORY_PROJECT_DIR/.claude/hooks"
    cat | node dist/typescript-preflight-ho.mjs
elif [ -f "$HOME/.claude/hooks/dist/typescript-preflight-ho.mjs" ]; then
    cd "$HOME/.claude/hooks"
    cat | node dist/typescript-preflight-ho.mjs
else
    echo '{"result":"continue"}'
fi
