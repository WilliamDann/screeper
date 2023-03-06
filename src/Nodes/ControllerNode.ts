import Node         from "./Node";

export default class ControllerNode extends Node
{
    rclGoal : number;

    constructor(controller: Id<StructureController>, rclGoal=8)
    {
        super(controller);
        this.rclGoal = rclGoal;
    }

    tick()
    {
        if (this.creeps.length < 1)
            this.makeSpawnRequest();
    }
}