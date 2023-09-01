import Command from "../framework/Command";
import PathingProc from "../processes/PathingProc";

export default class OptimizeCmd extends Command
{
    types: object;

    constructor(flag: Flag)
    {
        super(flag);
        this.types = {
            'pathing' : PathingProc
        }
    }

    init(): void {
        
    }

    run(): void {
        // create proc
        this.createProcess(new this.types[this.flag.name](this.flag.name, {}));

        // remove cmd
        this.remove();
    }
}