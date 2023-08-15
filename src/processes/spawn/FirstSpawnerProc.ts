import Comms            from "../../framework/Comms";
import Process          from "../../framework/Process";
import { SpawnRequest } from "../../interface/SpawnRequest";

// process for spawning creeps based on who asks first
export default class FirstSpawnerProc extends Process
{
    busy  : { string : boolean }   // if a spawner has already promised to spawn this tick, it will be marked as true here
    memory: {
        spawners : Id<StructureSpawn>[]             // the spawners known to the spawner proc
    }


    constructor(name: string, memory: object)
    {
        super(name, memory);
        this.busy = {} as any;
    }


    // handle an incoming spawn request
    handleSpawnRequest(req: SpawnRequest)
    {
        for (let spawn of this.memory.spawners)
        {
            // skip spawns already spawning
            if (this.busy[spawn])
                continue;

            // try to spawn
            if (Game.getObjectById(spawn).spawnCreep(req.body, req.name, req.opts) == OK)
            {
                // mark the spawn as busy so it must spawn this creep
                this.busy[spawn] = true;

                // add creep name to requester's creep list
                req.requester.memory['creeps'].push(req.name);

                // consume the request
                return true;
            }
        }
    }


    // setup event listners
    init(): void
    {
        Comms.register('spawnRequest', this.handleSpawnRequest.bind(this));
    }


    // wait for incoming requests
    run(): void
    {

    }
}