import { BuildJob } from "../Jobs/BuildJob";
import { RepairJob } from "../Jobs/RepairJob";
import { StepJob } from "../Jobs/StepJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";
import { SpawnerAgent, SpawnRequest } from "./SpawnerAgent";

export class BuildAgent extends Agent
{
    constructor(spawn: string)
    {
        super();
        this.depo = spawn;
    }

    createBuildJobs(depo: Structure)
    {
        for (let site of depo.room.find(FIND_CONSTRUCTION_SITES))
            this.jobQueue.enqueue(
                new StepJob([
                    new WithdrawJob(null, this.depo),
                    new BuildJob(null, site.id)
                ], this.constructor.name)
            );
    }

    createRepairJobs(depo: Structure)
    {
        for (let site of depo.room.find(FIND_STRUCTURES, { filter: x => x.hits != x.hitsMax }))
        {
            this.jobQueue.enqueue(
                new StepJob([
                    new WithdrawJob(null, this.depo),
                    new RepairJob(null, site.id)
                ], this.constructor.name)
            );
        }
    }

    tick()
    {
        let depoObj = Game.getObjectById(this.depo as any) as Structure;

        if (this.jobQueue.queue.length == 0)
        {
            this.createBuildJobs(depoObj);
            this.createRepairJobs(depoObj);
        }

        super.tick();
    }
}