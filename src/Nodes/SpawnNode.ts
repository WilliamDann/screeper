import LL   from "../Structures/LL";
import Node from "./Node";

export interface SpawnRequest
{
    requester   : string;
    body        : BodyPartConstant[];
    name        : string;
    opts       ?: SpawnOptions;
}

export default class SpawnNode implements Node
{
    spawner     : Id<StructureSpawn>;
    Q           : LL<SpawnRequest>;

    requests    : { [assigner: string] : number }

    constructor(spawner: Id<StructureSpawn>)
    {
        this.spawner = spawner;
        this.Q       = new LL<SpawnRequest>();

        this.requests = {};
    }

    creepCost(body: BodyPartConstant[])
    {
        let cost = 0;
        for (let part of body)
            cost += BODYPART_COST[part];
        return cost;
    }

    requestCreep(req: SpawnRequest): boolean
    {
        let spawner     = Game.getObjectById(this.spawner);
        let capacity    = spawner.room.energyCapacityAvailable;
        let cost        = this.creepCost(req.body);

        if (cost > capacity)
            return false;
        if (Game.creeps[req.name])
            return false;
        if (this.requests[req.requester] && this.requests[req.requester] != 0)
            return false;

        this.Q.add(req);

        return true;
    }

    tick()
    {
        let spawner = Game.getObjectById(this.spawner);
        let request = this.Q.peek();

        if (!request)
            return;

        let code = spawner.spawnCreep(request.body, request.name, request.opts);
        switch (code)
        {
            case OK:
                break;

            case ERR_NOT_OWNER:
            case ERR_NAME_EXISTS:
            case ERR_INVALID_ARGS:
            case ERR_RCL_NOT_ENOUGH:
                break;

            case ERR_NOT_ENOUGH_ENERGY:
            case ERR_BUSY:
                return;
        }

        this.Q.remove();
        this.requests[request.requester]--;
    }
}