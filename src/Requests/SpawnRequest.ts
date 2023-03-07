export default interface SpawnRequest
{
    body        : BodyPartConstant[];
    name        : string;
    opts       ?: SpawnOptions;
}

export class SpawnRequestBuilder
{
    value: SpawnRequest;
    constructor() {
        this.value = { body: [], name: null }
    }

    part(part: BodyPartConstant)
    {
        this.value.body.push(part);
        return this;
    }

    body(body: BodyPartConstant[])
    {
        this.value.body = [...this.value.body, ...body];
        return this;
    }

    name(name: string)
    {
        this.value.name = name;
        return this;
    }

    opts(param : SpawnOptions)
    {
        Object.assign(this.value.opts, param);
        return this;
    }

    get()
    {
        return this.value;
    }
}