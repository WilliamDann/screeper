import { Agent } from "./Agents/Agent";
import { JobData } from "./Jobs/Job";
import { Runnable } from "./Runnable";

export class AgentController implements Runnable
{
    agents      : Agent[];

    constructor(agents)
    {
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