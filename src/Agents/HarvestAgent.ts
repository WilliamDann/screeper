import { HarvestJob } from "../Jobs/HarvestJob";
import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { Agent } from "./Agent";

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

    tick(): void {
        if (this.jobQueue.queue.length == 0)
            this.jobQueue.enqueue(
                new StepJob([
                    new HarvestJob(null, this.source),
                    new TransferJob(null, this.spawn)
                ])
            );

        super.tick();
    }
}