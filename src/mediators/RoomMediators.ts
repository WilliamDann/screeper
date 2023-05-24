import RoomMediator from "./RoomMediator";

export default class RoomMediators
{
    private static instances : { [roomName: string]: RoomMediator };

    private constructor()
    {

    }

    static getInstance(roomName: string): RoomMediator
    {
        if (!RoomMediators.instances)
            RoomMediators.instances = {};

        if (!RoomMediators.instances[roomName])
            RoomMediators.instances[roomName] = new RoomMediator(roomName);
        return RoomMediators.instances[roomName];
    }

    static clearInstance(roomName: string)
    {
        delete RoomMediators.instances[roomName];
    }
}