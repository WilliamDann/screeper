import Values       from "../../Core/Values";
import { LogLevel } from "./LogLevel";

// Log a message with a given log level
export function log(level: LogLevel, message: any)
{
    if (Values.getInstance().logLevel < level)
        return;
    console.log(`${LogLevel[level]}@${Game.time}: ${message}`);
}


// convience functions
export function error(message: any)
{
    log(LogLevel.Error, message);
}


export function warning(message: any)
{
    log(LogLevel.Warning, message);
}


export function info(message: any)
{
    log(LogLevel.Info, message);
}


export function debug(message: any)
{
    log(LogLevel.Debug, message)
}