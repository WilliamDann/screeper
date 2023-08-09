import Colony    from "./Colony";
import Processor from "./Processor";

export default class World
{
    colonies  : {string: Colony}; // all the colonies in the bot
    processor : Processor;        // handles commands and processes for the colony

    static _inst: World;        // singelton instance


    // inaccessable constructor
    private constructor()
    {
        this.colonies  = {} as any;
        this.processor = new Processor();
    }


    // get instance of the singelton class
    static getInstance()
    {
        if (!this._inst)
            this._inst = new World();
        return this._inst;
    }


    // screeps does not seem to always clear static members between ticks
    static clear()
    {
        this._inst = undefined;
    }
}