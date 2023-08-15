import Command from "../framework/Command";
import DropHarvestProc from "../processes/harvest/DropHarvestProc";
import { freeSpots } from "../util";

// command for making a harvest process for a source
export default class HarvestCmd extends Command
{
    source: Source; // the target source


    constructor(flag: Flag)
    {
        super(flag);
    }


    init(): void
    {
        this.source = this.flag.pos.lookFor(LOOK_SOURCES)[0];
    }


    run(): void
    {
        // create harvest proc
        this.createProcess(new DropHarvestProc(
            this.source.id, 
            {
                source    : this.source.id,
                creepGoal : freeSpots(this.source.pos)
            }
        ));

        // done
        this.remove();
    }
}