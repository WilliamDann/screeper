import SpawnSite, { SpawnRequest } from "./SpawnSite";


// Spawn the first request that hits the spawner
//  Note FIFO implies that there is storage of requests, this is not true. The first request wins, otherwise it is not consumed.
export default class FIFOSpawn extends SpawnSite
{
    // true if already spawning on this tick
    spawning: boolean;


    constructor(spawner: Id<StructureSpawn>)
    {
        super(spawner);
        this.spawning = false;
    }


    // spawn the first valid request that comes in
    handleSpawnRequest(request: SpawnRequest): boolean {
        // If we've already acccepted a request, do not accept another
        if (this.spawning)
            return false;

        // if spawn request is valid, consume and set spawning true to stop more requests
        if (this.focus.spawnCreep(request.body, `${Game.time+request.for}`, { memory: { for: request.for } }) == OK)
        {
            this.spawning = true;
            return true;
        }

        // invalid request, do not consume
        return false;
    }
}