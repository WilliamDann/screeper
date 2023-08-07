import Event                        from "./Event";
import Handler, { HandlerFunction } from "./Handler";

// Handle the flow of messages (events) between sites in the game world.
export default class EventSystem
{
    // stores handlers for given event types
    private listeners : { string : HandlerFunction[]  };


    constructor()
    {
        this.listeners = {} as any;
    }


    // emit an event to it's listerners
    emit(event: Event)
    {
        // log event
        console.log(`event emitted: ${event.toString()}`);

        // Find a handler to handle the event
        for (let listner of this.listeners[event.type])
            if (listner(event.data))
                break;
    }


    // register a listner for events
    register(handler: Handler)
    {
        if (!this.listeners[handler.type])
            this.listeners[handler.type] = [];

        this.listeners[handler.type].push(handler.handler);
    }
}