import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { WithdrawJob } from "../Jobs/WithdrawJob";
import { Agent } from "./Agent";

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
        super(`SpawnerAgent_${spawner}`);

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

    trySpawnCreep()
    {
        if (this.creepPool.totalCreeps() < 3)
        {
            let name    = `${this.memSignature}_${Game.time}`
            let body    =  [WORK, CARRY, MOVE];

            if (this.getRequestsFrom(this.memSignature).length == 0)
                if (this.enqueue( {name: name, body: body, requester: this.memSignature} as SpawnRequest))
                    this.creepPool.creepsIdle.push(name);
        }
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

    pre()
    {
        if (!Memory[this.memSignature])
            this.post();

        this.queue   = Memory[this.memSignature].queue;
        this.spawner = Memory[this.memSignature].spawner;

        super.pre();
    }

    tick()
    {
        this.spawnerTick();

        if (this.creepPool.totalCreeps() < 1)
            this.trySpawnCreep();
        if (this.depo)
        {
            if (this.jobQueue.queue.length == 0)
            {
                // TODO fill extentions too
                this.jobQueue.enqueue(new StepJob([
                    new WithdrawJob(null, this.depo),
                    new TransferJob(null, this.spawner)   
                ]));
            }
        }

        super.tick();
    }

    post()
    {
        super.post();
        Memory[this.memSignature].queue  = this.queue;
        Memory[this.memSignature].spawner = this.spawner;
    }
}