import { HarvestJob } from "../Jobs/HarvestJob";
import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { Agent } from "./Agent";
import { Job } from "../Jobs/Job";

export class HarvestAgent implements Agent
{
    source: string; // source id

    constructor(source: string)
    {
        this.source = source;
    }

    tick() {}
    poll()
    {
        let spawn   = Game.getObjectById(this.source as any) as any;
        spawn       = spawn.room.find(FIND_MY_SPAWNS)[0].id;

        return [
            new StepJob([
                new HarvestJob(null, this.source),
                new TransferJob(null, spawn.id as string)
            ]
        )] as Job[];
    }
}