import { HarvestJob } from "../Jobs/HarvestJob";
import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";
import { HarvestAgent } from "./HarvestAgent";

export interface SpawnRequest
{
    name        : string;
    body        : BodyPartConstant[],
    requester   : string
}

export class SpawnerAgent extends Agent
{
    queue   : SpawnRequest[]; // queue of spawn requests
    spawner : string;

    constructor(spawner: string)
    {
        super();

        this.queue      = [];
        this.spawner    = spawner;
    }

    creepIsSpawning(name: string): boolean
    {
        for (let req of this.queue)
            if (req.name == name)
                return true;
        return false;
    }

    getRequestsFrom(requester: string): SpawnRequest[]
    {
        let rqs = [];
        for (let rq of this.queue)
            if (rq.requester == requester)
                rqs.push(rq)
        return rqs;
    }

    // TODO include extentions
    getTotalEnergyCapacity(): number
    {
        let spawner = Game.getObjectById(this.spawner as any) as StructureSpawn;
        return spawner.store.getCapacity(RESOURCE_ENERGY);
    }

    getCreepCost(req: SpawnRequest): number
    {
        return req.body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
    }

    enqueue(req: SpawnRequest): boolean
    {
        let spawner = Game.getObjectById(this.spawner as any) as StructureSpawn;

        if (this.getCreepCost(req) > this.getTotalEnergyCapacity())
            return false;
        if (Game.creeps[req.name])
            return false;

        this.queue.push(req);
        return true;
    }

    spawnerTick()
    {
        let spawner = Game.getObjectById(this.spawner as any) as StructureSpawn;
        let req     = this.queue[0];

        if (!req)
            return;

        let res = spawner.spawnCreep(req.body, req.name);

        if (res != OK)
            return;

        console.log(`spawned ${req.name}`);
        this.queue.shift();
    }

    tick()
    {
        this.spawnerTick();

        let harvester = this.controller.findAgentOfType("HarvestAgent") as HarvestAgent;
        if (harvester.stage >= 2)
        {
            if (this.jobQueue.queue.length == 0)
                // TODO fill extentions too
                this.jobQueue.enqueue(new StepJob([
                    new WithdrawJob(null, this.depo),
                    new TransferJob(null, this.spawner)   
                ]));
        }
        else
            if (this.queue.length != 0 && this.jobQueue.getFromAssigned(this.constructor.name).length == 0)
                harvester.jobQueue.enqueue(new StepJob([
                    new HarvestJob(null, harvester.source),
                    new TransferJob(null, this.spawner)
                ], this.constructor.name));

        super.tick();
    }
}