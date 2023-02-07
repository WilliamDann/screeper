import { HarvestJob } from "../Jobs/HarvestJob";
import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { Agent } from "./Agent";
import { SpawnerAgent, SpawnRequest } from "./SpawnerAgent";

export class HarvestAgent extends Agent
{
    source  : string; // source id
    spawn   : string; // spawn id

    constructor(source: string, spawn: string)
    {
        super(`Harvest_${source}`);
        this.source = source;
        this.spawn  = spawn;
    }

    trySpawnCreep()
    {
        if (this.creepPool.totalCreeps() < 3)
        {
            let name    = `${this.memSignature}_${Game.time}`
            let body    =  [WORK, CARRY, MOVE];

            let spawner = this.controller.findAgentOfType(SpawnerAgent) as SpawnerAgent;
            if (spawner.getRequestsFrom(this.memSignature).length == 0)
                if (spawner.enqueue( {name: name, body: body, requester: this.memSignature} as SpawnRequest))
                    this.creepPool.creepsIdle.push(name);
        }
    }

    tick(): void {
        if (this.jobQueue.queue.length == 0)
            this.jobQueue.enqueue(
                new StepJob([
                    new HarvestJob(null, this.source),
                    new TransferJob(null, this.spawn)
                ])
            );

        if (this.creepPool.totalCreeps() < 3)
            this.trySpawnCreep();

        super.tick();
    }
}