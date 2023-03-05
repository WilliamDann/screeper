import Colony                           from "./Colony/Colony";
import ConstructionAgent                from "./Colony/ConstructionAgent";
import ConstructionOrder                from "./Colony/ConstructionOrder";
import HarvestAgent, { HarvestSite }    from "./Colony/HarvestAgent";
import BuildJob                         from "./Jobs/BuildJob";
import FillJob                          from "./Jobs/FillJob";
import HarvestJob                       from "./Jobs/HarvestJob";
import UpgradeJob                       from "./Jobs/UpgradeJob";
import { MemoryDump }                   from "./MemoryDump"
import LL                               from "./Structures/LL";
import CollectTask                      from "./Tasks/CollectTask";
import GeneralTask                      from "./Tasks/GeneralTask";
import TransferTask                     from "./Tasks/TransferTask";

export const Protos = 
{
    // Colony
    'Colony'            : Colony.prototype,

    // Agents
    'ConstructionAgent' : ConstructionAgent.prototype,
    'HarvestAgent'      : HarvestAgent.prototype,

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
    'ConstructionOrder' : ConstructionOrder.prototype,
    'HarvestSite'       : HarvestSite.prototype,
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