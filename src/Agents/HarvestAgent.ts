import { HarvestJob } from "../Jobs/HarvestJob";
import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { Agent } from "./Agent";
import { Job } from "../Jobs/Job";

export class HarvestAgent implements Agent
{
    source  : string; // source id
    spawn   : string;

    constructor(source: string, spawn: string)
    {
        this.source = source;
        this.spawn  = spawn;
    }

    tick() {}
    poll()
    {
        return [
            new StepJob([
                new HarvestJob(null, this.source),
                new TransferJob(null, this.spawn)
            ]
        )] as Job[];
    }
}