// Responsible for controlling creeps transferring resources 

export default function(creep: Creep)
{
    const target = Game.getObjectById(creep.memory['target'] as Id<Source>);

    if (creep.memory['state'] && creep.store.getFreeCapacity("energy") == 0)
        creep.memory['state'] = false;
    if (!creep.memory['state'] && creep.store.getUsedCapacity("energy") == 0)
        creep.memory['state'] = true;

    if (creep.memory['state'])
    {
        let status: any = creep.harvest(target);
        if (status == ERR_NOT_IN_RANGE)
            status = creep.moveTo(target);

        if (status == ERR_FULL)
        {
            creep.memory['role']   = undefined;
            creep.memory['state']  = undefined;
            creep.memory['target'] = undefined;
            return;
        }
        if (status != OK)
            creep.say(`! ${status}`);
    }
    else
        creep.say("idle");
}
