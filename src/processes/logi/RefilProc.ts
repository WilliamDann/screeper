import Process from "../Process";

// refil containers in the room
export default class RefilProc extends Process
{
    memory: {
        roomName : string,
        targets  : Id<_HasId>[],

        creeps   : Id<Creep>[]
    }


    constructor(roomName: string, memory ?: object)
    {
        super(roomName, memory);
    }


    // find targets to refil
    findTargets()
    {
        this.memory.targets = Game.rooms[this.memory.roomName]
            .find(FIND_STRUCTURES, { filter: x => x['store']!! })
            .map(x => x.id);
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

        if (!this.memory.creeps)
            this.updateCreeps();
    }


    run(): void {
        if (!this.memory.creeps)
            this.memory.creeps = [];

        for (let creep of this.memory.creeps)
            this.runCreep(Game.getObjectById(creep));
    }
}