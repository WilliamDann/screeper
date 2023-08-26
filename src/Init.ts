import {addCommand, addProcess} from "./framework/_Init";

import HarvestCmd               from "./commands/harvest/HarvestCmd";
import SeedCmd                  from "./commands/colonize/SeedCmd";
import RclCmd                   from "./commands/goal/RclCmd";
import ProtoCmd                 from "./commands/colonize/ProtoCmd";
import TakeoverCmd              from "./commands/colonize/TakeoverCmd";
import ClaimCmd                 from "./commands/colonize/ClaimCmd";
import RemoteHarvestCmd         from "./commands/harvest/RemoteHarvestCmd";
import StealCmd                 from "./commands/goal/StealCmd";
import LinkNetCmd               from "./commands/logi/InitLinkNetCmd";
import DefenseCmd               from "./commands/war/DefenseCmd";

import Processor                from "./framework/Processor";
import DropHarvestProc          from "./processes/harvest/DropHarvestProc";
import FirstSpawnerProc         from "./processes/spawn/FirstSpawnerProc";
import ProtoHarvestProc         from "./processes/harvest/ProtoHarvestProc";
import RclProc                  from "./processes/goal/RclProc";
import SwarmSpawnerProc         from "./processes/spawn/SwarmSpawnerProc";
import ProtoProc                from "./processes/ProtoProc";
import TakeoverProc             from "./processes/TakeoverProc";
import ClaimProc                from "./processes/goal/ClaimProc";
import RemoteHarvestProc        from "./processes/harvest/RemoteHarvestProc";
import StealProc                from "./processes/harvest/StealProc";
import LinkHarvestProc          from "./processes/harvest/LinkHarvestProc";
import LinkNetProc              from "./processes/LinkNetProc";
import StaticDefenseProc        from "./processes/war/StaticDefenseProc";
import WaveAttackProc from "./processes/war/WaveAttackProc";
import AttackCmd from "./commands/war/AttackCmd";


/// Initilizaiton Step
export default function()
{
    // command setup
    addCommand(COLOR_YELLOW, COLOR_YELLOW, HarvestCmd);
    addCommand(COLOR_YELLOW, COLOR_BLUE, RemoteHarvestCmd);

    addCommand(COLOR_WHITE, COLOR_WHITE, SeedCmd);
    addCommand(COLOR_WHITE, COLOR_GREY, RclCmd);
    addCommand(COLOR_WHITE, COLOR_YELLOW, LinkNetCmd);

    addCommand(COLOR_PURPLE, COLOR_PURPLE, ProtoCmd);
    addCommand(COLOR_WHITE, COLOR_BROWN, TakeoverCmd);

    addCommand(COLOR_PURPLE, COLOR_GREEN, ClaimCmd);

    addCommand(COLOR_YELLOW, COLOR_GREY, StealCmd);

    addCommand(COLOR_RED, COLOR_BLUE, DefenseCmd);
    addCommand(COLOR_RED, COLOR_RED, AttackCmd);

    // process setup
    addProcess('ProtoProc', ProtoProc);

    addProcess('FirstSpawnerProc', FirstSpawnerProc);
    addProcess('SwarmSpawnerProc', SwarmSpawnerProc);

    addProcess('DropHarvestProc', DropHarvestProc);
    addProcess('ProtoHarvestProc', ProtoHarvestProc);
    addProcess('LinkHarvestProc', LinkHarvestProc);

    addProcess('RclProc', RclProc);
    addProcess('TakeoverProc', TakeoverProc);

    addProcess('ClaimProc', ClaimProc);
    addProcess('RemoteHarvestProc', RemoteHarvestProc);
    addProcess('StealProc', StealProc);
    addProcess('LinkNetProc', LinkNetProc);

    addProcess('StaticDefenseProc', StaticDefenseProc);
    addProcess('WaveAttackProc', WaveAttackProc);

    // init processor
    Processor.clear();
    Processor.getInstance();
}