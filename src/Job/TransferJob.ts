import _HasStore    from "../Misc";
import Job          from "./Job";

export default class TransferJob extends Job
{
    target: Id<_HasStore & _HasId>

    constructor(assigner: string, target: Id<_HasStore & _HasId>)
    {
        super(assigner);
        this.target = target;
    }

    isFinished(creep: Creep, target: _HasStore & _HasId): boolean
    {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
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

        let code = creep.transfer(target as any, RESOURCE_ENERGY);
        if (code == ERR_NOT_IN_RANGE)
            creep.moveTo(target as any);
    }
}