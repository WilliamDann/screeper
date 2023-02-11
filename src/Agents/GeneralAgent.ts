import { Agent }                        from "./Agent";
import { SpawnerAgent, SpawnRequest }   from "./SpawnerAgent";

export class BuildAgent extends Agent
{
    constructor(spawn: string)
    {
        super(`BuildAgent_${spawn}`);
        this.depo = spawn;
    }

    trySpawnCreep()
    {
        let name    = `${this.memSignature}_${Game.time}`
        let body    =  [WORK, CARRY, MOVE];

        let spawner = this.controller.findAgentOfType("SpawnerAgent") as SpawnerAgent;
        if (spawner.getRequestsFrom(this.memSignature).length == 0)
            if (spawner.enqueue( {name: name, body: body, requester: this.memSignature} as SpawnRequest))
                this.creepPool.creepsIdle.push(name);
    }

    tick()
    {


        super.tick();
    }
}