import Job  from "../Job/Job";
import Pool from "../Structures/Pool";

export default class Node
{
    jobs    : Pool<Job>;
    creeps  : Pool<string>;
    tag     : string;

    constructor(tag: string)
    {
        this.tag    = tag;
        this.creeps = new Pool<string>();
        this.jobs   = new Pool<Job>();
    }

    getJobsAssignedBy(tag: string)
    {
        return [
            ...this.jobs.free.filter(x => x.assigner == tag),
            ...this.jobs.used.filter(x => x.assigner == tag)
        ]
    }

    findJob(creep: string)
    {
        let job = this.jobs.free[0];
        if (!job)
            return;

        job.creep = creep;
        this.creeps.setUsed(creep);
        this.jobs.setUsed(job);
    }

    runJob(job: Job)
    {
        job.run();
        if (job.complete)
        {
            if (job.next)
            {
                job.next.creep = job.creep;
                this.jobs.used.push(job.next);
                this.jobs.remove(job);
                return;
            }
            this.jobs.remove(job);
            this.creeps.setFree(job.creep);
            return;
        }

        if (job.error)
        {
            this.log(`Job Error: ${job.error}`);
            this.jobs.setFree(job);
            return;
        }
    }

    tick()
    {
        for (let creep of [...this.creeps.used, ...this.creeps.free])
            if (!Game.creeps[creep])
                this.creeps.remove(creep);

        for (let name of this.creeps.free)
            this.findJob(name);
        for (let job of this.jobs.used)
            this.runJob(job);
    }

    log(message: any)
    {
        console.log(`${this.constructor.name}(${this.tag}) : ${message}`);
    }
}