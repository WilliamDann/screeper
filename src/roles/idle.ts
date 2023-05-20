// Responsible for controlling creeps while idle

export default function(creep: Creep) 
{
    creep.say("idle");

    const idleFlag = Game.flags['IDLE'];
    if (!idleFlag)
        return;

    creep.moveTo(idleFlag);
}