import { Agent } from "./Agent";
import { SpawnerAgent } from "./SpawnerAgent";

export class BrokerAgent extends Agent
{
    creeps: string[]; // creep ids

    constructor(creeps)
    {
        super();
        this.creeps = creeps;
    }

    tick()
    {
        
    }
}