// Concerns
// 1. Find a source to harvest from
// 2. Harvest from that soucre
// 3. Find a building to build
// 4. Build that found building

export default function(creep: Creep) 
{
    const target = Game.getObjectById(creep.memory['target'] as Id<ConstructionSite>);

    if (creep.memory['state'] && creep.store.getFreeCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = creep.build(target);
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);

        if (status != OK)
            creep.say(`! ${status}`);
    }
    else
        creep.say("idle");
}