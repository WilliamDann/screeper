import { StepJob }          from "./Jobs/StepJob";
import { HarvestJob }       from "./Jobs/HarvestJob";
import { TransferJob }      from "./Jobs/TransferJob";
import { SpawnerAgent }     from "./Agents/SpawnerAgent";
import { HarvestAgent }     from "./Agents/HarvestAgent";
import { UpgradeAgent }     from "./Agents/UpgradeAgent";
import { WithdrawJob }      from "./Jobs/WithdrawJob";
import { UpgradeJob }       from "./Jobs/UpgradeJob";
import { BuildJob }         from "./Jobs/BuildJob";
import { BuildAgent }       from "./Agents/BuildAgent";
import { RepairJob }        from "./Jobs/RepairJob";
import { MemoryDump }       from "./MemoryDump";
import { ScalingAgent }     from "./Agents/ScalingAgent";
import { Pool }             from "./util/Pool"
import { DefenseAgent }     from "./Agents/DefenseAgent";
import { RoomAgent }        from "./Agents/RoomAgent";
import { Agent }            from "./Agents/Agent";
import { Graph, Node }            from "./util/Graph";
import { Queue }            from "./util/Queue";

const MEM_DEBUG = false;
const MEM_RESET = false;

function cleanGameMemory(clean=['creeps', 'rooms', 'spawns', 'flags', 'powerCreeps'])
{
    for (let item in Memory)
        if (clean.indexOf(item) != -1)
            for (let name in Memory[item])
                if (!Game[item][name])
                    delete Game[item][name];
}

function createMemory(md: MemoryDump)
{
    let graph  = new Graph<Agent>();
    for (let name in Game.rooms)
        graph.addVertex(new RoomAgent(name))

    dumpMemory(md);
}

function loadMemory(md: MemoryDump)
{
    let graph   = new Graph<Agent>();
    graph.nodes = new Map(md.load(MemoryDump['AgentGraph']));
    globalThis.AgentGraph = graph;
}

function dumpMemory(md: MemoryDump) {
    Memory['AgentGraph'] = md.dump(globalThis.AgentGraph.nodes.entries());
}

function runAgents()
{
    for (let agent of globalThis.AgentGraph.nodes.values())
    {
        agent.pre();
        agent.tick();
        agent.post();
    }
}

export function loop()
{
    let md = new MemoryDump({
        // helpers
        'Map'               : Map.prototype,
        'Agent'             : Agent.prototype,
        'Graph'             : Graph.prototype,
        'Node'              : Node.prototype,
        'Queue'             : Queue.prototype,
        'Pool'              : Pool.prototype,

        //agents
        'RoomAgent'         : RoomAgent.prototype,
        'DefenseAgent'      : DefenseAgent.prototype,
        'BuildAgent'        : BuildAgent.prototype,
        'HarvestAgent'      : HarvestAgent.prototype,
        'SpawnerAgent'      : SpawnerAgent.prototype,
        'UpgradeAgent'      : UpgradeAgent.prototype,
        'ScalingAgent'      : ScalingAgent.prototype,

        // jobs
        'HarvestJob'        : HarvestJob.prototype,
        'TransferJob'       : TransferJob.prototype,
        'WithdrawJob'       : WithdrawJob.prototype,
        'UpgradeJob'        : UpgradeJob.prototype,
        'BuildJob'          : BuildJob.prototype,
        'RepairJob'         : RepairJob.prototype,
        'StepJob'           : StepJob.prototype,
    });

    if (MEM_RESET)
        delete Memory['AgentGraph'];
    if (MEM_DEBUG)
        return;

    cleanGameMemory();

    if (!Memory['AgentGraph'])
        createMemory(md);
    loadMemory(md)
    runAgents();
    dumpMemory(md);
}