import { first } from "lodash";
import Command from "../Command";
import Processor from "../../Processor";
import RefilProc from "../../processes/logi/RefilProc";

export default class RefilCommand extends Command
{
    memory: {
        target: Id<_HasId>      // the target of the command
        amount: number;         // the amount to refill
    }

    constructor(flag: Flag)
    {
        super(flag);
        this.memory.amount = parseInt(this.flag.name);
    }


    // get the target of the command
    getTarget(): _HasId
    {
        return first(
            this.flag.pos.lookFor(LOOK_STRUCTURES)
            .filter(x => x['store']!!)
        )
    }


    // find the memory of a refill process in the room of the command
    findRefilProc(): any|undefined
    {
        return Memory['processor']['processes']['RefilProc_'+this.flag.room.name];
    }


    // add a target to a refil proc's data
    addToRefilProc(proc: object)
    {
        if (!proc['memory']['targets'])
            proc['memory']['targets'] = [];
        proc['memory']['targets'].push(this.memory.target);
    }


    init(): void {
        this.memory.target = this.getTarget().id;
    }


    run(): void {
        let proc = this.findRefilProc();

        // spawn a refil proc if there is none
        if (!proc)
        {
            Processor.getInstance().registerProcess(new RefilProc(this.flag.room.name));
            return;
        }

        // add the target to the refil proc
        this.addToRefilProc(proc);
        this.remove();
    }
}