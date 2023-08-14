import Comms            from "../framework/Comms";
import Process          from "../framework/Process";
import { SpawnRequest } from "../interface/SpawnRequest";

// process for spawning creeps based on who asks first
export default class FirstSpawnerProc extends Process
{
    memory: {
        spawners : Id<StructureSpawn>[] // the spawners known to the spawner proc
    }

    constructor(name: string, memory: object)
    {
        super(name, memory);
    }


    handleSpawnRequest(req: SpawnRequest)
    {
        console.log(JSON.stringify(req));
    }


    init(): void
    {
        // listen for spawn requests
        Comms.register('spawnRequest', this.handleSpawnRequest.bind(this));
    }


    run(): void
    {

    }
}