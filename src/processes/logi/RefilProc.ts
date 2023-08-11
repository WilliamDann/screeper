import Comms from "../../Comms";
import Process from "../Process";

// refil containers in the room
export default class RefilProc extends Process
{
    memory: {
        roomName  : string,
        targets   : Id<_HasId>[],

        creeps    : Id<Creep>[],
        refillers : number
    }


    constructor(roomName: string, memory ?: object)
    {
        super(roomName, memory);
    }


    // update creeps under the processes control
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


    // run a creep under the processes control
    runCreep(creep: Creep)
    {
        creep.say('filler');
    }


    init(): void {
        if (!this.memory.roomName)
            this.memory.roomName = this.name;

        if (!this.memory.targets)
            this.memory.targets = [];

        if (!this.memory.creeps || Game.time % 10 == 0)
            this.updateCreeps();

        this.memory.refillers = Math.min(this.memory.targets.length, 3);
    }


    run(): void {
        if (!this.memory.creeps)
            this.memory.creeps = [];

        // run creep funcs
        for (let creep of this.memory.creeps)
            this.runCreep(Game.getObjectById(creep));

        // spawn creeps if needed
        if (this.memory.creeps.length < this.memory.refillers)
            Comms.emit('spawnRequest', {
                name: this.ref+Game.time,
                body: [WORK, CARRY, MOVE],
                opts: { memory: { owner: this.ref }}
            });
    }
}