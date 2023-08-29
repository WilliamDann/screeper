import { freeSpots } from "../../util";
import CreepProc     from "../CreepProc";

// harvests material from a sources and drops them
export default class LinkHarvestProc extends CreepProc
{
    source : Source;
    link   : StructureLink;
    memory : {
        source      : Id<Source>        // the source to mine from
        link        : Id<StructureLink> // the link to use to transfer

        creeps      : string[]           // the creeps under the control of the proc
        creepGoal   : number             // the number of creeps to mine with
        bodyGoal    : BodyPartConstant[] // the creep body goal of the proc
    }

    // handle the behavior of a creep
    handleCreep(creep: Creep)
    {
        let linkTransferSoon    = this.link.cooldown <= 1;
        let hasEnergyToTransfer = creep.store.energy != 0;
        let isFull              = creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0;

        let dropped = creep.pos.lookFor(LOOK_RESOURCES)
        if (dropped.length != 0)
            creep.pickup(dropped[0]);

        if ( isFull || (linkTransferSoon && hasEnergyToTransfer) || creep.ticksToLive <= 10 )
        {
            if (creep.transfer(this.link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.link);
        }
        else if (this.source.energy != 0)
        {
            if (creep.harvest(this.source) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.source);
        }
    }


    init(): void
    {
        this.source = Game.getObjectById(this.memory.source);
        this.link   = Game.getObjectById(this.memory.link);

        if (!this.memory.creepGoal)
            this.memory.creepGoal = freeSpots(this.source.pos);

        // find the link
        if (!this.memory.link)
            this.memory.link = this.source.room
                .lookForAtArea(
                    LOOK_STRUCTURES,
                    this.source.pos.y-2,
                    this.source.pos.x-2,
                    this.source.pos.y+2,
                    this.source.pos.x+2,
                true)
                .filter(x => x.structure.structureType == STRUCTURE_LINK)
                [0].structure.id as Id<StructureLink>;

        // no link found
        if (!this.memory.link)
        {
            this.kill = true;
            console.error(`No link found within range of source ${this.memory.source}, killing`);
            return;
        }

        super.init();
    }


    run(): void
    {
        super.run();
    }
}