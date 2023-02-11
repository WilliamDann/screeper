import { Agent }                        from "./Agent";
import { SpawnerAgent, SpawnRequest }   from "./SpawnerAgent";

export class GeneralAgent extends Agent
{
    constructor(spawn: string)
    {
        super(`GeneralAgent_${spawn}`);
        this.depo = spawn;
    }

    tick()
    {
        super.tick();
    }
}