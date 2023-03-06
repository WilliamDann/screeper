import CollectJob from "./Job/CollectJob";
import MemoryDump                       from "./MemoryDump"
import ControllerNode                   from "./Nodes/ControllerNode";
import HarvestNode                      from "./Nodes/HarvestNode";
import Node from "./Structures/LL";
import RoomNode                         from "./Nodes/RoomNode";
import SpawnNode                        from "./Nodes/SpawnNode";
import Graph from "./Structures/Graph";
import LL                               from "./Structures/LL";
import Pool from "./Structures/Pool";
import TransferJob from "./Job/TransferJob";
import BuildJob from "./Job/BuildJob";
import UpgradeJob from "./Job/UpgradeJob";

export const Protos = 
{
    // Nodes
    'ControllerNode'    : ControllerNode.prototype,
    'HarvestNode'       : HarvestNode.prototype,
    'RoomNode'          : RoomNode.prototype,
    'SpawnNode'         : SpawnNode.prototype,

    // Job
    'CollectJob'        : CollectJob.prototype,
    'TransferJob'       : TransferJob.prototype,
    'BuildJob'          : BuildJob.prototype,
    'UpgradeJob'        : UpgradeJob.prototype,

    // Util
    'Graph'             : Graph.prototype,
    'LL'                : LL.prototype,
    'Node'              : Node.prototype,
    'Pool'              : Pool.prototype,
}

export const GameMemDump = () => new MemoryDump(Protos);

export const makeDump = function(toDump: any)
{
    Memory['dump'] = GameMemDump().dump(toDump, []);
}

export const loadDump = function()
{
    return GameMemDump().load(Memory['dump']);
}