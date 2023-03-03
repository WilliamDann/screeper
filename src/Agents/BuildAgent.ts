import { BuildJob } from "../Jobs/BuildJob";
import { RepairJob } from "../Jobs/RepairJob";
import { StepJob } from "../Jobs/StepJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";

export class BuildAgent extends Agent
{
    constructor()
    {
        super();
    }

    createBuildJobs(depo: Structure)
    {
        for (let site of depo.room.find(FIND_CONSTRUCTION_SITES))
            this.jobPool.add(
                new StepJob([
                    new WithdrawJob(null, this.depo),
                    new BuildJob(null, site.id)
                ], this.constructor.name)
            );
    }

    createRepairJobs(depo: Structure)
    {
        for (let site of depo.room.find(FIND_STRUCTURES, { filter: x => x.hits != x.hitsMax && x.structureType != STRUCTURE_WALL }))
        {
            this.jobPool.add(
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

        if (!depoObj)
            return;

        if (this.jobPool.free.length == 0)
        {
            this.createBuildJobs(depoObj);
            this.createRepairJobs(depoObj);
        }

        super.tick();
    }
}