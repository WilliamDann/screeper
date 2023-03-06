export default class Pool<T>
{
    free: T[];
    used: T[];

    constructor()
    {
        this.free = [];
        this.used = [];
    }

    add(item: T): T
    {
        this.free.push(item);
        return item;
    }

    get(item: T): T[]
    {
        return [].push.apply(
            this.free.filter(x => x == item),
            this.used.filter(x => x == item)
        );
    }

    remove(item: T): void
    {
        this.free = this.free.filter(x => x != item);
        this.used = this.used.filter(x  => x != item);
    }

    setUsed(item: T): void
    {
        let i = this.free.indexOf(item);
        if (i == -1)
            return;

        let rem = this.free.splice(i, 1);
        this.used.push(rem[0]);
    }

    setFree(item: T): void
    {
        let i = this.used.indexOf(item);
        if (i == -1)
            return;

        let rem = this.used.splice(i, 1);
        this.free.push(rem[0]);
    }

    count(): number
    {
        return this.free.length + this.used.length;
    }
}