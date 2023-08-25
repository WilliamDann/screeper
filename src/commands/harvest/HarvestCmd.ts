import Command          from "../../framework/Command";
import DropHarvestProc  from "../../processes/harvest/DropHarvestProc";
import LinkHarvestProc  from "../../processes/harvest/LinkHarvestProc";
import ProtoHarvestProc from "../../processes/harvest/ProtoHarvestProc";

// command for making a harvest process for a source
export default class HarvestCmd extends Command
{
    source: Source;                     // the target source
    harvestProcTypes = {                // map of procName -> procType for choosing what type you want
        'Proto' : ProtoHarvestProc,
        'Drop'  : DropHarvestProc,
        'Link'  : LinkHarvestProc,
    }

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
        let proc = this.harvestProcTypes[this.flag.name];
        if (!proc)
        {
            this.remove();
            throw new Error("Invalid harvest proc type: " + this.flag.name);
        }

        // create harvest proc
        this.createProcess(new proc(this.source.id, { source: this.source.id }));

        // done
        this.remove();
    }
}