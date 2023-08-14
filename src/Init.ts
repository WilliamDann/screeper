import SeedCmd from "./commands/SeedCmd";

import {addCommand, addProcess} from "./framework/_Init";
import Processor                from "./framework/Processor";


/// Initilizaiton Step
export default function()
{
    // command setup
    addCommand(COLOR_WHITE, COLOR_WHITE, SeedCmd);

    // process setup

    // init processor
    Processor.clear();
    Processor.getInstance()
}