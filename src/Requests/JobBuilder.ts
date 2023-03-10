import Job from "../Job/Job";

export class JobBuilder
{
    root: Job;
    constructor()
    {
        this.root = null;
    }

    *iter()
    {
        let cur = this.root;
        while(cur != null)
        {
            yield cur
            cur = cur.next;
        }
    }

    add(job: Job)
    {
        if (!this.root)
        {
            this.root = job
            return this;
        }

        let cur = this.root;
        while(cur.next != null)
            cur = cur.next;
        cur.next = job;

        return this;
    }
}