import Command from "./commands/Command";
import Process from "./processes/Process";

// runs commands and processes, as well as keeps track of their memory
export default class Processor
{
    private commands  : Command[];                     // stores ongoing Command object. Commands are instructions to the bot
    private processes : Process[];                     // stores ongoing Process objects Processes are things the bot does

    static _inst      : Processor;                     // singelton instance of the processor.


    memory: {                                          // storage object for bot memory
        commands  : { [commandName: string] : object } // stores command memory objects
        processes : { [procName: string]    : object } // stores process memory objects
    }


    // inaccessable constructor
    private constructor()
    {
        this.commands  = [];
        this.processes = [];
    }


    // singelton instance
    static getInstance()
    {
        if (!this._inst)
            this._inst = new Processor();
        return this._inst;
    }


    // static members are not always cleared
    static clear()
    {
        this._inst = undefined;
    }


    // add a command to the processor
    registerCommand(cmd: Command): void
    {
        // load command memory if exists
        if (this.memory.commands[cmd.ref])
            cmd.memory = this.memory.commands[cmd.ref];

        this.commands.push(cmd);

    }


    // add a process to the processor
    registerProcess(proc: Process): void
    {
        // load process memory if exists
        if (this.memory.processes[proc.ref])
            proc.memory = this.memory.processes[proc.ref];

        this.processes.push(proc);
    }


    init(): void
    {
        // init processor memory
        if (!Memory['processor'])
            Memory['processor'] = { processes: {}, commands: {} };
        this.memory = Memory['processor'];

        // call init funcs
        for (let command of this.commands)
            command.init();
        for (let process of this.processes)
            process.init();
    }


    run(): void
    {
        // run commands
        for (let command of this.commands)
        {
            // run command
            command.run();

            // save memory
            this.memory.commands[command.ref] = command.memory;
        }

        // run processes
        for (let process of this.processes)
        {
            // run process
            process.run();

            // save memory
            this.memory.processes[process.ref] = process.memory;
        }

        // save processor memory
        Memory['processor'] = this.memory;
    }
}