// Responsible for controlling creeps while they recycle themselves

export default function(creep: Creep)
{
    const target = Game.getObjectById(creep.memory['target'] as Id<StructureSpawn>);
    creep.say('bye')

    if (creep.memory['state'] && creep.store.getFreeCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = target.recycleCreep(creep)
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);

        if (status != OK)
            creep.say(`! ${status}`);
    }
    else
        creep.say("idle");
}
