import Colony       from "./Colony/Colony";
import { loadDump, makeDump } from "./Mem";

const validateMemory = function(loc: string)
{
    for (let item in Memory[loc])
        if (!Game[loc][item])
            delete Memory[loc];
}

function init()
{
    let colonies = {};
    for (let room in Game.rooms)
        colonies[room] = new Colony(room);
    return colonies;
}

export function loop() 
{
    validateMemory('creeps');

    if (!Memory['dump'])
        makeDump(init());

    let mem = loadDump();

    makeDump(mem);
}