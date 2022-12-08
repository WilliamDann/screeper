"use strict";
exports.__esModule = true;
exports.loop = void 0;
var JobRunner_1 = require("./JobRunner");
var StepJob_1 = require("./StepJob");
var HarvestJob_1 = require("./HarvestJob");
var TransferJob_1 = require("./TransferJob");
function loop() {
    // TODO yuck
    globalThis.jobs = {
        'HarvestJob': HarvestJob_1.HarvestJob.prototype,
        'TransferJob': TransferJob_1.TransferJob.prototype,
        'StepJob': StepJob_1.StepJob.prototype
    };
    var runner = new JobRunner_1.JobRunner();
    runner.setup();
    if (runner.queue.length == 0) {
        var sj = new StepJob_1.StepJob([
            new HarvestJob_1.HarvestJob(null, Game.spawns.Spawn1.room.find(FIND_SOURCES)[0].id),
            new TransferJob_1.TransferJob(null, Game.spawns.Spawn1.id)
        ]);
        runner.queue.push(sj);
    }
    runner.tick();
    runner.teardown();
}
exports.loop = loop;
