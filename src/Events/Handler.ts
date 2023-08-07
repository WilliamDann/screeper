import Core            from "../Core";

// Information about event handlers / shorthand for registering a handler
export default class Handler
{
    type    : string;
    handler : HandlerFunction;


    constructor(type: string, handler: HandlerFunction)
    {
        this.type    = type;
        this.handler = handler;
    }


    register()
    {
        Core.getInstance().eventSystem.register(this);
    }
}


// interface for functions that handle events
export interface HandlerFunction
{
    (...args): boolean;
}