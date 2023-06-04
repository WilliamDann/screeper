// Responsible for controlling creeps while mining

import { assignRole } from "../funcs/misc";

export default function(creep: Creep)
{
    const target = Game.getObjectById(creep.memory['target'] as Id<Creep>);

    if (creep.memory['state'] && creep.store.getFreeCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = target.transfer(creep, RESOURCE_ENERGY);
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);
        if (status = ERR_INVALID_TARGET)
            assignRole(creep, undefined, undefined);

        if (status != OK)
            creep.say(`! take ${status}`);
    }
    else
        creep.say("idle");
}
