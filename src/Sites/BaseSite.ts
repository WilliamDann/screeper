import { Site } from "./Site";
import Content  from "./Content";
import Handler from "../Events/Handler";

export default class BaseSite<T extends _HasId> implements Site
{
    focusId   : Id<T>;
    content   : Content;


    constructor(focus: Id<T>)
    {
        this.focusId = focus;
        this.content = new Content();

        // register flow control functions
        new Handler('init', this.init.bind(this)).register();
        new Handler('tick', this.tick.bind(this)).register();
    }


    // get the game Memory object for the focus
    //  creates one if none exists
    get memory(): Memory
    {
        // load memory
        if (!Memory[this.focusId])
            Memory[this.focusId] = {};
        return Memory[this.focusId];
    }


    // Get the game object associated with the focus
    get focus(): T
    {
        return Game.getObjectById(this.focusId);
    }


    // run on all sites before tick() is run
    init(): void 
    {
    }


    // run every game tick
    tick(): void
    {
        // load content from last tick
        if (this.memory['content'])
            this.content = this.memory['content'];


        // save content for next tick
        this.memory['content'] = this.content.content;
    }
}