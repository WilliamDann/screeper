import Node         from "./Node";

export default class ControllerNode extends Node
{
    constructor(controller: Id<StructureController>)
    {
        super(controller);
    }

    tick()
    {
        super.tick();
    }
}