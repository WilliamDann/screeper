import { freeSpots, timerStart, timerStop } from "../../util";
import CreepProc from "../CreepProc";

// harvests material from a sources and drops them
export default class DropHarvestProc extends CreepProc
{
    source: Source;
    memory: {
        source      : Id<Source>    // the source to mine from

        creeps      : string[]           // the creeps under the control of the proc
        creepGoal   : number             // the number of creeps to mine with
        bodyGoal    : BodyPartConstant[] // the creep body goal of the proc
    }


    constructor(name: string, memory ?: object)
    {
        super(name, memory);
    }


    // handle the behavior of a creep
    handleCreep(creep: Creep)
    {
        if (creep.harvest(this.source) == ERR_NOT_IN_RANGE)
            creep.moveTo(this.source);

        // drop if resouce below is getting low or we're full
        let dropPoint = creep.pos.lookFor(LOOK_RESOURCES)[0];
        if (!dropPoint || dropPoint.amount < 100 || creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            creep.drop(RESOURCE_ENERGY);
    }


    init(): void
    {
        this.source = Game.getObjectById(this.memory.source);
        if (!this.memory.creepGoal)
            this.memory.creepGoal = freeSpots(this.source.pos);
        super.init();
    }


    run(): void
    {
        super.run();
    }
}