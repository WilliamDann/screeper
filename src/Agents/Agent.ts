import { Pool }             from "../util/Pool"
import { Job }              from "../Jobs/Job";
import { AgentController }  from "../AgentController";

export class Agent
{
    jobPool     : Pool<Job>;
    creepPool   : Pool<string>;

    controller  : AgentController;

    depo       ?: string; // where creep gets energy from
    creepTarget : number;
    bodyTarget  : BodyPartConstant[];
    stage       : number; // progress of the agent

    constructor()
    {
        this.jobPool    = new Pool<Job>();
        this.creepPool  = new Pool<string>();

        this.creepTarget = 0;
        this.bodyTarget  = [WORK, CARRY, MOVE]; 
    }

    pre(): void 
    {
    }

    tick(): void {
        this.validateCreepPools();
        if (this.creepPool.count() < this.creepTarget)
            this.spawnCreep()

        for (let name of this.creepPool.free)
            if (!this.assignNextJob(name))
                break;

        for (let job of this.jobPool.used)
        {
            this.runJob(job);
            job.runTime = (job.runTime === undefined) ? 0 : job.runTime + 1
        }

        for (let job of this.jobPool.free)
            job.queueTime = (job.queueTime === undefined) ? 0 : job.queueTime + 1
    }

    post(): void 
    {
    }

    spawnCreep()
    {
        let name    = `${this.constructor.name}_${Game.time}`

        let spawner = this.controller.findAgentOfType("SpawnerAgent") as any;
        if (spawner.getRequestsFrom(this.constructor.name).length == 0)
            if (spawner.enqueue( {name: name, body: this.bodyTarget, requester: this.constructor.name}))
                this.creepPool.free.push(name);
    }

    validateCreepPools()
    {
        let spawner = this.controller.findAgentOfType("SpawnerAgent") as any;
        for (let i = 0; i < this.creepPool.free.length; i++)
        {
            let name  = this.creepPool.free[i]
            let creep = Game.creeps[name];
            if (!creep && !spawner.creepIsSpawning(name))
                delete this.creepPool.free[i];
        }
        this.creepPool.free = this.creepPool.free.filter(x => x != undefined);

        for (let i = 0; i < this.creepPool.used.length; i++)
        {
            let name  = this.creepPool.used[i]
            let creep = Game.creeps[name];
            if (!creep && !spawner.creepIsSpawning(name))
                delete this.creepPool.used[i];
        }
        this.creepPool.used = this.creepPool.used.filter(x => x != undefined);

    }

    assignNextJob(creep: string): boolean
    {
        let job = this.jobPool.free[0];
        if (job === undefined)
            return false;

        job.creep = creep;

        this.creepPool.setUsed(creep);
        this.jobPool.setUsed(job);

        return true;
    }

    getJobsAssignedBy(name: string): Job[]
    {
        return [
            ...this.jobPool.used.filter(x => x.assigner == name),
            ...this.jobPool.free.filter(x => x.assigner == name)
        ];
    }

    runJob(job: Job)
    {
        if (!job)
        {
            this.creepPool.setFree(job.creep);
            this.jobPool.remove(job);
            return;
        }

        let status = job.run();
        if (status >= 200)
        {
            this.creepPool.setFree(job.creep);
            this.jobPool.remove(job);
        }
    }

    log(msg: any)
    {
        console.log(`${this.constructor.name} @ ${Game.time}: ${msg}`);
    }
}