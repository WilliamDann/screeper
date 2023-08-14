import {addCommand, addProcess} from "./processor/_Init";

import SeedCommand      from "./commands/colonize/SeedCommand";
import HarvestCommand   from "./commands/resource/HarvestCommand";
import RefilCommand     from "./commands/resource/RefilCommand";

import RefilProc        from "./processes/logi/RefilProc";
import DropHarvestProc  from "./processes/resource/DropHarvestProc";
import BasicSpawnProc   from "./processes/spawn/BasicSpawnProc";
import Processor from "./processor/Processor";


/// Initilizaiton Step
export default function()
{
    // command setup
    addCommand(COLOR_PURPLE, COLOR_GREY,   SeedCommand);
    addCommand(COLOR_YELLOW, COLOR_YELLOW, HarvestCommand);
    addCommand(COLOR_YELLOW, COLOR_GREY,   RefilCommand);

    // process setup
    addProcess('BasicSpawnProc',    BasicSpawnProc);
    addProcess('DropHarvestProc',   DropHarvestProc);
    addProcess('RefilProc',         RefilProc);

    // init processor
    Processor.clear();
    Processor.getInstance()
}