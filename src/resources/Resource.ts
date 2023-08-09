import Process from "../processes/Process";

// a resource is an object or group of objects in the world the bot owns is aware of.
export default abstract class Resource
{
    room    : Room;
    pos     : RoomPosition;

    memory  : object;
    process : Process | undefined;
}