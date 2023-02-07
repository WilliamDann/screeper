import { Job, JobData } from './Jobs/Job';
import { Runnable }     from "./Runnable";

export class JobQueue
{
    running         : JobData[]; // TODO linked list instead of []
    queue           : JobData[]; // TODO linked list instead of []

    constructor()
    {
        this.running = [];
        this.queue   = [];
    }

    enqueue(job: JobData): string
    {
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

    get(id: string): JobData
    {
        for (let job of this.queue)
            if (job.jobID == id)
                return job;

        for (let job of this.queue)
            if (job.jobID == id)
                return job;

        return null;
    }
}