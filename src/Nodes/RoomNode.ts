import Graph            from "../Structures/Graph";
import ControllerNode   from "./ControllerNode";
import HarvestNode      from "./HarvestNode";
import Node             from "./Node";
import SpawnNode        from "./SpawnNode";

export default class RoomNode extends Node
{
    surveyInterval  : number;
    lastSurvery     : number;

    constructor(room: string, surveryInterval: number = 100)
    {
        super(room);

        this.surveyInterval = surveryInterval;
    }

    survery()
    {
        let graph   = globalThis.graph as Graph<Node>;

        let room    = Game.rooms[this.tag];
        let ctrl    = room.controller;
        let spawns  = room.find(FIND_MY_SPAWNS);
        let sources = room.find(FIND_SOURCES);

        graph.addVert(ctrl.id, new ControllerNode(ctrl.id));
        graph.addEdge(ctrl.id, this.tag);

        for (let spawn of spawns)
        {
            graph.addVert(spawn.id, new SpawnNode(spawn.id));
            graph.addEdge(spawn.id, this.tag);
        }

        for (let source of sources)
        {
            graph.addVert(source.id, new HarvestNode(source.id));
            graph.addEdge(source.id, this.tag);
        }

        this.lastSurvery = Game.time;
    }

    tick()
    {
        if (!this.lastSurvery || Game.time > this.lastSurvery+this.surveyInterval)
            this.survery();

        super.tick();
    }
}