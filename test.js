const {StepJob} = require("./bin/Jobs/StepJob.js");
const {HarvestJob} = require("./bin/Jobs/HarvestJob.js");
const {TransferJob} = require("./bin/Jobs/TransferJob.js");
const {SpawnerAgent} = require("./bin/Agents/SpawnerAgent.js");
const {HarvestAgent} = require("./bin/Agents/HarvestAgent.js");
const {AgentController} = require("./bin/AgentController.js");
const {UpgradeAgent} = require("./bin/Agents/UpgradeAgent.js");
const {WithdrawJob} = require("./bin/Jobs/WithdrawJob.js");
const {UpgradeJob} = require("./bin/Jobs/UpgradeJob.js");
const {BuildJob} = require("./bin/Jobs/BuildJob.js");
const {BuildAgent} = require("./bin/Agents/BuildAgent.js");
const {OptimizerAgent} = require("./bin/Agents/OptimizerAgent.js");
const {RepairJob} = require("./bin/Jobs/RepairJob.js");
const {MemoryDump} = require("./bin/MemoryDump.js");
const {CreepPool} = require("./bin/Agents/CreepPool.js");
const {JobQueue} = require("./bin/Agents/JobQueue.js");

let md = new MemoryDump({
    // helpers
    'AgentController'   : AgentController.prototype,
    'CreepPool'     : CreepPool.prototype,
    'JobQueue'      : JobQueue.prototype,

    //agents
    'BuildAgent'    : BuildAgent.prototype,
    'HarvestAgent'  : HarvestAgent.prototype,
    'OptimizerAgent': OptimizerAgent.prototype,
    'SpawnerAgent'  : SpawnerAgent.prototype,
    'UpgradeAgent'  : UpgradeAgent.prototype,

    // jobs
    'HarvestJob'    : HarvestJob.prototype,
    'TransferJob'   : TransferJob.prototype,
    'WithdrawJob'   : WithdrawJob.prototype,
    'UpgradeJob'    : UpgradeJob.prototype,
    'BuildJob'      : BuildJob.prototype,
    'RepairJob'     : RepairJob.prototype,
    'StepJob'       : StepJob.prototype,
});

let controller = new AgentController([
    new HarvestAgent('src', 'spn'),
    new SpawnerAgent('spn'),
    new UpgradeAgent('ctrl', undefined),
    new BuildAgent('spn'),
    new OptimizerAgent('sim')
]);

let dmp = md.dump(controller, []);
console.log(dmp);
console.log(md.load(dmp));