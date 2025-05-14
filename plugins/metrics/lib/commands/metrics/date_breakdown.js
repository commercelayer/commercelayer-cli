"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../base");
const common_1 = require("../../common");
class MetricsDateBreakdown extends base_1.BaseBreakdownCommand {
    static operation = 'date-breakdown';
    static aliases = ['metrics:breakdate', 'metrics:date', 'breakdate', MetricsDateBreakdown.operation];
    static description = 'perform a date breakdown query on the Metrics API endpoint';
    static examples = [
        'commercelayer metrics:date-breakdown orders'
    ];
    static flags = {
        interval: base_1.Flags.string({
            char: 'i',
            description: 'the time interval over which the metrics are computed',
            options: common_1.intervals
        })
    };
    static args = {
        ...base_1.BaseResourceCommand.args
    };
    async run() {
        const { flags } = await this.parse(MetricsDateBreakdown);
        this.checkAcessTokenData(flags.accessToken, flags);
    }
}
exports.default = MetricsDateBreakdown;
