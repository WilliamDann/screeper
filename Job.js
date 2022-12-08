"use strict";
exports.__esModule = true;
exports.JobCode = void 0;
var JobCode;
(function (JobCode) {
    // RUNNING CODES
    JobCode[JobCode["Running"] = 100] = "Running";
    // FINISHED CODES
    JobCode[JobCode["FinishedOk"] = 200] = "FinishedOk";
    JobCode[JobCode["FinishedError"] = 201] = "FinishedError";
    // ERR CODES
    JobCode[JobCode["InvalidJob"] = 300] = "InvalidJob";
})(JobCode = exports.JobCode || (exports.JobCode = {}));
