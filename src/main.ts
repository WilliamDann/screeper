import Graph                    from "./Structures/Graph";
import Node                     from "./Nodes/Node";
import { loadDump, makeDump }   from "./Mem";
import GraphBuilder             from "./GraphBuilder";

declare global {
    var graph       : Graph<Node>;
}

export function loop()
{
    let dump = loadDump();

    if (!dump)
        dump = {}

    globalThis.graph    = dump.graph;
    globalThis.requests = dump.requests;

    if (!globalThis.graph)
        globalThis.graph = new Graph<Node>();

    let gb = new GraphBuilder();
    gb.graph = globalThis.graph;

    for (let room in Game.rooms)
        if (!gb.graph.verts[room])
            gb.addRoom(Game.rooms[room]);

    for (let vert in globalThis.graph.verts)
        graph.verts[vert].tick();

    makeDump({ 
        graph    : globalThis.graph,
        requests : globalThis.requests 
    });
}