import init                 from "./framework/Init"
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

    processor.init();
    processor.run();
}