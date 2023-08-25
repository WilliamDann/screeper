import {addCommand, addProcess} from "./framework/_Init";

import HarvestCmd               from "./commands/harvest/HarvestCmd";
import SeedCmd                  from "./commands/colonize/SeedCmd";
import RclCmd                   from "./commands/goal/RclCmd";
import ProtoCmd                 from "./commands/colonize/ProtoCmd";

import Processor                from "./framework/Processor";
import DropHarvestProc          from "./processes/harvest/DropHarvestProc";
import FirstSpawnerProc         from "./processes/spawn/FirstSpawnerProc";
import ProtoHarvestProc         from "./processes/harvest/ProtoHarvestProc";
import RclProc                  from "./processes/goal/RclProc";
import SwarmSpawnerProc         from "./processes/spawn/SwarmSpawnerProc";
import ProtoProc                from "./processes/ProtoProc";
import TakeoverCmd from "./commands/colonize/TakeoverCmd";
import TakeoverProc from "./processes/TakeoverProc";
import ClaimCmd from "./commands/colonize/ClaimCmd";
import ClaimProc from "./processes/goal/ClaimProc";
import RemoteHarvestCmd from "./commands/goal/RemoteHarvestCmd";
import RemoteHarvestProc from "./processes/harvest/RemoteHarvestProc";
import StealCmd from "./commands/goal/StealCmd";
import StealProc from "./processes/harvest/StealProc";


/// Initilizaiton Step
export default function()
{
    // command setup
    addCommand(COLOR_YELLOW, COLOR_YELLOW, HarvestCmd);
    addCommand(COLOR_YELLOW, COLOR_BLUE, RemoteHarvestCmd);

    addCommand(COLOR_WHITE, COLOR_WHITE, SeedCmd);
    addCommand(COLOR_WHITE, COLOR_GREY, RclCmd);

    addCommand(COLOR_PURPLE, COLOR_PURPLE, ProtoCmd);
    addCommand(COLOR_WHITE, COLOR_BROWN, TakeoverCmd);

    addCommand(COLOR_PURPLE, COLOR_GREEN, ClaimCmd);

    addCommand(COLOR_YELLOW, COLOR_GREY, StealCmd)

    // process setup
    addProcess('ProtoProc', ProtoProc);

    addProcess('FirstSpawnerProc', FirstSpawnerProc);
    addProcess('SwarmSpawnerProc', SwarmSpawnerProc);

    addProcess('DropHarvestProc', DropHarvestProc);
    addProcess('ProtoHarvestProc', ProtoHarvestProc);

    addProcess('RclProc', RclProc);
    addProcess('TakeoverProc', TakeoverProc);

    addProcess('ClaimProc', ClaimProc);
    addProcess('RemoteHarvestProc', RemoteHarvestProc);
    addProcess('StealProc', StealProc)

    // init processor
    Processor.clear();
    Processor.getInstance();
}