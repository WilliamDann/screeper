class Node<T>
{
    next: Node<T>
    val : T

    constructor(next: Node<T>, val: T)
    {
        this.next = next;
        this.val  = val;
    }
}

export default class LL<T>
{
    private root    : Node<T>
    length          : number;

    constructor()
    {
        this.length = 0;
    }

    *iter()
    {
        let curr = this.root
        while (curr.next)
        {
            yield curr;
            curr = curr.next;
        }
    }

    add(item: T)
    {
        this.root.next = new Node(this.root.next, item);
        this.length++;
    }

    addAt(item: T, index: number)
    {
        if (index >= this.length)
            throw new RangeError(`Range Error: ${index} >= ${this.length}`);

        let iter            = this.iter();
        let n               = index;
        let val : Node<T>   = null;
        while(n >= 0)
        {
            val = iter.next().value as Node<T>;
            n--;
        }

        val.next = new Node(val.next,  item);
        this.length++;
    }

    remove(): T
    {
        let temp = this.root.val;
        this.root = this.root.next;
        this.length--;
        return temp;
    }

    removeAt(index:number): T
    {
        if (index >= this.length)
            throw new RangeError(`Range Error: ${index} >= ${this.length}`);

        let iter            = this.iter();
        let n               = index;
        let val : Node<T>   = null;
        while(n >= 0)
        {
            val = iter.next().value as Node<T>;
            n--;
        }

        if (val.next)
            val.next = val.next.next

        return val.val;
    }

    peek(): T
    {
        return this.root.val;
    }

    peekAt(index: number): T
    {
        if (index >= this.length)
            throw new RangeError(`Range Error: ${index} >= ${this.length}`);

        let iter = this.iter();
        let n    = index;
        let val  = this.root;
        while (n >= 0)
            val = iter.next().value as Node<T>;

        return val.val;
    }

    indexOf(val: T): number
    {
        let iter = this.iter();
        let node = iter.next().value as Node<T>;
        let i    = 0;
        do {
            if (node.val == val)
               return i;
            i++;
        } while (node);

        return -1;
    }
}