"use strict";
exports.__esModule = true;
exports.StepJob = void 0;
var Job_1 = require("Job");
var StepJob = (function () {
    function StepJob(jobs) {
        if (jobs === void 0) { jobs = null; }
        if (jobs)
            this.steps = jobs;
        else
            this.steps = [];
        this.step = 0;
        this.jobCode = "StepJob";
    }
    StepJob.prototype.run = function () {
        function loadJob(dataObj) {
            var jobClass = globalThis.jobs[dataObj.jobCode];
            if (!jobClass)
                return null;
            var obj = { run: jobClass.run };
            for (var name_1 in dataObj)
                obj[name_1] = dataObj[name_1];
            return obj;
        }
        if (this.step >= this.steps.length)
            return Job_1.JobCode.FinishedOk;
        var job = loadJob(this.steps[this.step]);
        if (job == null)
            return Job_1.JobCode.InvalidJob;
        job.creep = this.creep;
        var code = job.run();
        if (code > 199 && code < 300) {
            this.step++;
            console.log(this.step);
        }
        if (code > 299)
            return Job_1.JobCode.FinishedError;
        if (this.step >= this.steps.length)
            return Job_1.JobCode.FinishedOk;
        return Job_1.JobCode.Running;
    };
    return StepJob;
}());
exports.StepJob = StepJob;
