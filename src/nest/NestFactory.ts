import Nest from "./Nest";

export default class NestFactory
{
    static instances: { string: Nest }

    private constructor()
    {

    }

    static getInstance(roomName: string): Nest
    {
        if (!NestFactory.instances)
            NestFactory.instances = {} as any;

        if (!NestFactory.instances[roomName])
            NestFactory.instances[roomName] = new Nest(Game.rooms[roomName]);
        return NestFactory.instances[roomName];
    }
}