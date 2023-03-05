import Task from "../Tasks/Task";

export default interface Job
{
    complete    : boolean;
    error       : string;
    tasks       : Task[];
    run();
}