import Command          from "../../framework/Command";
import ContainerHarvestProc from "../../processes/harvest/ContainerHarvestProc";
import DropHarvestProc  from "../../processes/harvest/DropHarvestProc";
import LinkHarvestProc  from "../../processes/harvest/LinkHarvestProc";
import ProtoHarvestProc from "../../processes/harvest/ProtoHarvestProc";

// command for making a harvest process for a source
export default class HarvestCmd extends Command
{
    source: Source;                     // the target source
    harvestProcTypes = {                // map of procName -> procType for choosing what type you want
        'Proto'     : ProtoHarvestProc,
        'Drop'      : DropHarvestProc,
        'Link'      : LinkHarvestProc,
        'Container' : ContainerHarvestProc
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

        // assimilate creeps already in position
        let creeps = this.source.pos.findInRange(FIND_CREEPS, 1)

        // create harvest proc
        this.createProcess(new proc(this.source.id, { source: this.source.id, creeps: creeps.map(x => x.name) }));

        // done
        this.remove();
    }
}