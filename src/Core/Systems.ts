import EventSystem from "../Systems/Event/EventSystem";

export default class Systems
{
    // tracks game events
    eventSystem    : EventSystem;

    // singeltion class instance
    static instance: Systems;


    private constructor()
    {
        this.eventSystem = new EventSystem();
    }


    // get or create instnace of singelton
    static getInstance()
    {
        if (!this.instance)
            this.instance = new Systems();
        return this.instance;
    }
}