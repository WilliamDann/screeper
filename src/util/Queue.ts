export class Queue<T>
{
    elems   : {};
    head    : number;
    tail    : number;

    constructor()
    {
        this.elems = {};
        this.head  = 0;
        this.tail  = 0;
    }

    enqueue(elem: T): void
    {
        this.elems[this.tail] = elem;
        this.tail++;
    }

    dequeue(): T
    {
        const item = this.elems[this.head];
        delete this.elems[this.head];
        this.head++;
        return item;
    }

    peek(): T
    {
        return this.elems[this.head];
    }

    get length(): number
    {
        return this.tail - this.head;
    }

    get isEmpty(): boolean
    {
        return this.length == 0;
    }
}