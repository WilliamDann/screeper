import EventSystem from "./Events/EventSystem";
import SiteSystem from "./Sites/SiteSystem";

// Store the core systems of the game in a singelton class
export default class Core
{
    // event system for the bot
    eventSystem: EventSystem;

    // site system to keep tracks of sites
    siteSystem: SiteSystem;

    // singelton instance
    static _inst: Core;


    // singelton constructor
    private constructor()
    {
        this.eventSystem = new EventSystem();
        this.siteSystem  = new SiteSystem();
    }


    // get the instance of the class
    public static getInstance()
    {
        if (!this._inst)
            this._inst = new Core();
        return this._inst;
    }


    // sometimes Screeps does not clear static members of a class
    public static clearInstance()
    {
        this._inst = undefined;
    }
}
