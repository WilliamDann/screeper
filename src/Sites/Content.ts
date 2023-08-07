import { map } from "lodash";

// Stores game content in categories
export default class Content
{
    // store objects by category
    content : { string: Id<_HasId>[] }


    constructor()
    {
        this.content = {} as any;
    }


    // Add content to the site
    addContent(category: string, id: Id<_HasId>)
    {
        if (!this.content[category])
        this.content[category] = [];
        this.content[category].push(id);
    }


    // get content from a category
    getContent(category: string): _HasId[]
    {
        return map(this.content[category], Game.getObjectById);
    }


    // get just the ids for content of a category
    getContentIds(category: string)
    {
        return this.content[category];
    }
}