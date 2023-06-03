// Responsible for controlling creeps while mining

export default function(creep: Creep)
{
    const target = Game.getObjectById(creep.memory['target'] as Id<Source>);
    creep.memory['state'] = true;

    let result: ScreepsReturnCode = creep.harvest(target);
    if (result == ERR_NOT_IN_RANGE)
        result = creep.moveTo(target);
    else if (creep.store.energy != 0)
        creep.drop('energy');

    if (result != OK)
        creep.say(`! ${result}`)
}
