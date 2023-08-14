import Comms from "../../framework/Comms";
import Process from "../../framework/Process";
import { SpawnRequest } from "../../interface/SpawnRequest";

// harvests material from a sources and drops them
export default class DropHarvestProc extends Process
{
    memory: {
        source      : Id<Source>    // the source to mine from

        creeps      : string[]      // the creeps under the control of the proc
        harvesters  : number        // the number of creeps to mine with
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
        if (!this.memory.creeps)
            this.memory.creeps = [];
    }


    run(): void
    {
        // remove dead creeps
        this.memory.creeps = this.memory.creeps.filter(x => Game.creeps[x] != undefined);

        // run creeps
        for (let name of this.memory.creeps)
            this.handleCreep(Game.creeps[name]);

        // try to spawn
        if (this.memory.creeps.length < this.memory.harvesters)
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