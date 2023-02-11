import { StepJob } from "../Jobs/StepJob";
import { UpgradeJob } from "../Jobs/UpgradeJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";
import { SpawnerAgent, SpawnRequest } from "./SpawnerAgent";

export class UpgradeAgent extends Agent
{
    controllerId : string;

    constructor(controllerId: string, depo: string)
    {
        super(`UpgradeAgent_${controllerId}`);
        this.controllerId   = controllerId;
        this.depo           = depo;
    }

    tick()
    {
        if (!this.depo)
            return;

        if (this.jobQueue.queue.length == 0)
            this.jobQueue.enqueue(
                new StepJob([
                    new WithdrawJob(null, this.depo),
                    new UpgradeJob(null, this.controllerId)
                ])
            );

        if (this.creepPool.totalCreeps() < 1)
            this.spawnCreep();

        super.tick();
    }
}