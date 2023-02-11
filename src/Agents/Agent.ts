import { CreepPool } from "./CreepPool";
import { JobQueue } from "./JobQueue";
import { Job, JobData } from "../Jobs/Job";
import { Runnable } from "../Runnable";
import { AgentController } from "../AgentController";

export class Agent implements Runnable
{
    memSignature: string;

    jobQueue    : JobQueue;
    creepPool   : CreepPool;

    controller  : AgentController;

    depo       ?: string; // where creep gets energy from

    constructor(memSignature: string)
    {
        this.jobQueue   = new JobQueue();
        this.creepPool  = new CreepPool();

        this.memSignature = memSignature;
    }

    pre(): void {
        if (!Memory[this.memSignature])
            this.post();
    }

    tick(): void {
        this.validateCreepPools();

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

    post(): void {
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
        console.log(`${this.memSignature} @ ${Game.time}: ${msg}`);
    }
}