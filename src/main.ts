import init                 from "./Init"
import Comms from "./framework/Comms";
import Processor            from "./framework/Processor";
import { commandFactory }   from "./framework/_Init";

// screeps entry point
export function loop()
{
    // run initilization step
    init();
    const processor = Processor.getInstance();

    // create commands
    for (let flag in Game.flags)
        processor.registerCommand(commandFactory(Game.flags[flag]));


    // call init and tick funcs on cmds and procs
    processor.init();
    processor.run();

    // screeps does not always remove static members
    Comms.listners = {};
}