import { filter } from "lodash";

export default class Resources
{
    // Actual storage object
    data: [string: Id<_HasId>];


    // Stores game object ids with a string key
    // for example you might keep track of 
    //  'creep'->Id<Creep>[] or
    //  'source'->Id<Source>[]
    constructor()
    {
        this.data = {} as any;
    }


    // Add a resource to a given key
    add(key: string, obj: Id<_HasId>)
    {
        if (!this.data[key])
            this.data[key] = [];
        this.data[key].push(obj);
    }


    // Get the game objects in a given key
    get(key: string): _HasId[]
    {
        if (!this.data[key])
            return [];

        return this.data[key].map(Game.getObjectById);
    }


    // Get just the ids of the objects in a given key
    getIds(key: string): Id<_HasId>[]
    {
        return this.data[key];
    }


    // Remove an Id from a given key
    remove(key: string, obj: Id<_HasId>)
    {
        this.data[key] = filter(this.data[key], x => x != obj);
    }
}