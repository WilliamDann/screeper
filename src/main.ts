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
}