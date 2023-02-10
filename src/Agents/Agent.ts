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

        this.creepPool.creepsWorking    = Memory[this.memSignature]['creepPool']['creepsWorking'];
        this.creepPool.creepsIdle       = Memory[this.memSignature]['creepPool']['creepsIdle'];

        this.jobQueue.running           = Memory[this.memSignature]['jobQueue']['running'];
        this.jobQueue.queue             = Memory[this.memSignature]['jobQueue']['queue'];

        this.depo                       = Memory[this.memSignature]['depo'];
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
        Memory[this.memSignature] = {
            'jobQueue'  : this.jobQueue,
            'creepPool' : this.creepPool,
            'depo'      : this.depo
        }
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

    loadJob(dataObj: JobData): (Job|null)
    {
        let jobClass = globalThis.jobs[dataObj.jobCode];
        if (!jobClass)
            return null;

        let obj = { run: jobClass.run };
        for (let name in dataObj)
            obj[name] = dataObj[name];

        return obj as Job;
    }

    runJob(job: JobData)
    {
        let loadedJob = this.loadJob(job);
        if (loadedJob == null)
        {
            this.creepPool.setCreepIdle(job.creep);
            this.jobQueue.dequeue(job.jobID, true);
            return;
        }

        let status = loadedJob.run();

        // copy state to stored job
        for (let name in job)
            job[name] = loadedJob[name];

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