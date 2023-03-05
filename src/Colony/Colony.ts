import Job from "../Jobs/Job";
import LL  from "../Structures/LL";

export default class Colony
{
    room    : string;

    creeps  : string[];
    jobQ    : LL<Job>;

    constructor(room: string)
    {
        this.room   = room;
        this.creeps = [];
        this.jobQ   = new LL();
    }

    getCreeps(): Creep[]
    {
        return this.creeps.map(name => Game.creeps[name])
    }

    getIdleCreeps(): Creep[]
    {
        return this.getCreeps().filter(x => !x.memory['tasks'])
    }

    getWorkingCreeps(): Creep[]
    {
        return this.getCreeps().filter(x => x.memory['tasks'] != undefined)
    }

    assignJob(creep: Creep, job: Job)
    {
        creep.memory['tasks'] = job.tasks;
    }

    assignJobs()
    {
        for (let creep of this.getIdleCreeps())
            if (this.jobQ.length > 0)
                this.assignJob(creep, this.jobQ.remove());
    }

    runTask(creep: Creep)
    {
        let tasks = creep.memory['tasks'];
        if (!tasks)
            return;
        if (tasks.length == 0)
        {
            delete creep.memory['tasks'];
            return;
        }

        tasks[0].run(creep.name);

        if (tasks[0].error != undefined)
        {
            console.log(`  ! ERR ${creep.name} doing ${tasks[0].constructor.name} : ${tasks[0].error} \n Data: ${JSON.stringify(tasks[0])}`);
            creep.say(`! ERR`, false);
            creep.memory['tasks'].shift();
        }
        if (tasks[0].complete)
        {
            creep.memory['tasks'].shift();
        }
        if (tasks.length == 0)
        {
            delete creep.memory['tasks'];
            return;
        }
    }

    runTasks()
    {
        this.getWorkingCreeps().map(creep => this.runTask(creep));
    }

    tick()
    {
        this.runTasks();
    }
}