import { CreepPool } from "../CreepPool";
import { JobQueue } from "../JobQueue";
import { Runnable } from "../Runnable";

export class Agent implements Runnable
{
    memSignature: string;

    jobQueue    : JobQueue;
    creepPool   : CreepPool;

    constructor(memSignature: string)
    {
        this.jobQueue   = new JobQueue();
        this.creepPool  = new CreepPool();

        this.memSignature = memSignature;
    }

    updateCreepPool()
    {
        this.creepsIdle     = []
        this.creepsWorking  = []

        for (let job of this.running)
            if (Game.creeps[job.creep])
                this.creepsWorking.push(job.creep);

        for (let name in Game.creeps)
            if (!this.creepIsPolled(name))
                this.creepsIdle.push(name);
    }

    pre(): void {
        if (!Memory[this.memSignature])
            this.post();

        this.creepPool.creepsWorking    = Memory[this.memSignature]['creepPool']['creepsWorking'];
        this.creepPool.creepsIdle       = Memory[this.memSignature]['creepPool']['creepsIdle'];

        this.jobQueue.running           = Memory[this.memSignature]['jobQueue']['running'];
        this.jobQueue.queue             = Memory[this.memSignature]['jobQueue']['queue'];
    }

    tick(): void {
        this.updateCreepPool();

    }

    post(): void {
        Memory[this.memSignature] = {
            'jobQueue'  : this.jobQueue,
            'creepPool' : this.creepPool
        }
    }
}