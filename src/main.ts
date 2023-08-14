import init                 from "./Init"
import Processor            from "./processor/Processor";
import { commandFactory }   from "./processor/_Init";

// screeps entry point
export function loop()
{
    // run initilization step
    init();
    const processor = Processor.getInstance();

    // create commands
    for (let flag in Game.flags)
        processor.registerCommand(commandFactory(Game.flags[flag]));

    processor.init();
    processor.run();
}