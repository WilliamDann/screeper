import BaseEvent from "./BaseEvent";

export default class SpawnRequestEvent extends BaseEvent
{
    name   : string;
    body   : BodyPartConstant[];
    opts   : SpawnOptions;

    owner ?: string;

    constructor()
    {
        super("SpawnRequest");
        this.opts = {};
    }

    setName(name: string)
    {
        this.name = name;
        return this;
    }

    setBody(body: BodyPartConstant[])
    {
        this.body = body;
        return this;
    }

    setOpts(opts: SpawnOptions)
    {
        this.opts = opts;
        return this;
    }

    setOwner(owner: string)
    {
        this.owner = owner;
        return this;
    }
}