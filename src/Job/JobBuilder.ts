import Job from "./Job";

export default class JobBuilder
{
    job: Job;

    constructor()
    {
        this.job = null;
    }

    *iter()
    {
        let node = this.job;
        while(node)
        {
            yield node;
            node = node.next;
        }
    }

    assigner(name: string)
    {
        for (let node of this.iter())
            node.assigner = name;
        return this;
    }

    creep(name: string)
    {
        for (let node of this.iter())
            node.creep = name;
        return this;
    }

    add(job: Job)
    {
        if (!this.job)
            this.job = job;
        else
            this.job.next = job;
        return this;
    }

    build()
    {
        return this.job;
    }
}