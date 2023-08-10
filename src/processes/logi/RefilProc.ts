import Process from "../Process";

// refil containers in the room
export default class RefilProc extends Process
{
    memory: {
        roomName : string,
        targets  : Id<_HasId>[],
    }

    constructor(roomName: string)
    {
        super(roomName, { roomName: roomName });
    }


    // find targets to refil
    findTargets()
    {
        this.memory.targets = Game.rooms[this.memory.roomName]
            .find(FIND_STRUCTURES, { filter: x => x['store']!! })
            .map(x => x.id);
    }


    init(): void {
        
    }


    run(): void {
        
    }
}