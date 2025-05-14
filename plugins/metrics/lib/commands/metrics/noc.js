"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class Noc extends core_1.Command {
    static hidden = true;
    static flags = {};
    async run() {
        const output = '-= NoC =-';
        this.log(output);
        return output;
    }
}
exports.default = Noc;
