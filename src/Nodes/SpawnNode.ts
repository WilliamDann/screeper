import TransferJob from "../Job/TransferJob";
import Node        from "./Node";
import Request, { RequestBuilder }     from "../Requests/Request";
import { RequestPriority } from "../Requests/RequestPriority";

export default class SpawnNode extends Node
{
    constructor(spawner: Id<StructureSpawn>)
    {
        super(spawner);
    }

    creepCost(body: BodyPartConstant[])
    {
        let cost = 0;
        for (let part of body)
            cost += BODYPART_COST[part];
        return cost;
    }

    isValidRequest(request: Request): boolean
    {
        if (request.creeps || request.work)
            return false;

        let spawner  = Game.getObjectById(this.tag as Id<StructureSpawn>);
        let capacity = spawner.room.energyCapacityAvailable;
        for (let creep of request.spawnCreeps)
            if (this.creepCost(creep.body) > capacity)
                return false;

        return true;
    }

    fufilSpawnRequest(request: Request)
    {
        let spawner = Game.getObjectById(this.tag as Id<StructureSpawn>);

        if (request.spawnCreeps.length == 0)
            delete request.spawnCreeps;

        for (let creep of request.spawnCreeps)
        {
            let code = spawner.spawnCreep(creep.body, creep.name, creep.opts);
            switch (code)
            {
                case OK:
                    graph.verts[request.from].creepPool.free.push(creep.name);
                    request.spawnCreeps.splice(request.spawnCreeps.indexOf(creep), 1);
                    break;

                case ERR_NOT_OWNER:
                case ERR_NAME_EXISTS:
                case ERR_INVALID_ARGS:
                case ERR_RCL_NOT_ENOUGH:
                    request.spawnCreeps.splice(request.spawnCreeps.indexOf(creep), 1);
                    break;

                case ERR_NOT_ENOUGH_ENERGY:
                    break;
                case ERR_BUSY:
                    break;
            }
        }

        if (request.creeps.length == 0)
            globalThis.requests.removeFrom(this.tag, request);
    }

    tick()
    {
        super.tick();

        let spawn = Game.getObjectById(this.tag as Id<StructureSpawn>);
        if (spawn.store.energy != spawn.store.getCapacity(RESOURCE_ENERGY))
            new RequestBuilder()
                .from(this.tag)
                .priority(RequestPriority.High)
                .work(new TransferJob(this.tag as Id<StructureSpawn>))
                .addTo(this.searchForNode("HarvestNode").tag);
    }
}