import Job      from "../Job/Job";
import Graph    from "../Structures/Graph";
import Pool     from "../Structures/Pool";

export default class Node
{
    tag    : string;

    creepPool : Pool<string>;
    jobPool   : Pool<Job>;

    constructor(tag: string)
    {
        this.tag       = tag;

        this.creepPool = new Pool<string>();
        this.jobPool   = new Pool<Job>();
    }

    findNodeOfType(className): Node
    {
        let graph = globalThis.graph as Graph<Node>;
        for (let node of graph.bfs(this.tag))
            if (node.constructor.name == className)
                return node;
    }

    searchForNode(className: string, rank: (node: Node) => number): Node
    {
        let graph = globalThis.graph as Graph<Node>;

        let bestScore = -Infinity;
        let bestNode  = null;
        for (let node of graph.bfs(this.tag))
            if (node.constructor.name == className)
            {
                let score = rank(node);
                if (score > bestScore)
                {
                    bestScore = score;
                    bestNode  = node;
                }
            }

        return bestNode;
    }

    getJobsAssignedBy(assigner: string)
    {
        let jobs = [];
        for (let job of [...this.jobPool.free, ...this.jobPool.used])
            if (job.assigner == assigner)
                jobs.push(job);
        return jobs;
    }

    assignJob(job: Job, creep: string)
    {
        job.creep = creep;
        this.creepPool.setUsed(creep);
        this.jobPool.setUsed(job);
    }

    validateCreepPool()
    {
        for (let creep of [...this.creepPool.free, ...this.creepPool.used])
            if (!Game.creeps[creep])
                this.creepPool.remove(creep);
    }

    assignJobs()
    {
        for (let name of this.creepPool.free)
            if (this.jobPool.free[0])
                this.assignJob(this.jobPool.free[0], name);
    }

    runJob(job: Job)
    {
        job.run();

        if (job.error)
        {
            this.log(job.error);
            this.jobPool.remove(job);
            this.creepPool.setFree(job.creep);
            return;
        }

        if (job.complete)
        {
            if (job.next)
            {
                job.next.creep = job.creep;
                this.jobPool.remove(job);
                this.jobPool.used.push(job.next);
                return;
            }
            this.jobPool.remove(job);
            this.creepPool.setFree(job.creep);
            return;
        }
    }

    runJobs()
    {
        for (let job of this.jobPool.used)
            this.runJob(job);
    }

    updateJobTimers()
    {
        for (let job of this.jobPool.used)
            job.runTime++;
        for (let job of this.jobPool.free)
            job.waitTime++;
    }

    tick()
    {
        this.validateCreepPool();
        this.assignJobs();
        this.runJobs();
        this.updateJobTimers();
    }

    log(message: any)
    {
        console.log(`${this.constructor.name}(${this.tag}) : ${message}`);
    }
}