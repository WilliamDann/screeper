import BuildJob                         from "./Jobs/BuildJob";
import FillJob                          from "./Jobs/FillJob";
import HarvestJob                       from "./Jobs/HarvestJob";
import UpgradeJob                       from "./Jobs/UpgradeJob";
import MemoryDump                       from "./MemoryDump"
import ControllerNode                   from "./Nodes/ControllerNode";
import HarvestNode                      from "./Nodes/HarvestNode";
import RoomNode                         from "./Nodes/RoomNode";
import SpawnNode                        from "./Nodes/SpawnNode";
import Graph from "./Structures/Graph";
import LL                               from "./Structures/LL";
import CollectTask                      from "./Tasks/CollectTask";
import GeneralTask                      from "./Tasks/GeneralTask";
import TransferTask                     from "./Tasks/TransferTask";

export const Protos = 
{
    // Nodes
    'ControllerNode'    : ControllerNode.prototype,
    'HarvestNode'       : HarvestNode.prototype,
    'RoomNode'          : RoomNode.prototype,
    'SpawnNode'         : SpawnNode.prototype,

    // Jobs
    'BuildJob'          : BuildJob.prototype,
    'FillJob'           : FillJob.prototype,
    'HarvestJob'        : HarvestJob.prototype,
    'UpgradeJob'        : UpgradeJob.prototype,

    // Tasks
    'CollectTask' : CollectTask.prototype,
    'GeneralTask' : GeneralTask.prototype,
    'TransferTask' : TransferTask.prototype,

    // Util
    'Graph'             : Graph.prototype,
    'LL'                : LL.prototype,
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