import Job                  from "../Job/Job";
import Request              from "./Request";
import { RequestPriority }  from "./RequestPriority";
import SpawnRequest         from "./SpawnRequest";

export default class RequestBuilder
{
    value: Request
    constructor()
    {
        this.value = {} as Request;
    }

    from(val: string): RequestBuilder
    {
        this.value.from = val;
        return this;
    }

    to(val: string): RequestBuilder
    {
        this.value.to = val;
        return this;
    }

    time(val: number): RequestBuilder
    {
        this.value.time = val;
        return this;
    }

    priority(val: RequestPriority): RequestBuilder
    {
        this.value.priority = val;
        return this;
    }

    limit(n: number): RequestBuilder
    {
        this.value.limit = n;
        return this;
    }

    spawnCreep(req: SpawnRequest, n=1): RequestBuilder
    {
        if (!this.value.spawnCreeps)
            this.value.spawnCreeps = []

        for (let i = 0; i < n; i++)
            this.value.spawnCreeps.push(req);

        return this;
    }

    creep(req: string, n=1): RequestBuilder
    {
        if (!this.value.creeps)
            this.value.creeps = []

        for (let i = 0; i < n; i++)
            this.value.creeps.push(req);

        return this;
    }

    work(req: Job, n=1): RequestBuilder
    {
        if (!this.value.work)
            this.value.work = []

        for (let i = 0; i < n; i++)
            this.value.work.push(req);

        return this;
    }

    addTo(tag: string)
    {
        globalThis.requests.addTo(tag, this.value);
    }
}