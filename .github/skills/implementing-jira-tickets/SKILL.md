---
name: implementing-jira-tickets
description: Use when implementing a DEMO Story or Bug, fixing a defect, or starting work from a Refined JIRA ticket with an approved technical design.
---

# Implementing JIRA Tickets

## Overview

Implement one bounded `DEMO` Story or Bug exactly as designed, with tests and a reviewable pull request. A `Refined` status alone is insufficient: the issue comments must contain an applicable technical design and ADR.

## Select and qualify the ticket

1. Search only `DEMO` issues of type `Story` or `Bug` with status `Refined`, ordered by `priority DESC, created DESC`; select the first result.
2. If there is no eligible ticket, do not change JIRA, Git, or repository files.
3. Fetch the selected issue, comments, links, and repository conventions. Confirm that comments contain both a technical design and ADR applicable to the acceptance criteria.
4. When that evidence is absent, contradictory, or insufficient to implement safely, add one Dutch comment describing the precise missing or conflicting decision and required clarification. Keep the status `Refined`; do not create a design, branch, commit, or code change.

Do not treat urgency, an instruction to begin coding, or a `Refined` status as permission to fill in a missing design yourself.

## Implement the approved work

1. Obtain available transitions and move only the selected, qualified ticket to `In progress`.
2. Inspect `git status` before branch creation. Do not alter, stash, commit, discard, or incorporate changes that are not yours. If they conflict with the work, add a Dutch JIRA comment and stop.
3. Create and check out `feature/DEMO-123` for a Story or `hotfix/DEMO-123` for a Bug. If that branch already exists or cannot be created, preserve the state, comment in Dutch, and stop.
4. Implement only the acceptance criteria and decisions in the design/ADR. Follow existing project patterns. Treat a new backend, database, integration, dependency, authorization model, or operational component as out of scope unless the design explicitly requires it.
5. Add or update the focused unit, component, integration, or end-to-end tests prescribed by the design and existing test conventions. Run the smallest existing validation commands covering the change.
6. Make one or more atomic commits. Each commit subject must use `[DEMO-123] What changed and why`, for example: `[DEMO-123] Enforce reserve limit to prevent invalid selections`.
7. Push the branch and create a pull request targeting `master`, with the JIRA key, concise implementation summary, and validation results.
8. Only after the push and pull request succeed, obtain the available transitions and move the ticket to `In review`.

## Delivery failures

If any branch, validation, commit, push, pull-request, or status-transition action fails, do not represent the ticket as complete or in review. Preserve the successful work, add a Dutch JIRA comment stating the failed action, relevant error, current branch/commit or PR state, and the next action needed. Do not bypass a branch conflict by marking the ticket `In review`.

## Quick reference

| Condition | Required action |
|---|---|
| No `Refined` DEMO Story or Bug | Stop without changes. |
| Missing technical design or ADR | Comment in Dutch; remain `Refined`; stop. |
| Design conflicts with acceptance criteria | Comment in Dutch; remain `Refined`; stop. |
| Other contributor's local changes conflict | Do not touch them; comment in Dutch; stop. |
| Design excludes a proposed backend or database | Do not add it; implement the designed scope. |
| Push or PR fails | Do not transition to `In review`; comment in Dutch. |

## Common mistakes

| Mistake | Correct behavior |
|---|---|
| Adding an ADR yourself because delivery is urgent | Only the software architect creates the design; comment and stop. |
| Treating a test-passing local commit as review-ready | Push and create the PR first. |
| Implementing a “better” architecture | Follow the approved architecture; propose a follow-up ticket if needed. |
| Folding unrelated working-tree changes into the feature | Leave them untouched and work only on the ticket scope. |
