import { Agent } from "./Agents/Agent";
import { Runnable } from "./Runnable";

export class AgentController implements Runnable
{
    agents      : Agent[];

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
        let harv = this.findAgentOfType("HarvestAgent");

        if (harv['stage'] < 2)
            harv.creepTarget = 3;

            if (harv['stage'] == 2)
        {
            let upgrade = this.findAgentOfType("UpgradeAgent");
            upgrade.depo = harv.depo;
            upgrade.creepTarget = 1;

            let spawn  = this.findAgentOfType("SpawnerAgent");
            spawn.depo = harv.depo;
            spawn.creepTarget = 1;

            let build = this.findAgentOfType("BuildAgent");
            build.depo = harv.depo;
            build.creepTarget = 1;
        }

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