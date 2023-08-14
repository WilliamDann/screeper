import HarvestCmd from "./commands/HarvestCmd";
import SeedCmd from "./commands/SeedCmd";

import {addCommand, addProcess} from "./framework/_Init";
import Processor                from "./framework/Processor";
import DropHarvestProc from "./processes/harvest/DropHarvestProc";
import FirstSpawnerProc         from "./processes/FirstSpawnerProc";
import ProtoHarvestProc from "./processes/harvest/ProtoHarvestProc";


/// Initilizaiton Step
export default function()
{
    // command setup
    addCommand(COLOR_YELLOW, COLOR_YELLOW, HarvestCmd);
    addCommand(COLOR_WHITE, COLOR_WHITE, SeedCmd);

    // process setup
    addProcess('FirstSpawnerProc', FirstSpawnerProc);
    addProcess('DropHarvestProc', DropHarvestProc);
    addProcess('ProtoHarvestProc', ProtoHarvestProc);

    // init processor
    Processor.clear();
    Processor.getInstance();
}