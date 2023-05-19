export default class Site
{
    // the strucutres owned by the site
    contents : Map<string, Id<_HasId>[]>;

    constructor()
    {
        this.contents = new Map();
    }

    addContent(identifier: string, value: Id<_HasId>)
    {
        let existing = this.contents.get(identifier);
        if (!existing)
            existing = [];

        existing.push(value);
        this.contents.set(identifier, existing);
    }

    getContent<T extends _HasId>(identifier: string): T[]
    {
        let arr = [];
        for (let id of this.contents.get(identifier))
            arr.push(Game.getObjectById(id));
        return arr;
    }

    containsWithIdentifier(identifier: string, value: Id<_HasId>): boolean
    {
        let bucket = this.contents.get(identifier);
        if (!bucket)
            return false;
        return bucket.indexOf(value) != -1;
    }

    containsId(value: Id<_HasId>)
    {
        for (let val of this.contents.values())
            for (let id in val)
                if (id == value)
                    return true;
        return false;
    }

    contains(value: Id<_HasId>, identifier?: string): boolean
    {
        if (identifier)
            return this.containsWithIdentifier(identifier, value);
        return this.containsId(value);
    }

    // called every tick
    tick()
    {

    }
}