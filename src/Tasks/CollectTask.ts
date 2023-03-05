import Task from "./Task";

export default class CollectTask implements Task
{
    source  : Id<_HasId>;

    complete: boolean;
    error   : string;

    constructor(source: Id<_HasId>)
    {
        this.source = source;
    }

    run(name: string)
    {
        let creep   = Game.creeps[name];
        let source  = Game.getObjectById(this.source);

        if (!creep)
            return;
        if (!source)
        {
            this.error = `Invalid Target ${this.source}`;
            return;
        }
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
        {
            this.complete = true;
            return;
        }

        let code : ScreepsReturnCode;
        if (source.constructor.name == "Source")
            code = creep.harvest(source as Source);
        if (source['store'])
            code = creep.withdraw(source as Structure, RESOURCE_ENERGY);
        if (source['amount'])
            code = creep.pickup(source as Resource);

        if (code == ERR_NOT_IN_RANGE)
            creep.moveTo(source as any);
        if (code == ERR_INVALID_ARGS || code == ERR_INVALID_TARGET)
            this.error = `Creep Error ${code}`;
    }
}