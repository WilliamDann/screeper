export default abstract class Job
{
    creep   ?: string;

    complete?: boolean;
    error   ?: string;

    next    ?: Job;

    waitTime : number;
    runTime  : number;

    constructor()
    {
        this.creep    = null;
        this.complete = false;

        this.waitTime   = 0;
        this.runTime    = 0;
    }

    abstract run();
}