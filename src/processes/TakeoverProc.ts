import Comms            from "../framework/Comms";
import Process          from "../framework/Process"
import { SpawnRequest } from "../interface/SpawnRequest";


// takes control of an existing room
export default class TakeoverProc extends Process
{
    memory: {
        creeps: string[];
    }

    constructor(name, memory)
    {
        super(name, memory);
    }

    handleSpawnRequest(request: SpawnRequest)
    {
        if (this.memory.creeps.length == 0)
            return false;
        request.requester.memory['creeps'].push(this.memory.creeps.shift());
        return true;
    }

    init(): void {
        // intercept spawn requests with old creeps
        Comms.register('spawnRequest', this.handleSpawnRequest.bind(this));

        // clear creep memory
        for (let creep in this.memory.creeps)
            Game.creeps[creep].memory = {};
    }

    run(): void {
        if (this.memory.creeps.length == 0)
        {
            this.kill = true;
            Comms.unregister('spawnRequest', this.handleSpawnRequest.bind(this));
        }
    }
}