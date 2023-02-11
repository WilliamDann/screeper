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

    tick(): void {
        if (this.jobQueue.queue.length == 0)
            this.jobQueue.enqueue(
                new StepJob([
                    new HarvestJob(null, this.source),
                    new TransferJob(null, this.depo)
                ])
            );

        if (this.creepPool.totalCreeps() < 3)
            this.spawnCreep();

        super.tick();
    }
}