import _HasStore    from "../Misc";
import Job          from "./Job";

export default class RepairJob extends Job
{
    target: Id<Structure>

    constructor(assigner: string, target: Id<Structure>)
    {
        super(assigner);
        this.target = target;
    }

    isFinished(creep: Creep, target: Structure): boolean
    {
        if (creep.store.energy == 0 || target.hits == target.hitsMax)
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

        let code = creep.repair(target);
        if (code == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
    }
}