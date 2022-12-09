import {Job, JobCode, JobData}  from "./Job"

export class StepJob implements Job
{
    jobCode : string;
    creep   : string;

    steps   : JobData[];
    step    : number;

    constructor(jobs: Job[]|null=null)
    {
        if (jobs)
            this.steps = jobs;
        else
            this.steps = [];
        this.step = 0;
        this.jobCode = "StepJob";
    }

    run()
    {
        function loadJob(dataObj: JobData): (Job|null)
        {
            let jobClass = globalThis.jobs[dataObj.jobCode];
            if (!jobClass)
                return null;

            let obj = { run: jobClass.run } as Job;
            for (let name in dataObj)
                obj[name] = dataObj[name];

            return obj as Job;
        }

        if (this.step >= this.steps.length)
            return JobCode.FinishedOk;

        let job = loadJob(this.steps[this.step]);
        if (job == null)
            return JobCode.InvalidJob;
        job.creep = this.creep;
        
        let code = job.run();
        if (code > 199 && code < 300) // 200 OK
            this.step++;
        if (code > 299) // 300 error
        return JobCode.FinishedError;
        
        if (this.step >= this.steps.length)
            return JobCode.FinishedOk;
        return JobCode.Running;
    }
}
