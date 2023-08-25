import Processor from "./Processor";

export default class TaskManager
{
    usage : {string: number}; // proc ref -> amount

    constructor()
    {
        this.usage = this.getUsage();
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
    drawUsage()
    {

    }

    // log the usage to the client console
    logUsage()
    {
        console.log(' --- TASK MANAGER --- ');
        console.log('TICK: ' + Game.time);

        for (let proc of this.getSorted())
            console.log(` > ${proc[0]}: ${proc[1]}`);

        console.log('TOTAL: ' + Game.cpu.getUsed());
        console.log(' --- --- ');
    }
}