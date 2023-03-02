import { Agent }        from "./Agent";
import { BuildAgent } from "./BuildAgent";
import { DefenseAgent } from "./DefenseAgent";
import { HarvestAgent } from "./HarvestAgent";
import { ScalingAgent } from "./ScalingAgent";
import { SpawnerAgent } from "./SpawnerAgent";
import { UpgradeAgent } from "./UpgradeAgent";

export class RoomAgent extends Agent
{

    roomName: string;

    constructor(roomName: string)
    {
        super();
        this.roomName = roomName;
    }

    init(): void
    {
        let room = Game.rooms[this.roomName];

        for (let spawner of room.find(FIND_MY_SPAWNS))
            globalThis.AgentGraph.addEdge(this, new SpawnerAgent(spawner.id));
        for (let source of room.find(FIND_SOURCES))
            globalThis.AgentGraph.addEdge(this, new HarvestAgent(source.id));
        globalThis.AgentGraph.addEdge(this, new ScalingAgent());
        globalThis.AgentGraph.addEdge(this, new BuildAgent());
        globalThis.AgentGraph.addEdge(this, new DefenseAgent());
        globalThis.AgentGraph.addEdge(this, new UpgradeAgent(room.controller.id));
    }

    tick(): void {
        // create nodes in a smarter way
        let node = globalThis.AgentGraph.nodes.get(this);
        if (node.adj.length == 0)
            this.init();

        super.tick();
    }
}