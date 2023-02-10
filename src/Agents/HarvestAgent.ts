import { HarvestJob } from "../Jobs/HarvestJob";
import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { Agent } from "./Agent";
import { SpawnerAgent, SpawnRequest } from "./SpawnerAgent";

export class HarvestAgent extends Agent
{
    source  : string; // source id

    constructor(source: string, depo: string)
    {
        super(`HarvestAgent_${source}`);
        this.source = source;
        this.depo  = depo;
    }

    trySpawnCreep()
    {
        if (this.creepPool.totalCreeps() < 3)
        {
            let name    = `${this.memSignature}_${Game.time}`
            let body    =  [WORK, CARRY, MOVE];

            let spawner = this.controller.findAgentOfType("SpawnerAgent") as SpawnerAgent;
            if (spawner.getRequestsFrom(this.memSignature).length == 0)
                if (spawner.enqueue( {name: name, body: body, requester: this.memSignature} as SpawnRequest))
                    this.creepPool.creepsIdle.push(name);
        }
    }

    pre(): void {
        super.pre();

        if (!Memory[this.memSignature]['source'])
            this.post();
        this.source = Memory[this.memSignature]['source'];
    }
    
    tick(): void {
        if (this.jobQueue.queue.length == 0)
            this.jobQueue.enqueue(
                new StepJob([
                    new HarvestJob(null, this.source),
                    new TransferJob(null, this.depo)
                ])
            );

        if (this.creepPool.totalCreeps() < 3)
            this.trySpawnCreep();

        super.tick();
    }

    post(): void {
        super.post();
        Memory[this.memSignature]['source'] = this.source;
    }
}