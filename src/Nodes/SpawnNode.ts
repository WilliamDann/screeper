import CollectJob from "../Job/CollectJob";
import TransferJob from "../Job/TransferJob";
import Graph from "../Structures/Graph";
import HarvestNode from "./HarvestNode";
import Node from "./Node";

export interface SpawnRequest
{
    requester   : string;
    body        : BodyPartConstant[];
    name        : string;
    opts       ?: SpawnOptions;
}

export default class SpawnNode extends Node
{
    Q           : SpawnRequest[];
    requests    : { [assigner: string] : number }

    constructor(spawner: Id<StructureSpawn>)
    {
        super(spawner);
        this.Q        = [];
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
        let spawner     = Game.getObjectById(this.tag as Id<StructureSpawn>);
        let capacity    = spawner.room.energyCapacityAvailable;
        let cost        = this.creepCost(req.body);

        if (cost > capacity)
            return false;
        if (Game.creeps[req.name])
            return false;
        if (this.requests[req.requester] && this.requests[req.requester] != 0)
            return false;

        this.Q.push(req);
        if (!this.requests[req.requester])
            this.requests[req.requester] = 1
        else
            this.requests[req.requester]++;

        return true;
    }

    spawnerTick(graph: Graph<Node>, spawner: StructureSpawn)
   {
        let request = this.Q[0];

        if (!request)
            return;

        let code = spawner.spawnCreep(request.body, request.name, request.opts);
        switch (code)
        {
            case OK:
                graph.verts[request.requester].creepPool.free.push(request.name);
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

        this.Q.shift();
        this.requests[request.requester]--;
   }

   findBiggestHarvester(): HarvestNode
   {
        let graph   = globalThis.graph as Graph<Node>;

        let best     = -Infinity;
        let bestNode = null;
        for (let node of graph.bfs(this.tag))
            if (node.constructor.name == "HarvestNode")
                if (node.creepPool.count() > best)
                {
                    best     = node.creepPool.count();
                    bestNode = node;
                }

        return bestNode;
   }

   askHarvesterForEnergy()
   {
        let node = this.findBiggestHarvester();
        if (node.getJobsAssignedBy(this.tag).length == 0)
        {
            let drop = Game.getObjectById(node.drop);
            if (drop && drop.store)
            {
                let job     = new CollectJob(this.tag, drop.id);
                job.next    = new TransferJob(this.tag, this.tag as Id<StructureSpawn>);
                node.jobPool.add(job);
            }
            else
            {
                let job     = new CollectJob(this.tag, node.tag as Id<Source>);
                job.next    = new TransferJob(this.tag, this.tag as Id<StructureSpawn>);
                node.jobPool.add(job);
            }
        }
   }

    tick()
    {
        let graph   = globalThis.graph as Graph<Node>;
        let spawner = Game.getObjectById(this.tag as Id<StructureSpawn>);

        this.spawnerTick(graph, spawner);

        if (spawner.store.getFreeCapacity(RESOURCE_ENERGY) != 0 && this.creepPool.count() == 0)
            this.askHarvesterForEnergy();

        super.tick();
    }
}