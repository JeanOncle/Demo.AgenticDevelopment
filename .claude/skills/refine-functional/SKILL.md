---
name: refine-functional
description: Use when a product request needs clarification, decomposition, duplicate analysis, or a JIRA Story in the DEMO project. Also runs an autonomous sweep of recently created DEMO tickets when invoked with no specific request (e.g. from a scheduled loop).
context: fork
agent: product-owner
---

# Creating JIRA Stories

## Overview

Turn a sufficiently defined product request into a traceable, functional JIRA Story. The product owner works only in the `New` stage, completes the functional refinement, and never edits code or prescribes an implementation.

This skill runs in one of two modes:

- **Manual Request Workflow** — a human describes a request directly in the conversation. Use `AskUserQuestion` to resolve gaps interactively.
- **Autonomous Ticket Sweep** — invoked with no specific request (including scheduled/`/loop` invocations). It finds recently created DEMO tickets itself and resolves gaps by commenting on the ticket, since no human is present in the conversation to ask.

Decide the mode first: if the invocation includes a described product request or names an existing Story to refine, use the Manual Request Workflow. If it does not (empty or generic invocation, e.g. a bare `/refine-functional`), use the Autonomous Ticket Sweep.

### Sequencing rule

Questions come before content, in both modes:

1. Resolve every material gap first — via `AskUserQuestion` in the Manual Request Workflow, or via an answered comment thread in the Autonomous Ticket Sweep. Never guess or fill a gap with a plausible default.
2. Only once nothing material is left unresolved, write the full **Required Story Content** template, set the summary to match (see [Summary](#summary) below), and transition the ticket to `Refined functional` — as a single combined final step, never separately or in advance. A ticket with any open question must stay in `New` with no functional-specification content written yet (a rough draft or the original request text in the description is fine; the template is not).

## Defaults

| Field | Value |
|---|---|
| Site | `audentia.atlassian.net` |
| Project | `DEMO` |
| Issue type | `Story` |
| Priority | `Medium` |
| Label | `agentic` |
| Clarification label | `needs-clarification` (added while a question is outstanding, removed once resolved) |
| Assignee | Jan Ooms, `557058:02de28d0-209a-401a-8ab4-7b60bd10ca1a` |
| Language | Dutch; retain technical terms in their original form |

## Manual Request Workflow

1. Parse the request into actor, desired capability, outcome, scope, constraints, and acceptance criteria. Record the request exactly as the human first typed it (before any clarification back-and-forth) — this verbatim text goes into the **Original request** section of the template later. If the request is split into multiple Stories, include the same full verbatim text in each resulting Story.
2. A request is sufficiently specified only when its actor, capability, business outcome, functional scope, and at least two observable acceptance criteria are confirmed. A material gap is any missing or conflicting information in those areas. Ask one focused question at a time with `AskUserQuestion` until it is resolved; do not ask about details that can safely remain open.
3. Split a large request into independently valuable Stories. Keep each Story coherent and explain dependencies or recommended order.
4. When a request references existing, old, legacy, or comparable behavior, confirm the exact source and intended functional behavior before deriving scope or acceptance criteria. If it cannot be identified, ask whether to defer the ticket or record the unknown behavior as an explicit follow-up; never infer it.
5. Before creating each Story, run the **Duplicate Search** procedure below.
6. If a likely duplicate or substantial overlap is found, show the issue keys, summaries, statuses, and reason for the match. Ask the user whether to create a new Story; do not create one until they decide.
7. For no likely duplicate, use `createJiraIssue` with `cloudId: "audentia.atlassian.net"`, `projectKey: "DEMO"`, `issueTypeName: "Story"`, `contentFormat: "markdown"`, `summary` set per [Summary](#summary) below, and the assigned account ID above. Put `{"priority":{"name":"Medium"},"labels":["agentic"]}` in `additional_fields`. The new Story starts in `New`.
8. After the Story content is complete, obtain its available transitions and transition only that Story to `Refined functional`. Do not assume a transition ID or use a transition belonging to another issue.
9. Report the created key, Dutch summary, assignment to Jan Ooms, `agentic` label, final `Refined functional` status, and all relevant-ticket references.
10. If the request evolved during clarification (split, renamed, or reframed after the initial summary was set) and the ticket's summary no longer matches the confirmed capability, update the summary field to match before reporting.

## Autonomous Ticket Sweep

Runs unattended, so any material gap must be resolved by commenting on the ticket and waiting for a human reply on a later invocation — never invent an answer, and never wait synchronously within a single run. This mode assumes it is invoked at least as often as the candidate window below (e.g. `/loop 5m /refine-functional`); a sparser cadence means a ticket could be missed by the `created >= -30m` search before it also gets picked up via the `needs-clarification` label search.

1. Gather candidates with two JQL searches against `cloudId: "audentia.atlassian.net"`, requesting fields `["summary","description","status","labels","comment"]`:
   - New: `project = DEMO AND issuetype = Story AND status = "New" AND created >=  30m ORDER BY created ASC`
   - Awaiting reply: `project = DEMO AND issuetype = Story AND status = "New" AND labels = "needs-clarification" ORDER BY updated ASC`

   Merge the results and de-duplicate by issue key. If both searches return nothing, report that no tickets needed attention and stop.
2. For each candidate, in order:
   a. Read its `comment.comments` list and classify each comment as **mine** (body starts with the marker defined in [Distinguishing my comments from human replies](#distinguishing-my-comments-from-human-replies) below) or **human** (anything else, regardless of author).
   b. If the most recent comment is mine and no human comment follows it, the ticket is still waiting on a reply — skip it, and note it as "waiting" in the final report.
   c. Otherwise, re-run the sufficiency check from Manual Request Workflow step 2 using the description plus the full comment thread (a human reply answers the most recent question mine).
   d. If a material gap remains (per the [Sequencing rule](#sequencing-rule)): post a new comment with the required marker (see below) asking exactly one focused question, phrased in Dutch like the rest of the ticket. Add the `needs-clarification` label if it is not already present. Do not touch the description and do not transition the status. Note the ticket as "asked" in the final report.
   e. If the ticket is now sufficiently specified: run the **Duplicate Search** procedure below.
      - If a likely duplicate is found, post a marked comment (see below) describing the match and asking the human to confirm whether to proceed or close as a duplicate — this is itself an open question, so per the Sequencing rule the description must not be rewritten yet. Add `needs-clarification` if not present, and note the ticket as "asked" (duplicate-check).
      - If no likely duplicate, before rewriting, capture the ticket's current description verbatim — per the Sequencing rule it has not yet been touched, so it is still the original request text. Rewrite the description to match the **Required Story Content** template using only confirmed information from the original description and the comment thread, quoting that captured text in the **Original request** section, update the summary field per [Summary](#summary) below, remove the `needs-clarification` label if present, obtain the ticket's transitions, and transition it to `Refined functional` in the same pass. Note the ticket as "refined".
3. Report a short summary grouped by outcome: refined (keys + summaries), asked (keys + the question posted), and waiting (keys only, no action taken this run).

### Distinguishing my comments from human replies

Claude may be authenticated in JIRA under the same Atlassian account as the human user, so comment authorship alone cannot tell them apart. Instead, every comment this skill posts must start with this exact marker on its own line, before the question text:

```
🤖 _Automatische verduidelijkingsvraag (Claude)_
```

When scanning a comment thread, treat a comment as mine only if its body starts with that marker; treat every other comment as a human reply, regardless of its author field. Never post a question without the marker, and never treat a marked comment of your own as an answer to a previous question.

## Duplicate Search

Search JIRA with `searchJiraIssuesUsingJql` in `DEMO` using the key product nouns and synonyms. Request `summary`, `description`, `status`, `issuetype`, `priority`, `labels`, and `project`; inspect up to 10 relevant results. Search both direct terminology and the functional outcome. For example:

```jql
project = DEMO AND (text ~ "\"[product term]\"" OR text ~ "\"[synonym]\"")
```

```jql
project = DEMO AND text ~ "\"[functional outcome]\""
```

Replace each placeholder with Dutch and original technical-language variants from the confirmed request. Exclude the ticket being refined from its own duplicate check.

## Summary

The JIRA `summary` (title) field is refined content, not metadata — keep it as accurate as the description. Write it in clear Dutch, retaining technical terms in their original form, as a concise statement of the capability and actor, e.g. `[Actor] kan [mogelijkheid]`. It must reflect the final confirmed scope: if clarification narrows, splits, or reframes the request after a summary was first drafted, update the summary to match before the ticket is treated as refined — never leave a stale, generic, or pre-clarification title on a `Refined functional` Story. When a request is split into multiple Stories, give each a distinct summary describing only that Story's scope, not the original combined request.

## Required Story Content

Write the summary and body in clear Dutch. Do not translate technical terms or official product names.

```markdown
## Beschrijving
[Bondige functionele beschrijving en beoogde gebruikerswaarde.]

## User story
Als [gebruiker/rol] wil ik [mogelijkheid] zodat [waarde/resultaat].

## Acceptatiecriteria
1. [Waarneembaar, testbaar functioneel resultaat.]
2. [Waarneembaar, testbaar functioneel resultaat.]

## Gerelateerde JIRA-items
- [KEY] — [samenvatting]: [relatie of reden dat dit geen duplicaat is.]

## Original request
> [Verbatim original request text, exactly as first submitted — the human's wording in Manual Request Workflow, or the ticket's original description in the Autonomous Ticket Sweep. Never paraphrased or translated.]
```

Include only confirmed information. If no related item was found, state `Geen relevante JIRA-items gevonden.` Never add implementation tasks, code snippets, estimates, or speculative technical designs. The **Original request** quote is the one exception to "only confirmed information" — it is preserved verbatim even though it may include since-resolved ambiguity, so the ticket keeps a record of what was originally asked.

## Common Mistakes

| Mistake | Correct behavior |
|---|---|
| Creating before resolving material ambiguity | Ask one focused question first. |
| Treating a keyword hit as a duplicate | Compare user value, scope, and acceptance criteria, then confirm overlap before acting. |
| Writing English tickets or translating technical terms | Use Dutch prose and retain technical terms such as `CSV`, `API`, and `OAuth`. |
| Omitting workflow fields | Every created Story gets `Medium`, `agentic`, and Jan Ooms as assignee. |
| Stopping after creating the `New` Story | Complete the functional refinement and transition it to `Refined functional`. |
| Moving a Story beyond functional refinement | Only transition from `New` to `Refined functional`; later review and delivery stages belong to other workflow participants. |
| Editing code to validate a request | Remain planning-only; JIRA research is the permitted action. |
| Posting a sweep question without the marker | Unmarked comments cannot be told apart from human replies on the next run, so the ticket looks perpetually "waiting" or its question looks "answered" by itself. |
| Re-asking or re-answering a question the ticket already resolved | Check the full comment thread for an existing unanswered marked comment before posting a new one. |
| Asking `AskUserQuestion` during an Autonomous Ticket Sweep | No human is present in that mode; ask by commenting on the ticket instead. |
| Writing the Required Story Content template, or transitioning to `Refined functional`, while a question is still open | Both happen together, only once every material gap is resolved — see the Sequencing rule. |
| Omitting or paraphrasing the **Original request** section | Capture the request verbatim before any rewriting and quote it unchanged, so the original ask stays traceable even after refinement. |
| Rewriting the description but leaving a stale or generic summary/title | Update the summary field to match the confirmed scope in the same pass — see [Summary](#summary). |
