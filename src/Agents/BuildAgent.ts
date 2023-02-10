import { BuildJob } from "../Jobs/BuildJob";
import { StepJob } from "../Jobs/StepJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";
import { SpawnerAgent, SpawnRequest } from "./SpawnerAgent";

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
        if (this.jobQueue.queue.length == 0)
        {
            let spawnObj = Game.getObjectById(this.depo as any) as Structure;
            let site     = spawnObj.room.find(FIND_CONSTRUCTION_SITES)[0];
            if (!site)
                return;

            this.jobQueue.enqueue(
                new StepJob([
                    new WithdrawJob(null, this.depo),
                    new BuildJob(null, site.id)
                ])
            );
        }

        if (this.creepPool.totalCreeps() < 1)
            this.trySpawnCreep();

        super.tick();
    }
}