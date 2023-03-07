import _HasStore    from "../Misc";
import Job          from "./Job";

export default class BuildJob extends Job
{
    target: Id<ConstructionSite>

    constructor(target: Id<ConstructionSite>)
    {
        super();
        this.target = target;
    }

    isFinished(creep: Creep, target: ConstructionSite): boolean
    {
        if (creep.store.energy == 0 || !target || target.progress == target.progressTotal)
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

        if (this.isFinished(creep, target))
        {
            this.complete = true;
            return;
        }

        let code = creep.build(target);
        if (code == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
    }
}