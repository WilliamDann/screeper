export interface ProcessInit
{
    room   : Room | undefined;
    pos    : RoomPosition;

    memory : object;
}

// A process is something that the bot *does*.
export default abstract class Process
{
    protected procInit : ProcessInit;

    name: string;
    pos : RoomPosition;


    constructor(procInit: ProcessInit, name: string)
    {
        this.procInit = procInit;
        this.name     = name;
        this.pos      = procInit.pos;
    }


    // initilizaiton logic
    abstract init(): void;


    // game tick logic
    abstract run(): void;
}