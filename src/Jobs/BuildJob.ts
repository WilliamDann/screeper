import _HasStore    from "../Misc";
import CollectTask from "../Tasks/CollectTask";
import GeneralTask from "../Tasks/GeneralTask";
import Task         from "../Tasks/Task";
import Job          from "./Job";

export default class BuildJob implements Job
{
    complete : boolean;
    error    : string;
    tasks    : Task[];

    pickup   : Id<_HasId>;
    site     : Id<ConstructionSite>;

    constructor(pickup: Id<_HasId>, site: Id<ConstructionSite>)
    {
        this.tasks = [
            new CollectTask(pickup),
            new GeneralTask('build', site)
        ]
        this.pickup = pickup;
        this.site   = site;
    }

    run()
    {
        let pickup  = Game.getObjectById(this.pickup);
        let site    = Game.getObjectById(this.site);

        if (!pickup)
        {
            this.error = `Invalid Target ${this.pickup}`;
            return;
        }

        if (!site || site.progress >= site.progressTotal)
        {
            this.complete = true;
            return;
        }
    }
}