"use strict";
exports.__esModule = true;
exports.TransferJob = void 0;
var Job_1 = require("./Job");
var TransferJob = /** @class */ (function () {
    function TransferJob(creep, target) {
        if (creep === void 0) { creep = null; }
        if (target === void 0) { target = null; }
        if (creep)
            this.creep = creep;
        if (target)
            this.target = target;
        this.jobCode = "TransferJob";
    }
    TransferJob.prototype.run = function () {
        var creep = Game.creeps[this.creep];
        var target = Game.getObjectById(this.target);
        var code = creep.transfer(target, RESOURCE_ENERGY);
        creep.say(code.toString());
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return Job_1.JobCode.FinishedOk;
        if (code == ERR_NOT_IN_RANGE)
            code = creep.moveTo(target);
        if ([OK, ERR_BUSY, ERR_TIRED].indexOf(code) == -1)
            return Job_1.JobCode.FinishedError;
        return Job_1.JobCode.Running;
    };
    return TransferJob;
}());
exports.TransferJob = TransferJob;
