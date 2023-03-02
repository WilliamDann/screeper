import { Agent } from "./Agents/Agent";

export class AgentController
{
    agents : Agent[];

    constructor(agents)
    {
        if (!agents)
            agents = []
        this.agents     = agents;
        for (let agent of this.agents)
            agent.controller = this;
    }

    pre()
    {
        this.agents.forEach(agent => agent.pre());
    }

    tick()
    {
        this.agents.forEach(agent => agent.tick());
    }

    post()
    {
        this.agents.forEach(agent => agent.post());
    }

    findAgentOfType(clss)
    {
        for (let agent of this.agents)
            if (agent.constructor.name == clss)
                return agent;
    }
}