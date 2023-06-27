import Systems      from "../../Core/Systems";
import SpawnRequest from "../Events/SpawnRequestEvent";
import BaseSite     from "./BaseSite";

export default class SpawnSite extends BaseSite<StructureSpawn>
{
    // if we're currently blocked by a request we consumed
    private spawning = false;


    constructor(focus: Id<StructureSpawn>)
    {
        super(focus);
    }


    onCreate(): boolean {
        Systems.getInstance().eventSystem.register('SpawnRequest', this.onSpawnRequest.bind(this));

        return super.onCreate();
    }


    // handles a spawn request event
    onSpawnRequest(request: SpawnRequest): boolean
    {
        // if we've already consumed an event, return
        if (this.spawning)
            return false;

        // set 'owner' in memory, so the creep can be given to it's spawner
        if (!request.opts.memory)
            request.opts.memory = {};
        request.opts.memory['owner'] = request.owner;

        // tell the game to spawn the creep
        let spawn = Game.getObjectById(this.focus);
        let result = spawn.spawnCreep(request.body, request.name, request.opts);

        // The game will take the last spawn request, so we block ourselves when we consume a request
        if (result == OK)
            return this.spawning = true;

        return false;
    }


    onDestroy(): boolean {
        // don't store the spawning state
        this.spawning = undefined;

        return super.onDestroy();
    }
}