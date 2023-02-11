export interface JobData
{
    // job info
    jobID?          : string;
    jobCode         : string;
    creep           : string;
    assigner?       : string;

    // stats
    queueTime?      : number; // time until task was started in game ticks
    runTime?        : number; // time until task was running in game ticks
}
export interface Job extends JobData
{
    run() : JobCode;
}

export enum JobCode {
    // RUNNING CODES
    Running         = 100,

    // FINISHED CODES
    FinishedOk      = 200,
    FinishedError   = 201,

    // ERR CODES
    InvalidJob      = 300,
}
