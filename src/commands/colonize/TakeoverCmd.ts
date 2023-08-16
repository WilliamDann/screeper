import Command from "../../framework/Command";
import TakeoverProc from "../../processes/TakeoverProc";

export default class TakeoverCmd extends Command
{
    creeps: string[];

    constructor(flag)
    {
        super(flag);
        this.creeps = [];
    }

    init(): void {
        for (let name in Game.creeps)
            if (Game.creeps[name].room == this.flag.room)
                this.creeps.push(name);
    }

    run(): void {
        // launch takeover proc
        this.createProcess(new TakeoverProc(this.flag.room.name, { creeps: this.creeps }));

        this.remove();
    }
}