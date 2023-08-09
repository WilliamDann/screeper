// A process is something that the bot *does*.
export default abstract class Process
{
    name   : string;
    ref    : string;
    memory : object;

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