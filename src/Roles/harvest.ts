// harvesting behavior for creeps
export default function(creep: Creep)
{
    const target = Game.getObjectById<Source>(creep.memory['target']);
    const status = creep.harvest(target);

    if (status == ERR_NOT_IN_RANGE)
        creep.moveTo(target);

    if (status == OK)
        creep.drop(RESOURCE_ENERGY);

    creep.say(status+'');
}