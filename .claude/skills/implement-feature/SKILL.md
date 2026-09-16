---
name: implement-feature
description: Use when implementing a DEMO Story or Bug, fixing a defect, or starting work from a Ready for development JIRA ticket with an approved technical design. Also runs an autonomous sweep of DEMO tickets in `Ready for development` when invoked with no specific request (e.g. from a scheduled loop).
context: fork
agent: full-stack-developer
---

# Implement Feature

## Overview

Implement one bounded `DEMO` Story or Bug exactly as designed, with tests and a reviewable pull request. A `Ready for development` status alone is insufficient: the issue comments must contain an applicable technical design and ADR.

This skill never asks clarifying questions, interactively or otherwise. It implements the technical proposal already recorded on the ticket exactly as written. When that proposal is missing, contradictory, or insufficient to implement safely, it records the gap as a JIRA comment and stops — it never guesses, and never uses `AskUserQuestion`.

This skill runs in one of two modes:

- **Manual Request Workflow** — a human names a specific `DEMO` Story or Bug key directly in the conversation.
- **Autonomous Ticket Sweep** — invoked with no specific request (including scheduled/`/loop` invocations). It finds the highest-priority eligible ticket itself.

Decide the mode first: if the invocation names an existing Story or Bug key, use the Manual Request Workflow. If it does not (empty or generic invocation, e.g. a bare `/implement-feature`), use the Autonomous Ticket Sweep. This mode is intended to be invoked periodically (e.g. `/loop 5m /implement-feature`) so that newly refined tickets are picked up without a human starting each run.

## Select and qualify the ticket

1. **Manual Request Workflow:** fetch the named issue directly. **Autonomous Ticket Sweep:** search `DEMO` issues of type `Story` or `Bug` with status `Ready for development`, ordered by `priority DESC, created DESC`; select the first result.
2. If there is no eligible ticket (named issue not `Ready for development`, or the sweep search is empty), do not change JIRA, Git, or repository files. In the sweep, report that no tickets needed attention and stop.
3. Fetch the selected issue, comments, links, and repository conventions. Confirm that comments contain both a technical design and ADR applicable to the acceptance criteria.
4. When that evidence is absent, contradictory, or insufficient to implement safely, add one Dutch comment describing the precise missing or conflicting decision and required clarification. Keep the status `Ready for development`; do not create a design, branch, commit, or code change. Do not ask a human — the comment itself is the escalation, to be resolved by the software architect on a future refinement pass.

Do not treat urgency, an instruction to begin coding, or a `Refined` status as permission to fill in a missing design yourself.

## Implement the approved work

1. Obtain available transitions and move only the selected, qualified ticket to `In progress` before making any code change.
2. Inspect `git status` before branch creation. Do not alter, stash, commit, discard, or incorporate changes that are not yours. If they conflict with the work, add a Dutch JIRA comment and stop.
3. Create and check out `feature/DEMO-123` for a Story or `hotfix/DEMO-123` for a Bug. If that branch already exists or cannot be created, preserve the state, comment in Dutch, and stop.
4. Implement only the acceptance criteria and decisions in the design/ADR. Follow existing project patterns. Treat a new backend, database, integration, dependency, authorization model, or operational component as out of scope unless the design explicitly requires it.
5. Add or update the focused unit, component, integration, or end-to-end tests prescribed by the design and existing test conventions. Run the smallest existing validation commands covering the change.
6. Make one or more atomic commits. Each commit subject must use `[DEMO-123] What changed and why`, for example: `[DEMO-123] Enforce reserve limit to prevent invalid selections`.
7. Push the branch and create a pull request targeting `master`, with the JIRA key, concise implementation summary, and validation results.
8. Only after the push and pull request succeed, obtain the available transitions and move the ticket to `Ready for review`.

## Delivery failures

If any branch, validation, commit, push, pull-request, or status-transition action fails, do not represent the ticket as complete or ready for review. Preserve the successful work, add a Dutch JIRA comment stating the failed action, relevant error, current branch/commit or PR state, and the next action needed. Do not bypass a branch conflict by marking the ticket `Ready for review`. Never fall back to `AskUserQuestion` to resolve a failure — record it in JIRA instead.

## Quick reference

| Condition | Required action |
|---|---|
| No `Ready for development` DEMO Story or Bug (sweep) | Report nothing to do; stop without changes. |
| Named issue not `Ready for development` (manual) | Do not implement; report why it is ineligible. |
| Missing technical design or ADR | Comment in Dutch; remain `Ready for development`; stop. |
| Design conflicts with acceptance criteria | Comment in Dutch; remain `Ready for development`; stop. |
| Other contributor's local changes conflict | Do not touch them; comment in Dutch; stop. |
| Design excludes a proposed backend or database | Do not add it; implement the designed scope. |
| Push or PR fails | Do not transition to `Ready for review`; comment in Dutch. |

## Common mistakes

| Mistake | Correct behavior |
|---|---|
| Asking the human a clarifying question about scope or design | Never ask; implement exactly what the design/ADR says, or comment and stop if it is insufficient. |
| Adding an ADR yourself because delivery is urgent | Only the software architect creates the design; comment and stop. |
| Treating a test-passing local commit as review-ready | Push and create the PR first. |
| Implementing a "better" architecture | Follow the approved architecture; propose a follow-up ticket if needed. |
| Folding unrelated working-tree changes into the feature | Leave them untouched and work only on the ticket scope. |
| Transitioning to `In progress` after starting to code, or skipping straight to `Ready for review` | Transition to `In progress` before any code change, and to `Ready for review` only after the PR exists. |
