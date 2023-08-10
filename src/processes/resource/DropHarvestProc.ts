import Comms from "../../Comms";
import Process from "../Process";
import { SpawnRequest } from "../spawn/BasicSpawnProc";

export default class DropHarvestProc extends Process
{
    RESCAN_CREEP_INTERVAL = 10;   // the rate that new creeps are checked for

    memory: {
        source      : Id<Source>, // the source targeted by the process
        harvesters  : number,     // the number of harvesters

        creeps      : Id<Creep>[],  // the creeps under control by the process
    }


    constructor(name: string, memory ?: object)
    {
        super(name, memory);
    }


    // update the creeps in the memory for the process
    updateCreeps()
    {
        this.memory.creeps = [];
        for (let name in Game.creeps)
        {
            const creep = Game.creeps[name];
            if (creep.memory['owner'] == this.ref)
                this.memory.creeps.push(creep.id);
        }
    }


    // run the behavior for creeps under the process
    runCreep(creep: Creep)
    {
        // harvest at the source and drop harvested energy
        const target = Game.getObjectById(this.memory.source);
        const result = creep.harvest(target);
        creep.drop(RESOURCE_ENERGY);

        // move to target if too far away
        if (result == ERR_NOT_IN_RANGE)
            creep.moveTo(target);

        // creep say error message
        if (result != OK && result != ERR_NOT_IN_RANGE)
            creep.say(result+'');
    }


    init(): void
    {
        // ensure critical memory exists
        if (!this.memory.source || !this.memory.harvesters)
        {
            this.kill = true;
            throw new Error("Invalid arguments, killing DropHarvestProc.");
        }

        // update the creeps in memory
        if (!this.memory.creeps || Game.time % this.RESCAN_CREEP_INTERVAL == 0)
            this.updateCreeps();
    }


    run(): void
    {
        if (!this.memory.creeps)
            this.memory.creeps = [];

        // run creeps under the proccess
        for (let creep of this.memory.creeps)
            this.runCreep(Game.getObjectById(creep));

        // emit a spawn request if missing a creeps
        if (this.memory.harvesters > this.memory.creeps.length)
            Comms.emit('spawnRequest', {
                name: ''+this.name+Game.time,
                body: [WORK, CARRY, MOVE],
                opts: { memory: { owner: this.ref } }
            } as SpawnRequest);
    }
}   