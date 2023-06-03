// Responsible for controlling creeps while picking up resources

import { assignRole } from "../funcs/misc";

export default function(creep: Creep)
{
    const target = Game.getObjectById(creep.memory['target'] as Id<Resource>);

    if (creep.memory['state'] && creep.store.getFreeCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = creep.pickup(target);
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);

        if (status == ERR_INVALID_TARGET)
            assignRole(creep, undefined, undefined);
        if (status != OK)
            creep.say(`! ${status}`);
    }
    else
        creep.say("idle");
}
