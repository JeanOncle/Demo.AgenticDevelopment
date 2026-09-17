# Flow
1. A ticket / request gets created, with the status `New`
2. The product owner agents starts working on this ticket and should ask questions if things are unclear. If everything is ready, the ticket status should change to `Refined functional`
3. Someone should review the ticket and change the status to `Ready for technical refinement`
4. The software architect agent starts his work and if done changes the status to `Refined technical`
5. Someone should review the ticket and change the status to `Ready for development`
6. The engineering agents changes the status to `In progress` starts his work and if done changes the status to `Ready for review`

# Start
## Github Copilot
1. Run `copilot -p "/refine-functional"` for the product owner to start
2. Run `copilot -p "/refine-technical"` for the software architect to start
3. Run `copilot -p "/implement-feature"` for the fullstack developer to start

## Claude Code
1. Run `claude "/loop 1m /refine-functional"` for the product owner to start
2. Run `claude "/loop 1m /refine-technical"` for the software architect to start
3. Run `claude "/loop 1m /implement-feature"` for the fullstack developer to start

# Demo
[AI Circus demo](https://ai-circus.nl)
