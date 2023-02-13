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

    getTotalEnergyCapacity(): number
    {
        let spawner = Game.getObjectById(this.spawner as any) as StructureSpawn;
        return spawner.room.energyCapacityAvailable;
    }

    getCreepCost(req: SpawnRequest): number
    {
        return req.body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
    }

    enqueue(req: SpawnRequest): boolean
    {
        this.log(this.getCreepCost(req))
        this.log(this.getTotalEnergyCapacity())

        if (this.getCreepCost(req) > this.getTotalEnergyCapacity())
            return false;
        if (Game.creeps[req.name])
            return false;

        this.queue.push(req);
        return true;
    }

    private spawnerTick()
    {
        let spawner = Game.getObjectById(this.spawner as any) as StructureSpawn;
        let req     = this.queue[0];

        if (!req)
            return;

        let res = spawner.spawnCreep(req.body, req.name);

        if (res != OK && res != -4 && res != -6)
        {
            this.queue.shift();
            console.log(`failed to spawn ${req.name}: ${res}`);
            return;
        }

        console.log(`spawned ${req.name}`);
        this.queue.shift();
    }

    private energyTick()
    {
        const makeWithdrawJob = (depo, spawner) => new StepJob([ new WithdrawJob(null, depo), new TransferJob(null, spawner) ], this.constructor.name);
        const makeHarvestJob  = (src, spawner)  => new StepJob([ new HarvestJob(null, src),   new TransferJob(null, spawner) ], this.constructor.name);

        let spawner = Game.getObjectById(this.spawner as any) as Structure;

        let harvester  = this.controller.findAgentOfType("HarvestAgent") as HarvestAgent;
        let extensions = spawner.room.find(FIND_STRUCTURES, {filter: x => x.structureType == STRUCTURE_EXTENSION && x.store.getFreeCapacity(RESOURCE_ENERGY) != 0})

        if (this.stage >= 1)
        {
            if (this.jobQueue.queue.length == 0)
            {
                this.jobQueue.enqueue(makeWithdrawJob(this.depo, this.spawner), -1);
                for (let extension of extensions)
                    this.jobQueue.enqueue(makeWithdrawJob(this.depo, extension.id), -1);
            }
        }
        else
            if (this.queue.length != 0 && this.jobQueue.getFromAssigned(this.constructor.name).length == 0)
                harvester.jobQueue.enqueue(makeHarvestJob(harvester.source, this.spawner), 1);
    }

    tick()
    {
        this.spawnerTick();
        this.energyTick();

        super.tick();
    }
}