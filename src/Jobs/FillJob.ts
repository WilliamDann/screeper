import Job          from "./Job";
import Task         from "../Tasks/Task";
import CollectTask  from "../Tasks/CollectTask";
import TransferTask from "../Tasks/TransferTask";
import _HasStore    from "../Misc";

export default class FillJob implements Job
{
    complete    : boolean;
    error       : string;
    tasks       : Task[];

    pickup      : Id<_HasStore & _HasId>;
    dropoff     : Id<_HasStore & _HasId>;

    constructor(pickup: Id<_HasStore & _HasId>, dropoff: Id<_HasStore & _HasId>)
    {
        this.tasks = [
            new CollectTask(pickup),
            new TransferTask(dropoff)
        ];
        this.pickup  = pickup;
        this.dropoff = dropoff;
    }

    run()
    {
        let pickup  = Game.getObjectById(this.pickup);
        let dropoff = Game.getObjectById(this.dropoff);

        if (!pickup || !pickup.store)
        {
            this.error = `Invalid Target ${this.pickup}`;
            return;
        }

        if (!dropoff || !dropoff.store)
        {
            this.error = `Invalid Target ${this.dropoff}`;
            return;
        }

        if (dropoff.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
        {
            this.complete = true;
            return;
        }
    }
}