import Process from "../framework/Process";

// handle logistics for a room
export default class LogiProc extends Process
{
    memory: {
        roomName    : string;                   // the name of the room to run logistics in

        drops       : Id<Resource>[]            // dropped sources of energy
        containers  : Id<StructureContainer>[]  // stored sources of energy
    };

    constructor(name: string, memory ?: object)
    {
        super(name, memory);
    }


    init(): void
    {
        // refresh our memroy of the sources
        if (!this.memory.drops || !this.memory.containers || Game.time % 10 == 0)
        {
            let room = Game.rooms[this.memory.roomName];

            this.memory.drops      = room.find(FIND_DROPPED_RESOURCES)
                .map(x => x.id);
            this.memory.containers = room.find(FIND_STRUCTURES)
                .filter(x => x['store'] != undefined)
                .map(x => x.id) as Id<StructureContainer>[];
        }
    }


    run(): void
    {

    }
}