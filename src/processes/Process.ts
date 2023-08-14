// A process is something that the bot *does*.
export default abstract class Process
{
    // process information
    name   : string;                // a name for the process
    ref    : string;                // unique memory identifier for the process
    memory : object;                // the state of the process between ticks (managed by the Processor)

    // process controls
    kill    = false;                   // if the process should be removed from the processor


    constructor(name: string, memory ?: object)
    {
        this.name   = name;
        this.ref    = `${this.constructor.name}_${this.name}`;
        this.memory = memory || {};
    }


    // initilizaiton logic
    abstract init(): void;


    // game tick logic
    abstract run(): void;
}