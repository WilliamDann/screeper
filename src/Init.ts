import {addCommand, addProcess} from "./framework/_Init";

import HarvestCmd               from "./commands/HarvestCmd";
import SeedCmd                  from "./commands/SeedCmd";
import RclCmd                   from "./commands/RclCmd";
import ProtoCmd                 from "./commands/ProtoCmd";

import Processor                from "./framework/Processor";
import DropHarvestProc          from "./processes/harvest/DropHarvestProc";
import FirstSpawnerProc         from "./processes/spawn/FirstSpawnerProc";
import ProtoHarvestProc         from "./processes/harvest/ProtoHarvestProc";
import RclProc                  from "./processes/goal/RclProc";
import SwarmSpawnerProc         from "./processes/spawn/SwarmSpawnerProc";
import ProtoProc                from "./processes/ProtoProc";


/// Initilizaiton Step
export default function()
{
    // command setup
    addCommand(COLOR_YELLOW, COLOR_YELLOW, HarvestCmd);
    addCommand(COLOR_WHITE, COLOR_WHITE, SeedCmd);
    addCommand(COLOR_WHITE, COLOR_GREY, RclCmd);

    addCommand(COLOR_PURPLE, COLOR_PURPLE, ProtoCmd);

    // process setup
    addProcess('ProtoProc', ProtoProc);

    addProcess('FirstSpawnerProc', FirstSpawnerProc);
    addProcess('SwarmSpawnerProc', SwarmSpawnerProc);

    addProcess('DropHarvestProc', DropHarvestProc);
    addProcess('ProtoHarvestProc', ProtoHarvestProc);

    addProcess('RclProc', RclProc);

    // init processor
    Processor.clear();
    Processor.getInstance();
}