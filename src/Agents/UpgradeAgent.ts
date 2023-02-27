import { StepJob } from "../Jobs/StepJob";
import { UpgradeJob } from "../Jobs/UpgradeJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";

export class UpgradeAgent extends Agent
{
    controllerId : string;

    constructor(controllerId: string)
    {
        super();
        this.controllerId   = controllerId;
    }

    tick()
    {
        const makeJob = (depo, ctrl) => new StepJob([ new WithdrawJob(null, depo), new UpgradeJob(null, ctrl) ], this.constructor.name);

        if (!this.depo)
            return;
        if (this.getJobsAssignedBy(this.constructor.name).length <= 1)
            this.jobPool.add(makeJob(this.depo, this.controllerId));

        super.tick();
    }
}