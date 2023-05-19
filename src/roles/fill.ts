// Responsible for controlling creeps transferring resources 

export default function(creep: Creep)
{
    const target = Game.getObjectById(creep.memory['target'] as Id<StructureContainer>);

    if (creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") != 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = creep.transfer(target, RESOURCE_ENERGY);
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);

        if (status != OK)
            creep.say(`! ${status}`);
    }
    else
        creep.say("idle");
}
