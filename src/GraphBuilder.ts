import ControllerNode    from "./Nodes/ControllerNode";
import {ProtoHarvestNode}  from "./Nodes/HarvestNode";
import SpawnNode         from "./Nodes/SpawnNode";
import RoomNode          from "./Nodes/RoomNode";
import Graph             from "./Structures/Graph";
import Node              from "./Nodes/Node";

export default class GraphBuilder {
    graph: Graph<Node>

    constructor()
    {
        this.graph = new Graph<Node>(); 
    }

    addRoom(room: Room)
    {
        this.graph.addVert(room.name, new RoomNode(room.name));

        let ctrl    = room.controller;
        let spawns  = room.find(FIND_MY_SPAWNS);
        let sources = room.find(FIND_SOURCES);

        this.graph.addVert(ctrl.id, new ControllerNode(ctrl.id));
        this.graph.addEdge(ctrl.id, room.name);

        for (let spawn of spawns)
        {
            this.graph.addVert(spawn.id, new SpawnNode(spawn.id));
            this.graph.addEdge(spawn.id, room.name);
        }

        for (let source of sources)
        {
            this.graph.addVert(source.id, new ProtoHarvestNode(source.id));
            this.graph.addEdge(source.id, room.name);
        }
    }
}