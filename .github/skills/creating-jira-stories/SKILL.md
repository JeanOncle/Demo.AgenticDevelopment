---
name: creating-jira-stories
description: Use when a product request needs clarification, decomposition, duplicate analysis, or a JIRA Story in the DEMO project.
---

# Creating JIRA Stories

## Overview

Turn a sufficiently defined product request into a traceable, functional JIRA Story. The product owner works only in the `New` stage, completes the functional refinement, and never edits code or prescribes an implementation.

## Defaults

| Field | Value |
|---|---|
| Site | `audentia.atlassian.net` |
| Project | `DEMO` |
| Issue type | `Story` |
| Priority | `Medium` |
| Label | `agentic` |
| Assignee | Jan Ooms, `557058:02de28d0-209a-401a-8ab4-7b60bd10ca1a` |
| Language | Dutch; retain technical terms in their original form |

## Workflow

1. Parse the request into actor, desired capability, outcome, scope, constraints, and acceptance criteria.
2. A request is sufficiently specified only when its actor, capability, business outcome, functional scope, and at least two observable acceptance criteria are confirmed. A material gap is any missing or conflicting information in those areas. Ask one focused question at a time with `ask_user` until it is resolved; do not ask about details that can safely remain open.
3. Split a large request into independently valuable Stories. Keep each Story coherent and explain dependencies or recommended order.
4. When a request references existing, old, legacy, or comparable behavior, confirm the exact source and intended functional behavior before deriving scope or acceptance criteria. If it cannot be identified, ask whether to defer the ticket or record the unknown behavior as an explicit follow-up; never infer it.
5. Before creating each Story, search JIRA with `searchJiraIssuesUsingJql` in `DEMO` using the key product nouns and synonyms. Request `summary`, `description`, `status`, `issuetype`, `priority`, `labels`, and `project`; inspect up to 10 relevant results. Search both direct terminology and the functional outcome. For example:

   ```jql
   project = DEMO AND (text ~ "\"[product term]\"" OR text ~ "\"[synonym]\"")
   ```

   ```jql
   project = DEMO AND text ~ "\"[functional outcome]\""
   ```

   Replace each placeholder with Dutch and original technical-language variants from the confirmed request.
6. If a likely duplicate or substantial overlap is found, show the issue keys, summaries, statuses, and reason for the match. Ask the user whether to create a new Story; do not create one until they decide.
7. For no likely duplicate, use `createJiraIssue` with `cloudId: "audentia.atlassian.net"`, `projectKey: "DEMO"`, `issueTypeName: "Story"`, `contentFormat: "markdown"`, and the assigned account ID above. Put `{"priority":{"name":"Medium"},"labels":["agentic"]}` in `additional_fields`. The new Story starts in `New`.
8. After the Story content is complete, obtain its available transitions and transition only that Story to `Refined functional`. Do not assume a transition ID or use a transition belonging to another issue.
9. Report the created key, Dutch summary, assignment to Jan Ooms, `agentic` label, final `Refined functional` status, and all relevant-ticket references.

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
```

Include only confirmed information. If no related item was found, state `Geen relevante JIRA-items gevonden.` Never add implementation tasks, code snippets, estimates, or speculative technical designs.

## Common Mistakes

| Mistake | Correct behavior |
|---|---|
| Creating before resolving material ambiguity | Ask one focused question first. |
| Treating a keyword hit as a duplicate | Compare user value, scope, and acceptance criteria, then ask the user if overlap is substantial. |
| Writing English tickets or translating technical terms | Use Dutch prose and retain technical terms such as `CSV`, `API`, and `OAuth`. |
| Omitting workflow fields | Every created Story gets `Medium`, `agentic`, and Jan Ooms as assignee. |
| Stopping after creating the `New` Story | Complete the functional refinement and transition it to `Refined functional`. |
| Moving a Story beyond functional refinement | Only transition from `New` to `Refined functional`; later review and delivery stages belong to other workflow participants. |
| Editing code to validate a request | Remain planning-only; JIRA research is the permitted action. |
