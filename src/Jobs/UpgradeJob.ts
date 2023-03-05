import CollectTask  from "../Tasks/CollectTask";
import GeneralTask  from "../Tasks/GeneralTask";
import Task         from "../Tasks/Task";
import Job          from "./Job";

export default class UpgradeJob implements Job
{
    complete    : boolean;
    error       : string;
    tasks       : Task[];

    pickup      : Id<_HasId>;
    controller  : Id<StructureController>;
    rclGoal     : number;

    constructor(pickup: Id<_HasId>, controller: Id<StructureController>, rclGoal: number)
    {
        this.tasks = [
            new CollectTask(this.pickup),
            new GeneralTask('upgradeController', this.controller)
        ];
        this.pickup     = pickup;
        this.controller = controller;
        this.rclGoal    = rclGoal;
    }

    run()
    {
        let controller = Game.getObjectById(this.controller);
        if (!controller || !controller.level)
        {
            this.error = `Invalid Target ${this.controller}`;
            return;
        }

        if (controller.level >= this.rclGoal)
        {
            this.complete = true;
            return;
        }
    }
}