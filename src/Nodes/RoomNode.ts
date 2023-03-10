import RepairJob        from "../Job/RepairJob";
import { JobBuilder } from "../Requests/JobBuilder";
import { RequestBuilder } from "../Requests/Request";
import { RequestPriority } from "../Requests/RequestPriority";
import { SpawnRequestBuilder } from "../Requests/SpawnRequest";
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
        let room    = Game.rooms[this.tag];
        let ctrl    = room.controller;
        let spawns  = room.find(FIND_MY_SPAWNS);
        let sources = room.find(FIND_SOURCES);

        globalThis.graph.addVert(ctrl.id, new ControllerNode(ctrl.id));
        globalThis.graph.addEdge(ctrl.id, this.tag);

        for (let spawn of spawns)
        {
            globalThis.graph.addVert(spawn.id, new SpawnNode(spawn.id));
            globalThis.graph.addEdge(spawn.id, this.tag);
        }

        for (let source of sources)
        {
            globalThis.graph.addVert(source.id, new HarvestNode(source.id));
            globalThis.graph.addEdge(source.id, this.tag);
        }

        this.lastSurvery = Game.time;
    }

    makeRepairRequest()
    {
        let req = new RequestBuilder()
            .from(this.tag)
            .priority(RequestPriority.Normal)

        let filter = {
            filter: x => 
            x.hits != x.hitsMax                  &&
            x.structureType != STRUCTURE_WALL    &&
            x.structureType != STRUCTURE_RAMPART
        };
        for (let struct of Game.rooms[this.tag].find(FIND_STRUCTURES, filter))
        {
            let harv = this.searchForNode("HarvestNode", (x) => {
                let score  = 0;
                let job    = (x as HarvestNode).getCollectJob();
                let target = Game.getObjectById(job.target);

                if (target instanceof StructureContainer)
                    score += 50;

                score += struct.pos.getRangeTo(target) * 10;
                return score;
            }) as HarvestNode;

            req.work(
                new JobBuilder()
                    .add(harv.getCollectJob())
                    .add(new RepairJob(this.tag as any))
                    .root
            );
        }

        req.addTo(this.tag);
    }

    tick()
    {
        if (!this.lastSurvery || Game.time > this.lastSurvery+this.surveyInterval)
            this.survery();

        if (this.creepPool.count() == 0)
            new RequestBuilder()
                .from(this.tag)
                .priority(RequestPriority.High)
                .spawnCreep(
                    new SpawnRequestBuilder()
                        .name(`RoomNode-${Game.time}`)
                        .body([WORK, CARRY, MOVE, MOVE])
                        .get()
                )
                .addTo(this.searchForNode("SpawnNode").tag);

        this.makeRepairRequest(); // TODO it's the Node's job to ask

        super.tick();
    }
}