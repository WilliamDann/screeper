import Comms   from "../../Comms";
import Process from "../Process";

// basic spawn request object
export interface SpawnRequest
{
    name: string,
    body: BodyPartConstant[],
    opts: SpawnOptions
}

// basic spawn request handler. will spawn first request that is sent in
export default class BasicSpawnProc extends Process
{
    memory : {
        roomName   : string;                   // the name of the room
        spawners   : Id<StructureSpawn>[];     // the spawners in the room
    }

    constructor(name: string, memory ?: object)
    {
        super(name, memory);
    }


    // check the room for spawners
    getSpawners()
    {
        this.memory.spawners = Game.rooms[this.memory.roomName].find(FIND_MY_SPAWNS).map(x => x.id);
    }


    // handle an incoming spawn request
    handleSpawnRequest(req: SpawnRequest)
    {
        for (let id of this.memory.spawners)
        {
            const spawner = Game.getObjectById(id) as StructureSpawn;

            // skip if spawner is in use
            if (spawner.spawning)
                continue;

            // if we can spawn here, do it.
            if (spawner.spawnCreep(req.body, req.name, req.opts) == OK)
                return;
        }
    }


    init(): void
    {
        // ensure we've got a room
        if (!this.memory.roomName)
        {
            this.kill = true;
            throw new Error("no roomName provided, killing process");
        }

        // find the spawns in the room
        if (!this.memory.spawners)
            this.getSpawners();

        // register spawn request event handler
        Comms.register('spawnRequest', this.handleSpawnRequest);
    }


    run(): void
    {

    }
}