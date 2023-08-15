import CreepProc from "../CreepProc";

// harvests material from a sources and drops them
export default class DropHarvestProc extends CreepProc
{
    memory: {
        source      : Id<Source>    // the source to mine from

        creeps      : string[]      // the creeps under the control of the proc
        creepGoal   : number        // the number of creeps to mine with
    }


    constructor(name: string, memory ?: object)
    {
        super(name, memory);
    }


    // handle the behavior of a creep
    handleCreep(creep: Creep)
    {
        // drop harvest at target
        const target = Game.getObjectById(this.memory.source);
        const result = creep.harvest(target);

        if (result == ERR_NOT_IN_RANGE)
            creep.moveTo(target)
        else if (result == OK)
            creep.drop(RESOURCE_ENERGY);
        else
            creep.say(`err: ${result}`);
    }


    init(): void
    {
        super.init();
    }


    run(): void
    {
        super.run();
    }
}