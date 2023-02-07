import { Agent } from "./Agent";

export interface SpawnRequest
{
    name: string;
    body: BodyPartConstant[],
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
        let spawner = Game.getObjectById(this.spawner as any) as StructureSpawn;
        let req     = this.queue[0];

        if (!req)
            return;

        let res = spawner.spawnCreep(req.body, req.name);

        if (res != OK)
            return;

        console.log(`spawned ${req.name}`);
        this.queue.shift();

        super.tick();
    }

    post()
    {
        super.post();
        Memory[this.memSignature].queue  = this.queue;
        Memory[this.memSignature].spawner = this.spawner;
    }
}