import { first } from "lodash";
import Processor        from "../../Processor";
import DropHarvestProc  from "../../processes/resource/DropHarvestProc";
import Command          from "../Command"


// harvest energy from a source by spawning a harvest process
export default class HarvestCommand extends Command
{
    static commandName = 'harvest';

    static flagColorA = COLOR_YELLOW;
    static flagColorB = COLOR_YELLOW;

    memory: {
        source: Id<Source>,             // the target source
        harvesters: number,             // the number of harvesters for the command
    };


    constructor(flag: Flag)
    {
        super(flag);
    }


    // find the free spots around the source
    findSourceSpots(): number
    {
        let source = Game.getObjectById(this.memory.source);
        let area   = source.room.lookForAtArea(
            LOOK_TERRAIN,
            source.pos.y - 1,
            source.pos.x - 1,
            source.pos.y + 1,
            source.pos.x + 1,
            true
        );
        area = area.filter(x => x.terrain != 'wall');
        return area.length;
    }


    init(): void
    {
        // find source under flag
        if (!this.memory.source)
            this.memory.source = first(this.pos.lookFor(LOOK_SOURCES)).id;

        // count harvest spots if needed
        if (!this.memory.harvesters)
            this.memory.harvesters = this.findSourceSpots();
    }


    run(): void
    {
        // spawn harvest process
        //  TODO more than just a drop harvester
        Processor.getInstance().registerProcess(
            new DropHarvestProc(
                this.memory.source,
                { 
                    source     : this.memory.source,
                    harvesters : this.memory.harvesters
                }
            )
        );

        // consume command
        this.remove();
    }
}