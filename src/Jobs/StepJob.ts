import {Job, JobCode, JobData}  from "./Job"

export class StepJob implements Job
{
    jobCode : string;
    creep   : string;

    steps   : Job[];
    step    : number;

    assigner: string;

    constructor(jobs: Job[]|null=null, assigner?: string)
    {
        if (jobs)
            this.steps = jobs;
        else
            this.steps = [];
        this.step = 0;
        this.jobCode  = "StepJob";
        this.assigner = assigner; 
    }

    run()
    {
        if (this.step >= this.steps.length)
            return JobCode.FinishedOk;

        let job = this.steps[this.step];
        if (!job)
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
