import { Job, JobData }      from "./Job";

export class JobRunner
{
    running         : JobData[]; // TODO linked list instead of []
    queue           : JobData[]; // TODO linked list instead of []

    creepsWorking   : string[];
    creepsIdle      : string[];

    constructor()
    {
        this.running = [];
        this.queue   = [];

        this.creepsIdle     = [];
        this.creepsWorking  = [];
    }

    //#region funcs
    setup()
    {
        if (!Memory['JobRunner'])
            this.teardown();

        this.running        = Memory['JobRunner'].running;
        this.queue          = Memory['JobRunner'].queue;

        this.creepsWorking  = Memory['JobRunner'].creepsWorking as any;
        this.creepsIdle     = Memory['JobRunner'].creepsIdle as any;
    }

    tick()
    {
        this.pollCreeps(); // TODO not every tick

        for (let name of this.creepsIdle)
            if (!this.assignNextJob(name))
                break;

        for (let job of this.running)
        {
            this.runJob(job);
            job.runTime = (job.runTime === undefined) ? 0 : job.runTime + 1
        }

        for (let job of this.queue)
            job.queueTime = (job.queueTime === undefined) ? 0 : job.queueTime + 1
    }

    teardown()
    {
        Memory['JobRunner'] = {
            running         : this.running,
            queue           : this.queue,
            creepsWorking   : this.creepsWorking,
            creepsIdle      : this.creepsIdle,
        };
    }
    //#endregion

    //#region helpers

    loadJob(dataObj: JobData): (Job|null)
    {
        let jobClass = globalThis.jobs[dataObj.jobCode];
        if (!jobClass)
            return null;
    
        let obj = { run: jobClass.run } as Job;
        for (let name in dataObj)
            obj[name] = dataObj[name];

        return obj as Job;
    }

    creepIsPolled(name: string): boolean
    {
        return this.creepsWorking.indexOf(name) != -1 || this.creepsIdle.indexOf(name) != -1;
    }

    pollCreeps()
    {
        for (let name in Game.creeps)
            if (!this.creepIsPolled(name))
                this.creepsIdle.push(name);
    }

    setCreepIdle(name: string, idle: boolean=true)
    {
        if (idle)
        {
            this.creepsWorking = this.creepsWorking.filter(x => x != name);
            this.creepsIdle.push(name);
        }
        else
        {
            this.creepsIdle = this.creepsIdle.filter(x => x != name);
            this.creepsWorking.push(name);
        }
    }

    setCreepWorking(name: string, working: boolean=true)
    {
        this.setCreepIdle(name, !working);
    }

    assignNextJob(creep: string): boolean
    {
        let job = this.queue.shift();
        if (job === undefined)
            return false;

        job.creep = creep;

        this.running.push(job);
        this.setCreepWorking(creep);
        return true;
    }

    runJob(job: JobData)
    {
        let loadedJob = this.loadJob(job);
        if (loadedJob == null)
        {
            this.setCreepIdle(job.creep);
            this.running.splice(this.running.indexOf(job), 1);
            return;
        }

        let status = loadedJob.run();
        
        // copy state to stored job
        for (let name in job)
            job[name] = loadedJob[name];

        if (status >= 200)
        {
            this.setCreepIdle(job.creep);
            this.running.splice(this.running.indexOf(job), 1)
        }
    }
    //#endregion
}