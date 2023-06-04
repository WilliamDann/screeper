// Responsible for controlling creeps while building

import { assignRole } from "../funcs/misc";

export default function(creep: Creep) 
{
    const target = Game.getObjectById(creep.memory['target'] as Id<ConstructionSite>);

    if (creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") != 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = creep.build(target);
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);

        if (status != OK)
            creep.say(`! ${status}`);
        if (status == ERR_INVALID_TARGET)
            assignRole(creep, null, null)
    }
    else
        creep.say("idle");
}