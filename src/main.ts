import init                 from "./Init"
import Comms                from "./framework/Comms";
import TaskManager          from "./framework/ui/TaskManager";
import { commandFactory }   from "./framework/_Init";
import Grapher              from "./framework/ui/Grapher";
import { max, min }         from "lodash";
import Processor            from "./framework/Processor";

const DEBUG = true;
const RESET = false;

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

    // clean game memory
    for (let name in Memory.creeps)
        if (!Game.creeps[name])
            delete Memory.creeps[name];

    // show debug UI
    if (DEBUG)
    {
        if (RESET)
        {
            if (Game.time % Grapher.DISP_NUM == 0)
                Memory['grapher'] = {};
        }

        let tm = new TaskManager(0, 0);
        tm.draw();
        
        let gr = new Grapher(23, 0);
        gr.addLine('% Total CPU', {
            data  : () => (100 * (Game.cpu.getUsed() / Game.cpu.limit)),
            scale : x  => 10 - (0.10 * x),
            color : "#53717a"
        });
        gr.addLine('% Process CPU', {
            data  : () => (100 * ( (Game.cpu.getUsed() - tm.usage['overhead']) / Game.cpu.limit) ),
            scale : x  => 10 - (0.10 * x),
            color : "#6fd9fc"
        });
        gr.addLine('CPU Bucket', {
            data: () => Game.cpu.bucket,
            scale: x => 10 - (x/1000),
            color : "#fcba03"
        })
        gr.addLine('Max CPU %', {
            data  : () => (Game.time % 25 == 0) ? max(Memory['grapher']['% Process CPU']) : null,
            scale : x => 10 - (0.10 * x),
            color : "#bf654d"
        });
        gr.addLine('Min CPU %', {
            data  : () => (Game.time % 25 == 0) ? min(Memory['grapher']['% Process CPU']) : null,
            scale : x => 10 - (0.10 * x),
            color : "#88bd5c"
        });

        gr.addLine("Min Min CPU", {
            data  : () => min(Memory['grapher']['Min CPU %']),
            scale : x => 10 - (0.10 * x),
            color : "#6f9c4b"
        })
        gr.addLine("Max Max CPU", {
            data  : () => max(Memory['grapher']['Max CPU %']),
            scale : x => 10 - (0.10 * x),
            color : "#a65742"
        })

        gr.collect();
        gr.draw();
    }
}