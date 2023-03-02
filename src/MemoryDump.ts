export class MemoryDump
{
    defs    : {} // {protoName: class prototype}

    constructor(defs: {})
    {
        this.defs = defs
        this.defs['Object'] = Object.prototype;
    }

    isArray(obj: any): boolean
    {
        return obj.constructor && obj.constructor.name == 'Array';
    }

    isObject(obj: any): boolean
    {
        return typeof obj == 'object' && !this.isArray(obj)
    }

    isLoop(obj: any, seen: any[])
    {
        for (let val of seen)
            if (obj == val)
                return true;
        return false;
    }

    arrDump(obj: any[], seen: any[]): any
    {
        let data = [];
        for (let item of obj)
            data.push(this.dump(item, seen))
        return data
    }

    objDump(obj: object, seen: any[]): any
    {
        let data = { };
        if (this.isLoop(obj, seen))
            return undefined;
        if (obj.constructor)
            data['proto'] = obj.constructor.name;

        seen.push(obj);

        for (let key of Object.keys(obj))
            data[key] = this.dump(obj[key], seen);

        return data;
    }

    arrLoad(obj: any[]): any
    {
        let data = [];
        for (let item of obj)
            data.push(this.load(item))
        return data
    }

    objLoad(obj: any): any
    {
        let data
        if (obj.constructor)
            if (this.defs[obj.proto])
                data = new this.defs[obj.proto].constructor()
            else
                throw new Error(`Unknown Constructor: ${obj.proto}`)
        else
            data = {};

        for (let key of Object.keys(obj))
            data[key] = this.load(obj[key]);

        return data;
    }

    dump(obj: any, seen: any[]=null): any
    {
        if (!seen)
            seen = [];
        if (obj == undefined)
            return undefined;
        else if (this.isArray(obj))
            return this.arrDump(obj, seen);
        else if (this.isObject(obj))
            return this.objDump(obj, seen);
        else
            return obj;
    }

    load(obj: any): any
    {
        if (obj == undefined)
            return undefined;
        else if (this.isArray(obj))
            return this.arrLoad(obj);
        else if (this.isObject(obj))
            return this.objLoad(obj);
        else
            return obj;
    }
}