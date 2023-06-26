import { LogLevel } from "../LogLevel";

export default class Values
{
    // singleton instance
    static instance: Values;

    // if the bot is in debug mode
    //  this effects logging
    logLevel: LogLevel;


    // Values stores global values
    private constructor()
    {
        this.logLevel = LogLevel.None;
    }


    // get singleton instance
    static getInstance()
    {
        if (!this.instance)
            this.instance = new Values();
        return this.instance;
    }

    static clear()
    {
        this.instance = undefined;
    }
}