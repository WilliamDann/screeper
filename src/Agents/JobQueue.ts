import { Job } from '../Jobs/Job';

export class JobQueue
{
    running         : Job[]; // TODO linked list instead of []
    queue           : Job[]; // TODO linked list instead of []

    constructor()
    {
        this.running = [];
        this.queue   = [];
    }

    makeId(n=15): string
    {
        let result     = '';
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < n; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length));
        return result;
    }

    enqueue(job: Job, limit=1): string
    {
        if (limit > 0 && this.getFromAssigned(job.assigner).length >= limit)
            return null;

        let id = this.makeId(15);

        job.jobID = id;
        this.queue.push(job);

        return id;
    }

    dequeue(id: string, stopRunning=false): void
    {
        this.queue = this.queue.filter(x => x.jobID != id);
        if (stopRunning)
            this.running = this.running.filter(x => x.jobID != id);
    }

    get(id: string): Job
    {
        for (let job of this.queue)
            if (job.jobID == id)
                return job;

        for (let job of this.queue)
            if (job.jobID == id)
                return job;

        return null;
    }

    getFromAssigned(assigner: string): Job[]
    {
        let jobs = [];
        for (let job of this.queue)
            if (job.assigner == assigner)
                jobs.push(job)
        for (let job of this.running)
            if (job.assigner == assigner)
                jobs.push(job)
        return jobs;
    }
}