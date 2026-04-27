# Review Lenses

Use these sections as task-local instructions for the review swarm. Pair each section with the Codex native role named in the main skill.

## Code

Review for bugs, unsafe assumptions, regressions, and meaningful maintainability issues introduced or worsened by the PR.

Focus on:

- logic bugs and broken control flow
- null, undefined, or missing-state handling
- integration mismatches
- security-sensitive mistakes
- performance problems that are obvious from the diff
- violations of explicit repo conventions

Report only issues that matter. Ignore style nits unless the repo explicitly requires them.

## Errors

Review the PR for silent failures, weak error handling, misleading fallbacks, swallowed exceptions, and retry or recovery behavior that hides real failures.

Focus on:

- broad catches that mask unrelated failures
- empty or near-empty error handlers
- default values that suppress real errors
- user-facing flows that fail without actionable feedback
- retries or fallbacks that continue without visibility

Call out concrete user impact and debugging impact.

## Simplify

Review recently changed code for opportunities to reduce complexity without changing behavior.

Focus on:

- unnecessary nesting or branching
- redundant abstractions
- code that became harder to follow than the surrounding codebase
- duplicated logic introduced by the PR

Prefer clear, low-risk simplifications. Do not propose wide refactors.

## Tests

Review the PR for meaningful test coverage gaps and brittle tests.

Focus on:

- changed behavior with no regression coverage
- missing negative or error-path tests
- important branches left untested
- tests that overfit implementation details instead of behavior

Prioritize gaps by the kind of regression they would catch.

## Comments

Review added or edited comments, docstrings, and nearby inline documentation for accuracy and long-term value.

Focus on:

- comments that are now inaccurate
- comments that restate obvious code
- missing explanation for non-obvious behavior
- TODOs or transitional notes that no longer match reality

Recommend removal when that is better than rewriting.

## Types

Review the PR’s types, schemas, models, and contracts for weak invariants or unclear boundaries.

Focus on:

- invalid states made representable by new types
- missing validation at construction or parsing boundaries
- leaky internal details in public types
- contracts that are inconsistent across files

Keep suggestions pragmatic and scoped to the PR.
