import Node from "./Node";

export default class HarvestNode implements Node
{
    source: Id<Source>;

    constructor(source: Id<Source>)
    {
        this.source = source;
    }

    tick()
    {

    }
}