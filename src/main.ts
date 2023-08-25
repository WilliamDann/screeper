import init                 from "./Init"
import Comms                from "./framework/Comms";
import Processor            from "./framework/Processor";
import TaskManager          from "./framework/ui/TaskManager";
import { commandFactory }   from "./framework/_Init";
import Grapher from "./framework/ui/Grapher";

const DEBUG = true;

function consoleClear()
{
    for (let i = 0; i < 25; i++)
        console.log();
}

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

    // temp tower control code
    for (let name in Game.rooms)
    {
        let towers = Game.rooms[name].find(FIND_STRUCTURES, { filter: x => x.structureType == STRUCTURE_TOWER }) as StructureTower[];
        for (let baddie of Game.rooms[name].find(FIND_HOSTILE_CREEPS))
            for (let tower of towers)
                tower.attack(baddie);
    }

    // show debug UI
    if (DEBUG)
    {
        let tm = new TaskManager(0, 0);
        tm.draw();
        
        let gr = new Grapher(23, 0);
        gr.addLine('% Usage CPU per Tick', {
            data  : () => (100 * (Game.cpu.getUsed() / Game.cpu.limit)),
            scale : x  => 10 - (0.10 * x),
            color : "#6fd9fc"
        });
        gr.addLine('CPU Bucket', {
            data: () => Game.cpu.bucket,
            scale: x => 10 - (x/1000),
            color : "#fcba03"
        })
        gr.collect();
        gr.draw();
    }
}