// A process is something that the bot *does*.
export default abstract class Process
{
    name   : string;            // name of the process
    ref    : string;            // unique identifier for the process
    pos    : RoomPosition;      // rough position the process takes place at
    room   : Room | undefined;  // the room the process takes place in, if applicable

    memory : object;            // things the process wants to remember, managed by the processor


    constructor(name: string, pos: RoomPosition)
    {
        this.name     = name;
        this.ref      = `${name}@${pos.x},${pos.y},${pos.roomName}`;
        this.pos      = pos;
        this.room     = Game.rooms[pos.roomName];
    }


    // initilizaiton logic
    abstract init(): void;


    // game tick logic
    abstract run(): void;
}