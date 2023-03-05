import Task from "./Task";

interface _HasStore
{
    store: GenericStore;
}

export default class TransferTask implements Task
{
    target: Id<_HasId>;

    complete    : boolean;
    error       : string;

    constructor(target: Id<_HasId>)
    {
        this.target = target;
    }

    run(name: any) 
    {
        let creep   = Game.creeps[name];
        let target  = Game.getObjectById(this.target) as Creep|PowerCreep|(Structure & _HasStore);

        if (!creep)
            return;
        if (!target || !target.store)
        {
            this.error = `Invalid Target ${this.target}`;
            return;
        }
        if (creep.store.energy == 0 || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
        {
            this.complete = true;
            return;
        }

        let code : ScreepsReturnCode;
        code = creep.transfer(target, RESOURCE_ENERGY);
        if (code == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
        if (code == ERR_INVALID_ARGS || code == ERR_INVALID_TARGET)
            this.error = `Creep Error ${code}`;
    }
}