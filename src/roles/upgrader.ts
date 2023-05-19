// Concerns
// 1. Find a source to harvest from
// 2. Harvest from that soucre
// 3. Upgrade the current room controller

export default function(creep: Creep) 
{
    const target = Game.getObjectById(creep.memory['target'] as Id<StructureController>);

    if (creep.memory['state'] && creep.store.getFreeCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = creep.upgradeController(target);
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);

        if (status != OK)
            creep.say(`! ${status}`);
    }
    else
        creep.say("idle");
}