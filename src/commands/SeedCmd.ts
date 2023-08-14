import Command          from "../framework/Command";
import FirstSpawnerProc from "../processes/FirstSpawnerProc";
import ProtoHarvestProc from "../processes/harvest/ProtoHarvestProc";
import { freeSpots } from "../util";


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
        this.createProcess(new FirstSpawnerProc(
            this.room.name, 
            {
                spawners    : this.spawns.map(x => x.id),
            }
        ));

        // create a proto harvester for the spawner
        let source = this.room.find(FIND_SOURCES).sort(x => this.spawns[0].pos.getRangeTo(x))[0];
        this.createProcess(new ProtoHarvestProc(
            this.room.name,
            {
                source     : source.id,
                spawner    : this.spawns[0].id,
                harvesters : freeSpots(source.pos)
            }
        ))

        this.remove();
    }
}