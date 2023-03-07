import Graph                    from "./Structures/Graph";
import Node                     from "./Nodes/Node";
import RoomNode                 from "./Nodes/RoomNode";
import { loadDump, makeDump }   from "./Mem";
import RequestBank from "./Requests/RequestBank";

declare global {
    var requests    : RequestBank;
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

    for (let room in Game.rooms)
        if (!globalThis.graph.verts[room])
        {
            let node = new RoomNode(room);
            node.survery();
            globalThis.graph.addVert(room, node);
        }

    if (!globalThis.requests)
    {
        globalThis.requests = new RequestBank();
        globalThis.requests.init(globalThis.graph);
    }

    for (let vert in globalThis.graph.verts)
        graph.verts[vert].tick();

    makeDump({ 
        graph    : globalThis.graph,
        requests : globalThis.requests 
    });
}