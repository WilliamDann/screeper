import { freeSpots } from "../../util";
import CreepProc from "../CreepProc";

// harvests material from a sources and drops them
export default class ProtoHarvestProc extends CreepProc
{
    source : Source;            // source to draw from
    spawner: StructureSpawn;    // spawn to deposit in

    memory: {
        source      : Id<Source>            // the source to mine from
        
        spawner     : Id<StructureSpawn>    // the spawn to fill
        creeps      : string[]              // creeps under control of the proc
        creepGoal   : number                // total creeps to have by the proc
    }


    constructor(name: string, memory ?: object)
    {
        super(name, memory);
    }


    // handle the behavior of a creep
    handleCreep(creep: Creep)
    {
        // run creep based on it's state
        if (creep.memory['state'])
        {
            // drop at spawner
            if (creep.transfer(this.spawner, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.spawner)

            // change state if empty
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                creep.memory['state'] = false;
        }
        else
        {
            // harvest at source
            if (creep.harvest(this.source) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.source)

            // change state if full
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                creep.memory['state'] = true;
        }
    }


    init(): void
    {
        this.source  = Game.getObjectById(this.memory.source);
        if (!this.memory.spawner)
            this.memory.spawner = this.source.room.find(FIND_MY_SPAWNS)[0].id;
        this.spawner = Game.getObjectById(this.memory.spawner);
        if (!this.memory.creepGoal)
            this.memory.creepGoal = freeSpots(this.source.pos);

        super.init();
    }


    run(): void
    {
        super.run();
    }
}