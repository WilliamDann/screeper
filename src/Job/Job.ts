export default abstract class Job
{
    creep   ?: string;
    assigner?: string;

    complete?: boolean;
    error   ?: string;

    next    ?: Job;

    abstract run();
}