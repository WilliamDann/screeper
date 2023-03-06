import Graph                    from "./Structures/Graph";
import Node                     from "./Nodes/Node";
import RoomNode                 from "./Nodes/RoomNode";
import { loadDump, makeDump }   from "./Mem";

export function loop()
{
    globalThis.graph = loadDump();
    if (!globalThis.graph)
        globalThis.graph = new Graph<Node>();

    let graph = globalThis.graph as Graph<Node>;
    for (let room in Game.rooms)
        if (!graph.verts[room])
            graph.addVert(room, new RoomNode(room));

    for (let vert in graph.verts)
        graph.verts[vert].tick();

    makeDump(globalThis.graph);
}