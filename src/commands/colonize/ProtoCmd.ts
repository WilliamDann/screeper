import Command          from "../../framework/Command";
import ProtoProc        from "../../processes/ProtoProc";
import FirstSpawnerProc from "../../processes/spawn/FirstSpawnerProc";

// the seed command is the first command run in a room
export default class ProtoCmd extends Command
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
        this.createProcess(new FirstSpawnerProc(this.room.name, { spawners: this.room.find(FIND_MY_SPAWNS).map(x => x.id) }));

        // create proto proc
        this.createProcess(new ProtoProc(this.room.name, { roomName: this.room.name, creepGoal: 20 }));

        // remove the command
        this.remove();
    }
}