"use strict";
exports.__esModule = true;
exports.JobRunner = void 0;
var JobRunner = /** @class */ (function () {
    function JobRunner() {
        this.running = [];
        this.queue = [];
        this.creepsIdle = [];
        this.creepsWorking = [];
    }
    //#region funcs
    JobRunner.prototype.setup = function () {
        if (!Memory['JobRunner'])
            this.teardown();
        this.running = Memory['JobRunner'].running;
        this.queue = Memory['JobRunner'].queue;
        this.creepsWorking = Memory['JobRunner'].creepsWorking;
        this.creepsIdle = Memory['JobRunner'].creepsIdle;
    };
    JobRunner.prototype.tick = function () {
        this.pollCreeps(); // TODO not every tick
        for (var _i = 0, _a = this.creepsIdle; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            if (!this.assignNextJob(name_1))
                break;
        }
        for (var _b = 0, _c = this.running; _b < _c.length; _b++) {
            var job = _c[_b];
            this.runJob(job);
            job.runTime = (job.runTime === undefined) ? 0 : job.runTime + 1;
        }
        for (var _d = 0, _e = this.queue; _d < _e.length; _d++) {
            var job = _e[_d];
            job.queueTime = (job.queueTime === undefined) ? 0 : job.queueTime + 1;
        }
    };
    JobRunner.prototype.teardown = function () {
        Memory['JobRunner'] = {
            running: this.running,
            queue: this.queue,
            creepsWorking: this.creepsWorking,
            creepsIdle: this.creepsIdle
        };
    };
    //#endregion
    //#region helpers
    JobRunner.prototype.loadJob = function (dataObj) {
        var jobClass = globalThis.jobs[dataObj.jobCode];
        if (!jobClass)
            return null;
        var obj = { run: jobClass.run };
        for (var name_2 in dataObj)
            obj[name_2] = dataObj[name_2];
        return obj;
    };
    JobRunner.prototype.creepIsPolled = function (name) {
        return this.creepsWorking.indexOf(name) != -1 || this.creepsIdle.indexOf(name) != -1;
    };
    JobRunner.prototype.pollCreeps = function () {
        for (var name_3 in Game.creeps)
            if (!this.creepIsPolled(name_3))
                this.creepsIdle.push(name_3);
    };
    JobRunner.prototype.setCreepIdle = function (name, idle) {
        if (idle === void 0) { idle = true; }
        if (idle) {
            this.creepsWorking = this.creepsWorking.filter(function (x) { return x != name; });
            this.creepsIdle.push(name);
        }
        else {
            this.creepsIdle = this.creepsIdle.filter(function (x) { return x != name; });
            this.creepsWorking.push(name);
        }
    };
    JobRunner.prototype.setCreepWorking = function (name, working) {
        if (working === void 0) { working = true; }
        this.setCreepIdle(name, !working);
    };
    JobRunner.prototype.assignNextJob = function (creep) {
        var job = this.queue.shift();
        if (job === undefined)
            return false;
        job.creep = creep;
        this.running.push(job);
        this.setCreepWorking(creep);
        return true;
    };
    JobRunner.prototype.runJob = function (job) {
        var loadedJob = this.loadJob(job);
        if (loadedJob == null) {
            this.setCreepIdle(job.creep);
            this.running.splice(this.running.indexOf(job), 1);
            return;
        }
        var status = loadedJob.run();
        // copy state to stored job
        for (var name_4 in job)
            job[name_4] = loadedJob[name_4];
        if (status >= 200) {
            this.setCreepIdle(job.creep);
            this.running.splice(this.running.indexOf(job), 1);
        }
    };
    return JobRunner;
}());
exports.JobRunner = JobRunner;
