export default interface Task
{
    complete : boolean;
    error    : string;
    run(creepName: string);
}