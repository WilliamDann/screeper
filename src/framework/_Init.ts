import Command from "./Command";
import Process from "./Process";

// stores initilization values
export default class _Init
{
    static commands = {};  // command table
    static procs    = {};  // process tabke
}


// add a command type
export function addCommand(colorA: ColorConstant, colorB: ColorConstant, command: any): void
{
    if (!_Init.commands[colorA])
        _Init.commands[colorA] = {};
    _Init.commands[colorA][colorB] = command;
}


// add a process type
export function addProcess(procName: string, proc: any)
{
    _Init.procs[procName] = proc;
}

// export tables & factories
export const COMMAND_TABLE = _Init.commands;
export const PROCESS_TABLE = _Init.procs;


// create Command objects from their flag
export function commandFactory(flag: Flag): Command
{
    if (!COMMAND_TABLE[flag.color] || !COMMAND_TABLE[flag.color][flag.secondaryColor])
    {
        flag.remove();
        throw new Error(`Flag color ${flag.color},${flag.secondaryColor} is not registered to a command.`);
    }
    return new COMMAND_TABLE[flag.color][flag.secondaryColor](flag);
}


// create Process objects from their process type
export function processFactory(procType: string, procName: string, memory ?: object): Process
{
    if (!PROCESS_TABLE[procType])
        throw new Error(`Invalid process type: ${procType}`);

    return new PROCESS_TABLE[procType](procName, memory);
}