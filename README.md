# Flow
1. A ticket / request gets created, with the status `New`
2. The product owner agents starts working on this ticket and should ask questions if things are unclear. If everything is ready, the ticket status should change to `Refined functional`
3. Someone should review the ticket and change the status to `Ready for technical refinement`
4. The software architect agent starts his work and if done changes the status to `Refined technical`
5. Someone should review the ticket and change the status to `Ready for development`
6. The engineering agents changes the status to `In progress` starts his work and if done changes the status to `Ready for review`

# Start
1. Run `claude "/loop 1m /refine-functional"` for the product owner to start
2. Run `claude "/loop 1m /refine-technical"` for the software architect to start

# Demo
[https://demo-agentic-development-n6o8hvkjs-jeanoncle.vercel.app/](Opstelling maken)

# Prompts
## Product owner
Could you create a new agent and relevant skills: I want this to be a dedicated product owner agent. It never edits code directly. It plans, parses requirements and breaks down tasks. It should use JIRA (and thus use the Atlassian MCP) and should create tickets in Dutch (but it shouldn't translate technical terms into Dutch). It should also check in JIRA for similar tickets or related functional requirements. If a ticket has been created, it should get the label "agentic" and assign the ticket to Jan Ooms for review.

For clarity, I need an agent which acts as a product owner and a skill for this agent that creates a ticket for the given input. The skill should asks questions to the user about the feature requested if things are unclear.

Please ask me relevant questions about this product owner agent and skill, so you can add this information to the agent.md and SKILL.md files.

## Software Architect / Technical Lead
The next step in our development proces is the creation of a technical design and an overview of the technical implications of the given feature. I need a dedicated agent that will act as a software architect or technical lead. The main goal of this agent is to make sure all coding guidelines and design patterns are followed correctly. This agent is responsible for the entire application from a technical point of view. 

There should be a skill for this agent that creates a technical design for the required feature. If you think the feature will have extreme implications that might danger the stability of the product, please add your (blocking) advice to the JIRA ticket. If you don't see any blockers, please create an architecture decision record (ADR), please parse this webpage https://martinfowler.com/bliki/ArchitectureDecisionRecord.html to know how ADR's work. If you need to create any charts or flows, use PlantUML and add them to the ticket as well.

Please ask me relevant questions about this product owner agent and skill, so you can add this information to the agent.md and SKILL.md files. The agent and skill(s) should be added to the current git-repository.

## Developer
I need a new agent which acts as a full stack developer (might be junior, might be senior). You are a focused backend and frontend developer and you only execute scoped and bounded work orders (JIRA tickets with the status "Ready for development"). You write code, write unit tests and create components strictly bounded by the technical architecture that has been designed by the software architect agent (this design should already be in the JIRA ticket).

The main skill this agent has is to implement features / stories and fix bugs. It should look for tickets with the status "Ready for development" and start work on the first available ticket (ordered by priority and then ordered by date created). It should only start work if this ticket has been technically refined and a technical design is available. If no such design is available, stop work immediately and comment your findings in the JIRA ticket.

You work using the following steps:
- Change the status of the issue to "In progress"
- Create and checkout a new branch for example `feature/TICKETNUMBER` or `hotfix/TICKETNUMBER` (in case of a bug that needs to be fixed)
- Start your work on this branch
- Commit your work, your commitmessage should have the following format: `[TICKETNUMBER] Description`
  - The description in the commit message should state clearly **what** has been done and **why** these choices have been made
- For better tracking (and reviewing) of work, you are encouraged to split work in to several (atomic) commits.
- After work has been done, push your work to GitHub and create a pull request
- Change the status of the issue to "Ready for review"

Please ask me relevant questions about this product owner agent and skill, so you can add this information to the agent.md and SKILL.md files. The agent and skill(s) should be added to the current git-repository.