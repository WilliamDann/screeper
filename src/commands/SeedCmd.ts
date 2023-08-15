import Command          from "../framework/Command";
import SwarmSpawnerProc from "../processes/spawn/SwarmSpawnerProc";

// the seed command is the first command run in a room
export default class SeedCmd extends Command
{
    room  : Room;
    spawns: StructureSpawn[];

    constructor(flag: Flag)
    {
        super(flag);
    }


    init(): void
    {
        this.room   = this.flag.room;
        this.spawns = this.room.find(FIND_MY_SPAWNS);
    }


    run(): void
    {
        // create spawner proc
        this.createProcess(new SwarmSpawnerProc(this.room.name, { spawners: this.room.find(FIND_MY_SPAWNS).map(x => x.id) }));

        // remove the command
        this.remove();
    }
}