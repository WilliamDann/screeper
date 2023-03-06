import Graph                    from "./Structures/Graph";
import Node                     from "./Nodes/Node";
import RoomNode                 from "./Nodes/RoomNode";
import { loadDump, makeDump }   from "./Mem";
import RequestBank              from "./Requests";

declare global {
    var requests    : RequestBank;
    var graph       : Graph<Node>;
}

export function loop()
{
    globalThis.graph = loadDump();
    if (!globalThis.graph)
        globalThis.graph = new Graph<Node>();

    let graph = globalThis.graph;
    for (let room in Game.rooms)
        if (!graph.verts[room])
            graph.addVert(room, new RoomNode(room));

    for (let vert in graph.verts)
        graph.verts[vert].tick();

    makeDump(globalThis.graph);
}