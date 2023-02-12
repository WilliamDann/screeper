import { CreepPool } from "./CreepPool";
import { JobQueue } from "./JobQueue";
import { Job, JobData } from "../Jobs/Job";
import { Runnable } from "../Runnable";
import { AgentController } from "../AgentController";

export class Agent implements Runnable
{
    jobQueue    : JobQueue;
    creepPool   : CreepPool;

    controller  : AgentController;

    depo       ?: string; // where creep gets energy from
    creepTarget : number;
    stage       : number; // progress of the agent

    constructor()
    {
        this.jobQueue   = new JobQueue();
        this.creepPool  = new CreepPool();

        this.creepTarget = 0;
    }

    pre(): void 
    {
    }

    tick(): void {
        this.validateCreepPools();
        if (this.creepPool.totalCreeps() < this.creepTarget)
            this.spawnCreep()

        for (let name of this.creepPool.creepsIdle)
            if (!this.assignNextJob(name))
                break;

        for (let job of this.jobQueue.running)
        {
            this.runJob(job);
            job.runTime = (job.runTime === undefined) ? 0 : job.runTime + 1
        }

        for (let job of this.jobQueue.queue)
            job.queueTime = (job.queueTime === undefined) ? 0 : job.queueTime + 1
    }

    post(): void 
    {
    }

    spawnCreep()
    {
        let name    = `${this.constructor.name}_${Game.time}`
        let body    =  [WORK, CARRY, MOVE];

        let spawner = this.controller.findAgentOfType("SpawnerAgent") as any;
        if (spawner.getRequestsFrom(this.constructor.name).length == 0)
            if (spawner.enqueue( {name: name, body: body, requester: this.constructor.name}))
                this.creepPool.creepsIdle.push(name);
    }

    validateCreepPools()
    {
        let spawner = this.controller.findAgentOfType("SpawnerAgent") as any;
        for (let i = 0; i < this.creepPool.creepsIdle.length; i++)
        {
            let name  = this.creepPool.creepsIdle[i]
            let creep = Game.creeps[name];
            if (!creep && !spawner.creepIsSpawning(name))
                delete this.creepPool.creepsIdle[i];
        }
        this.creepPool.creepsIdle = this.creepPool.creepsIdle.filter(x => x != undefined);

        for (let i = 0; i < this.creepPool.creepsIdle.length; i++)
        {
            let name  = this.creepPool.creepsIdle[i]
            let creep = Game.creeps[name];
            if (!creep && !spawner.creepIsSpawning(name))
                delete this.creepPool.creepsIdle[i];
        }
        this.creepPool.creepsIdle = this.creepPool.creepsIdle.filter(x => x != undefined);

    }

    assignNextJob(creep: string): boolean
    {
        let job = this.jobQueue.queue.shift();
        if (job === undefined)
            return false;

        job.creep = creep;

        this.creepPool.setCreepWorking(creep);
        this.jobQueue.running.push(job);

        return true;
    }

    runJob(job: Job)
    {
        if (!job)
        {
            this.creepPool.setCreepIdle(job.creep);
            this.jobQueue.dequeue(job.jobID, true);
            return;
        }

        let status = job.run();
        if (status >= 200)
        {
            this.creepPool.setCreepIdle(job.creep);
            this.jobQueue.dequeue(job.jobID, true);
        }
    }

    log(msg: any)
    {
        console.log(`${this.constructor.name} @ ${Game.time}: ${msg}`);
    }
}