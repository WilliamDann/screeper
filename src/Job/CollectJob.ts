import _HasStore    from "../Misc";
import Job          from "./Job";

export default class CollectJob extends Job
{
    target: Id<Structure|Source>

    constructor(assigner: string, target: Id<Structure|Source>)
    {
        super(assigner);
        this.target = target;
    }

    harvestOrWithdraw(creep: Creep, target: Structure|Source): ScreepsReturnCode
    {
        if (target instanceof Source)
            return creep.harvest(target as Source); 
        return creep.withdraw(target as any, RESOURCE_ENERGY);
    }

    isFinished(creep: Creep, target: Structure|Source): boolean
    {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            return true;
    }

    run()
    {
        let creep = Game.creeps[this.creep];
        if (!creep)
        {
            this.error = `Invalid Creep '${this.creep}'`;
            return;
        }

        let target = Game.getObjectById(this.target);
        if (!target)
        {
            this.error = `Invalid Target ${this.target}`;
            return;
        }

        if (this.isFinished(creep, target))
        {
            this.complete = true;
            return;
        }

        let code = this.harvestOrWithdraw(creep, target)
        if (code == ERR_NOT_IN_RANGE)
            creep.moveTo(target as any);
    }
}