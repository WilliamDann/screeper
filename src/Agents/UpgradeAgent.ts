import { StepJob } from "../Jobs/StepJob";
import { UpgradeJob } from "../Jobs/UpgradeJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";

export class UpgradeAgent extends Agent
{
    controllerId : string;

    constructor(controllerId: string, depo: string)
    {
        super();
        this.controllerId   = controllerId;
        this.depo           = depo;
    }

    tick()
    {
        const makeJob = (depo, ctrl) => new StepJob([ new WithdrawJob(null, depo), new UpgradeJob(null, ctrl) ], this.constructor.name);

        if (!this.depo)
            return;

        this.jobQueue.enqueue(makeJob(this.depo, this.controllerId), 1);
        super.tick();
    }
}