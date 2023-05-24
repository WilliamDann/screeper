// Responsible for controlling creeps while building

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
            delete creep.memory['state'];
    }
    else
        creep.say("idle");
}