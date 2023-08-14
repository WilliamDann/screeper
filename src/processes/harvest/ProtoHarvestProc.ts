import Comms            from "../../framework/Comms";
import Process          from "../../framework/Process";
import Processor        from "../../framework/Processor";
import { SpawnRequest } from "../../interface/SpawnRequest";
import DropHarvestProc  from "./DropHarvestProc";

// harvests material from a sources and drops them
export default class ProtoHarvestProc extends Process
{
    source : Source;            // source to draw from
    spawner: StructureSpawn;    // spawn to deposit in

    memory: {
        source      : Id<Source>            // the source to mine from
        spawner     : Id<StructureSpawn>    // the spawn to fill

        creeps      : string[]              // the creeps under the control of the proc
        harvesters  : number                // the number of creeps to mine with
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


    // upgrade to a drop harvester
    upgradeProc()
    {
        Processor.getInstance().registerProcess(new DropHarvestProc(this.name, this.memory));
        this.kill = true;
    }


    init(): void
    {
        if (!this.memory.creeps)
            this.memory.creeps = [];

        this.source  = Game.getObjectById(this.memory.source);
        this.spawner = Game.getObjectById(this.memory.spawner);
    }


    run(): void
    {
        // upgrade to a drop harvester if possible
        if (this.memory.creeps.length >= this.memory.harvesters)
        {
            this.upgradeProc();
            return;
        }


        // remove dead creeps
        this.memory.creeps = this.memory.creeps.filter(x => Game.creeps[x] != undefined);


        // run creeps
        for (let name of this.memory.creeps)
            this.handleCreep(Game.creeps[name]);


        // try to spawn a creep
        if (this.memory.creeps.length < this.memory.harvesters && Game.time % 100 == 0)
            Comms.emit(
                'spawnRequest',
                {
                    name      : `${this.ref}_${Game.time}`,
                    body      : [ WORK, CARRY, MOVE ],
                    opts      : { },
                    requester : this
                } as SpawnRequest
            );
    }
}