import { freeSpots } from "../../util";
import CreepProc     from "../CreepProc";

// harvests material from a sources and drops them
export default class ContainerHarvestProc extends CreepProc
{
    source    : Source;
    container : StructureContainer;

    memory : {
        source      : Id<Source>        // the source to mine from
        container   : Id<StructureContainer> // the link to use to transfer

        creeps      : string[]           // the creeps under the control of the proc
        creepGoal   : number             // the number of creeps to mine with
        bodyGoal    : BodyPartConstant[] // the creep body goal of the proc
    }

    // handle the behavior of a creep
    handleCreep(creep: Creep)
    {
        let isFull      = creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0;
        let dyingSoon   = creep.ticksToLive <= 10;

        let dropped = creep.pos.lookFor(LOOK_RESOURCES)
        if (dropped.length != 0)
            creep.pickup(dropped[0]);

        if ( isFull || dyingSoon )
        {
            if (creep.transfer(this.container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.container);
        }
        else 
        {
            if (creep.pos.getRangeTo(this.source) > 1)
                creep.moveTo(this.source);

            if (this.source.energy != 0)
                creep.harvest(this.source) == ERR_NOT_IN_RANGE;
        }
    }


    init(): void
    {
        this.source    = Game.getObjectById(this.memory.source);
        this.container = Game.getObjectById(this.memory.container);

        if (!this.memory.creepGoal)
            this.memory.creepGoal = freeSpots(this.source.pos);

        // find the container
        if (!this.memory.container)
            this.memory.container = this.source.pos.findInRange(FIND_STRUCTURES, 10, { filter: x => x.structureType == STRUCTURE_CONTAINER || x.structureType == STRUCTURE_STORAGE })[0].id as Id<StructureContainer>;

        // no link found
        if (!this.memory.container)
        {
            this.kill = true;
            console.error(`No container found within range of source ${this.memory.source}, killing`);
            return;
        }

        super.init();
    }


    run(): void
    {
        super.run();
    }
}