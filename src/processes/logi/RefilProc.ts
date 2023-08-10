import Process from "../Process";

// refil containers in the room
export default class RefilProc extends Process
{
    memory: {
        roomName : string,
        targets  : Id<_HasId>[],
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


    init(): void {
        if (!this.memory.roomName)
            this.memory.roomName = this.name;

        if (!this.memory.targets)
            this.memory.targets = [];
    }


    run(): void {
        // console.log(JSON.stringify(this.memory.targets));
    }
}