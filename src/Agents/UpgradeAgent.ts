import { StepJob } from "../Jobs/StepJob";
import { UpgradeJob } from "../Jobs/UpgradeJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";
import { SpawnerAgent, SpawnRequest } from "./SpawnerAgent";

export class UpgradeAgent extends Agent
{
    spawner      : string;
    controllerId : string;

    constructor(controllerId: string, spawner: string)
    {
        super(`UpgradeAgent_${controllerId}`);
        this.controllerId = controllerId;
        this.spawner      = spawner;
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

    tick()
    {
        if (this.jobQueue.queue.length == 0)
            this.jobQueue.enqueue(
                new StepJob([
                    new WithdrawJob(null, this.spawner),
                    new UpgradeJob(null, this.controllerId)
                ])
            );

        if (this.creepPool.totalCreeps() < 1)
            this.trySpawnCreep();

        super.tick();
    }
}