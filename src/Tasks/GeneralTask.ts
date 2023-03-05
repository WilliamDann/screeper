import Task from './Task';

export default class GeneralTask implements Task
{
    action      : string;
    target      : Id<_HasId>
    args        : any[];

    complete    : boolean;
    error       : string;

    constructor(action: string, target: Id<_HasId>, args?: any)
    {
        if (!args)
            args = []
        if (!Creep.prototype[action])
            throw new Error(`Invalid Action ${action}`);

        this.action = action;
        this.target = target;
        this.args   = args;
    }

    run(creepName: string)
    {
        let creep   = Game.creeps[creepName];
        let target  = Game.getObjectById(this.target) as any;

        if (!creep)
            return;
        if (!target)
        {
            this.error = `Invalid Target ${this.target}`;
            return;
        }
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
        {
            this.complete = true;
            return;
        }

        let code : ScreepsReturnCode;
        code = creep[this.action](target, ...this.args);
        if (code == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
        if (code == ERR_INVALID_ARGS || code == ERR_INVALID_TARGET)
            this.error = `Creep Error ${code}`;
    }
}