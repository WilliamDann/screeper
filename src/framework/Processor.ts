import Command from "./Command";
import Process from "./Process";
import { processFactory } from "./_Init";

// stored information about a process
interface ProcessMemory
{
    procType : string;
    procName : string;
    memory   : object;
}

// runs commands and processes, as well as keeps track of their memory
export default class Processor
{
    private commands  : Command[];                     // stores ongoing Command object. Commands are instructions to the bot
    private processes : Process[];                     // stores ongoing Process objects Processes are things the bot does

    static _inst      : Processor;                     // singelton instance of the processor.

    memory: {                                                // storage object for bot memory
        processes : { [procRef   : string] : ProcessMemory } // stores process memory objects
    }


    // inaccessable constructor
    private constructor()
    {
        this.commands  = [];
        this.processes = [];

        // init processor memory
        if (!Memory['processor'])
            Memory['processor'] = { processes: {}, commands: {} };
        this.memory = Memory['processor'];
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
        this.commands.push(cmd);
    }


    // unregister a command
    unregisterCommand(cmd: Command): void
    {
        this.commands = this.commands.filter(x => x != cmd);
    }


    // add a process to the processor
    registerProcess(proc: Process): void
    {
        // load process memory if exists
        if (this.memory.processes[proc.ref])
            proc.memory = this.memory.processes[proc.ref].memory;

        proc.init();
        this.processes.push(proc);
    }


    // unregister a precess
    unregisterProcess(proc: Process): void
    {
        delete this.memory[proc.ref];
        delete Memory['processor']['processes'][proc.ref];
    }


    // start saved processes
    private restartProcesses()
    {
        for (let procRef in this.memory.processes)
        {
            let procMem = this.memory.processes[procRef];
            let proc    = processFactory(procMem.procType, procMem.procName, procMem.memory);

            this.processes.push(proc);
        }
    }


    init(): void
    { 
        // restart saved processes
        this.restartProcesses();

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
        }

        // run processes
        for (let process of this.processes)
        {
            // run process
            process.run();

            // do not save if the process is finished
            if (process.kill)
            {
                this.unregisterProcess(process);
                continue;
            }

            // save memory
            this.memory.processes[process.ref] = {
                procType: process.constructor.name,
                procName: process.name,
                memory  : process.memory
            };
        }

        // save processor memory
        Memory['processor'] = this.memory;
    }
}