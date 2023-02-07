import { Agent } from "./Agent";

export interface SpawnRequest
{
    name: string;
    body: BodyPartConstant[],
}

export class SpawnerAgent implements Agent
{
    queue   : SpawnRequest[]; // queue of spawn requests
    spawner : string;

    constructor(spawner: string)
    {
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
        if (!Memory['SpawnAgent'])
            this.post();

        this.queue   = Memory['SpawnAgent'].queue;
        this.spawner = Memory['SpawnAgent'].spawner;
    }

    tick()
    {
        let spawner = Game.getObjectById(this.spawner as any) as StructureSpawn;
        let req     = this.queue[0];

        if (!req)
            return;

        let res = spawner.spawnCreep(req.body, req.name);

        if (res != OK)
            return console.log(res);

        console.log(`spawned ${req.name}`);
        this.queue.shift();
    }

    post()
    {
        Memory['SpawnAgent'] = {
            queue: this.queue,
            spawner: this.spawner
        }
    }

    // TODO ?
    poll()
    {
        return [];
    }
}