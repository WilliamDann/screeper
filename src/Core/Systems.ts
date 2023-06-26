import EventSystem from "../Systems/Event/EventSystem";
import SiteSystem from "../Systems/Site/SiteSystem";

export default class Systems
{
    // tracks game events
    eventSystem    : EventSystem;

    // tracks game sites
    siteSystem     : SiteSystem;

    // singleton class instance
    static instance: Systems;


    private constructor()
    {
        this.eventSystem = new EventSystem();
        this.siteSystem  = new SiteSystem();
    }


    // get or create instance of singleton
    static getInstance()
    {
        if (!this.instance)
            this.clear();
        return this.instance;
    }


    // reset systems
    static clear()
    {
        this.instance = new Systems();
    }
}