import Processor from "../Processor";

export default class TaskManager
{
    x: number;
    y: number;

    usage  : {string: number}; // proc ref -> amount
    sorted : any[]             // array of sorted vals

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;

        this.usage  = this.getUsage();
        this.sorted = this.getSorted();
    }

    getUsage(): {string: number}
    {
        let usage = {};

        let acc = 0;
        for (let proc of Processor.getInstance().processes)
        {
            usage[proc.ref] = proc['_cpu'];
            acc += proc['_cpu']
        }
        usage['overhead'] = Game.cpu.getUsed() - acc;

        return usage as any;
    }

    getSorted(): any[]
    {
        let d = [];
        
        for (let key in this.usage)
            d.push([key, this.usage[key]]);

        return d.sort((a, b) => b[1] - a[1]);
    }

    // draw the usage on the client
    draw()
    {
        const DEFAULT_TEXT = {align: "left", opacity: 0.2 } as MapTextStyle;
        const BOLD_TEXT    = {align: "left", opacity: 0.4 } as MapTextStyle;

        let v = new RoomVisual();
        v.rect(this.x, this.y, 23, 15, { fill: undefined, opacity: 0.1, })
        v.text("Task Manager", this.x+1, this.y+1, BOLD_TEXT)

        // labs
        v.text("ProcName", this.x+1, this.y+2, BOLD_TEXT);
        v.text("CPU", this.x+20, this.y+2, BOLD_TEXT);

        let i = 0;
        for (let proc of this.sorted)
        {
            v.text(proc[0], this.x+1, this.y+3+i, DEFAULT_TEXT);
            v.text(proc[1].toFixed(4), this.x+20, this.y+3+i, DEFAULT_TEXT);
            i++;
        }
    }

    // log the usage to the client console
    log()
    {
        console.log(' --- TASK MANAGER --- ');
        console.log('TICK: ' + Game.time);

        for (let proc of this.sorted)
            console.log(` > ${proc[0]}: ${proc[1]}`);

        console.log('TOTAL: ' + Game.cpu.getUsed());
        console.log(' --- --- ');
    }
}