import RepairJob from "../Job/RepairJob";
import Graph            from "../Structures/Graph";
import ControllerNode   from "./ControllerNode";
import HarvestNode      from "./HarvestNode";
import Node             from "./Node";
import SpawnNode, { SpawnRequest }        from "./SpawnNode";

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

    makeRepairJobs(harv: HarvestNode)
    {
        let room = Game.rooms[this.tag];

        let flt = { filter: x => 
            x.hits != x.hitsMax                     &&
            x.structureType != STRUCTURE_WALL       &&
            x.structureType != STRUCTURE_RAMPART
        };
        for (let struct of room.find(FIND_STRUCTURES, flt))
        {
            let job      = harv.getCollectJob();
            job.assigner = this.tag;
            job.next     = new RepairJob(this.tag, struct.id);
            this.jobPool.add(job);
        }
    }

    makeJobs()
    {
        let room = Game.rooms[this.tag];
        let harv = this.searchForNode("HarvestNode") as HarvestNode;
        if (this.getJobsAssignedBy(this.tag).length != 0)
            return;

        this.makeRepairJobs(harv);
    }

    tick()
    {
        if (!this.lastSurvery || Game.time > this.lastSurvery+this.surveyInterval)
            this.survery();

        if (this.creepPool.count() == 0)
        {
            let spawnNode = this.findNodeOfType("SpawnNode") as SpawnNode;
            let request   = {
                requester: this.tag,
                body: [ WORK, CARRY, MOVE, MOVE ],
                name: `RoomNode-${Game.time}` 
            } as SpawnRequest;
            spawnNode.requestCreep(request);
        }

        this.makeJobs();
        super.tick();
    }
}