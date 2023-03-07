import Job          from "../Job/Job";
import Pool         from "../Structures/Pool";
import Request      from "../Requests/Request";

export default class Node
{
    tag         : string;
    creepPool   : Pool<string>;
    runningJobs : Job[];

    constructor(tag: string)
    {
        this.tag         = tag;
        this.creepPool   = new Pool<string>();
        this.runningJobs = [];
    }

    get rank() { return 0; }

    searchForNode(className: string, rank ?: (node: Node) => number): Node
    {
        let max  = -Infinity;
        let best = null; 
        for (let node of globalThis.graph.bfs(this.tag))
        {
            if (node.constructor.name != className)
                continue;

            let score = 0;
            if (rank)
                score = rank(node);
            else
                score = node.rank;

            if (score > max)
            {
                max = score;
                best = node;
            }
        }

        return best;
    }

    isValidRequest(request: Request): boolean
    {
        return true;
    }

    fufilSpawnRequest(request: Request)
    {
        delete request.spawnCreeps;
    }

    fufilCreepRequest(request: Request)
    {
        if (request.creeps.length == 0)
            delete request.creeps;

        for (let creep of request.creeps)
            if (this.creepPool.free.indexOf(creep))
            {
                let to = graph.verts[request.to];
                to.creepPool.add(creep);
                this.creepPool.remove(creep);

                request.creeps.splice(request.creeps.indexOf(creep), 1);
            }

        return true;
    }

    fufilWorkRequest(request: Request)
    {
        if (request.work.length == 0)
            delete request.work;

        for (let job of request.work)
            if (this.creepPool.free.length != 0)
            {
                let creep = this.creepPool.free[0];
                job.creep = creep;
                this.runningJobs.push(job);
                this.creepPool.setUsed(creep);
                request.work.splice(request.work.indexOf(job), 1);
            }
    }

    fufil(request: Request)
    {
        if (request.spawnCreeps)
            this.fufilSpawnRequest(request);
        if (request.creeps)
            this.fufilCreepRequest(request);
        if (request.work)
            this.fufilWorkRequest(request);

        if (!request.spawnCreeps && !request.creeps && !request.work)
            globalThis.requests.removeFrom(this.tag, request);
    }

    runJob(job: Job)
    {
        job.run();

        if (job.error)
        {
            this.log(job.error);
            this.runningJobs.splice(this.runningJobs.indexOf(job), 1);
            this.creepPool.setFree(job.creep);
        }

        if (job.complete)
        {
            if (job.next)
            {
                job.next.creep = job.creep;
                this.runningJobs.push(job.next);
                this.runningJobs.splice(this.runningJobs.indexOf(job), 1);
                return;
            }
            this.runningJobs.splice(this.runningJobs.indexOf(job), 1);
            this.creepPool.setFree(job.creep);
            return;
        }
    }

    tick()
    {
        for (let request of globalThis.requests.requests[this.tag])
            this.fufil(request);
        for (let job of this.runningJobs)
            this.runJob(job);
    }


    log(message: any)
    {
        console.log(`${this.constructor.name}(${this.tag}) : ${message}`);
    }
}