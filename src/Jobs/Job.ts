export interface Job
{
    // job info
    jobID?          : string;
    jobCode         : string;
    creep           : string;
    assigner?       : string;

    role?           : boolean;

    // stats
    queueTime?      : number; // time until task was started in game ticks
    runTime?        : number; // time until task was running in game ticks

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
