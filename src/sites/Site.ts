import Colony  from "../Colony";
import Process from "../processes/Process";

// a Site is a collection of game objects related to a given purpose
export default abstract class Site
{
    colony  : Colony;
    room    : Room;
    pos     : RoomPosition;
    memory  : object;
    process : Process


    constructor(colony: Colony, obj: RoomObject)
    {
        this.colony = colony;
        this.room   = obj.room;
        this.pos    = obj.pos;
        this.memory = {};
    }


    // init logic
    abstract init(): void;


    // run logic
    abstract run(): void;
}