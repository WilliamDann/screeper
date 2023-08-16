import Comms from "../framework/Comms";
import Process from "../framework/Process";
import { SpawnRequest } from "../interface/SpawnRequest";

// base class for a process that handles creeps
export default abstract class CreepProc extends Process
{
    memory: {
        creeps    : string[]        // the creeps under the control of the proc
        creepGoal : number          // the total creeps the proc wants
    }


    constructor(name: string, memory ?: object)
    {
        super(name, memory);
    }


    // handle the behavior for creeps
    abstract handleCreep(creep: Creep): void;


    // call handler function for creeps
    handleCreeps()
    {
        // call handler function
        for (let creep of this.memory.creeps)
            this.handleCreep(Game.creeps[creep]);
    }


    init(): void {
        if (!this.memory.creeps)
            this.memory.creeps = [];
    }


    run(): void {
        // remove dead creeps from list
        this.memory.creeps = this.memory.creeps.filter(x => Game.creeps[x] != undefined);

        // call creep handler funcs
        this.handleCreeps();

        // try to spawn a creep
        if (this.memory.creeps.length < this.memory.creepGoal)
        Comms.emit(
            'spawnRequest',
            {
                name      : `${this.ref}_${Game.time}`,
                body      : [ WORK, CARRY, MOVE, MOVE ],
                opts      : { },
                requester : this
            } as SpawnRequest
        );
    }
}