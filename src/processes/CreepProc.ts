import Comms            from "../framework/Comms";
import Process          from "../framework/Process";
import { SpawnRequest } from "../interface/SpawnRequest";
import { timerStart, timerStop } from "../util";

// base class for a process that handles creeps
export default abstract class CreepProc extends Process
{
    memory: {
        creepGoal : number             // the total creeps the proc wants
        creeps   ?: string[]           // the creeps under the control of the proc
        bodyGoal ?: BodyPartConstant[] // the goal creep body of the proc
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
        if (!this.memory.bodyGoal)
            this.memory.bodyGoal = [WORK, CARRY, MOVE, MOVE];
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
                body      : this.memory.bodyGoal,
                opts      : { },
                requester : this
            } as SpawnRequest
        );
    }
}