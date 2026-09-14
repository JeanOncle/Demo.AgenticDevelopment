# Prompts
## Product owner
Could you create a new agent and relevant skills: I want this to be a dedicated product owner agent. It never edits code directly. It plans, parses requirements and breaks down tasks. It should use JIRA (and thus use the Atlassian MCP) and should create tickets in Dutch (but it shouldn't translate technical terms into Dutch). It should also check in JIRA for similar tickets or related functional requirements. If a ticket has been created, it should get the label "agentic" and assign the ticket to Jan Ooms for review.

For clarity, I need an agent which acts as a product owner and a skill for this agent that creates a ticket for the given input. The skill should asks questions to the user about the feature requested if things are unclear.

Please ask me relevant questions about this product owner agent and skill, so you can add this information to the agent.md and SKILL.md files.

## Software Architect / Technical Lead
The next step in our development proces is the creation of a technical design and an overview of the technical implications of the given feature. I need a dedicated agent that will act as a software architect or technical lead. The main goal of this agent is to make sure all coding guidelines and design patterns are followed correctly. This agent is responsible for the entire application from a technical point of view. 

There should be a skill for this agent that creates a technical design for the required feature. If you think the feature will have extreme implications that might danger the stability of the product, please add your (blocking) advice to the JIRA ticket. If you don't see any blockers, please create an architecture decision record (ADR), please parse this webpage https://martinfowler.com/bliki/ArchitectureDecisionRecord.html to know how ADR's work. If you need to create any charts or flows, use PlantUML and add them to the ticket as well.

Please ask me relevant questions about this product owner agent and skill, so you can add this information to the agent.md and SKILL.md files. The agent and skill(s) should be added to the current git-repository.