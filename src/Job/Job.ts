export default abstract class Job
{
    assigner : string;

    creep   ?: string;

    complete?: boolean;
    error   ?: string;

    next    ?: Job;

    waitTime : number;
    runTime  : number;

    constructor(assigner: string)
    {
        this.creep    = null;
        this.complete = false;

        this.waitTime   = 0;
        this.runTime    = 0;

        this.assigner = assigner;
    }

    abstract run();
}