import Command from "./commands/Command";
import Process from "./processes/Process";

export default class Processor
{
    private commands  : Command[];
    private processes : Process[];


    constructor()
    {
        this.commands  = [];
        this.processes = [];
    }


    // add a command to the processor
    registerCommand(cmd: Command): void
    {
        this.commands.push(cmd);
    }


    // add a process to the processor
    registerProcess(proc: Process): void
    {
        this.processes.push(proc);
    }


    // init processes
    init(): void
    {
        for (let command of this.commands)
            command.init();
        for (let process of this.processes)
            process.init();
    }


    // run processes
    run(): void
    {
        for (let command of this.commands)
            command.run();
        for (let process of this.processes)
            process.run();
    }
}