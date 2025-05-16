"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_core_1 = require("@commercelayer/cli-core");
const base_1 = require("../../base");
const common_1 = require("../../common");
const request_1 = require("../../request");
const cliux = tslib_1.__importStar(require("@commercelayer/cli-ux"));
class MetricsDateBreakdown extends base_1.BaseBreakdownCommand {
    static operation = 'date_breakdown';
    static aliases = ['metrics:breakdate', 'metrics:date', 'breakdate', MetricsDateBreakdown.operation];
    static description = 'perform a date breakdown query on the Metrics API endpoint';
    static examples = [
        'commercelayer metrics:date_breakdown orders -b order.placed_at -f order.total_amount_with_taxes -O stats -i month'
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
        const { args, flags } = await this.parse(MetricsDateBreakdown);
        this.checkAcessTokenData(flags.accessToken, flags);
        const resource = args.resource;
        const operator = flags.operator;
        const interval = flags.interval;
        const breakdown = this.breakdownFlag(flags.breakdown);
        const queryBreakdown = {
            by: flags.by,
            field: flags.field,
            operator,
            interval,
            breakdown
        };
        const filterObject = this.filterFlag(flags.filter);
        const query = {
            date_breakdown: queryBreakdown,
            filter: filterObject
        };
        const response = await (0, request_1.metricsRequest)(MetricsDateBreakdown.operation, query, resource, flags);
        if (response.ok) {
            const dateBreakdown = (await response.json()).data;
            cliux.action.stop(cli_core_1.clColor.msg.success('Done'));
            this.log();
            this.printDateBreakdown(operator, dateBreakdown);
            this.log();
        }
        else
            await this.printResponse(response);
    }
    printDateBreakdown(operator, data, level = 0) {
        if (level === 0)
            cliux.action.stop(cli_core_1.clColor.msg.success('Done'));
        const operatorInfo = common_1.operatorMap[operator];
        this.log('----------------------------------------');
        for (const item of data) {
            this.log(`date: ${cli_core_1.clColor.magenta(cli_core_1.clOutput.cleanDate(String(item.date)))}`);
            if (operatorInfo.type === 'Object') {
                this.log(`${operator} = {`);
                ['count', 'min', 'max', 'avg', 'sum'].forEach((op) => {
                    this.log(`  ${op.padStart(5, ' ')}: ${cli_core_1.clColor.yellow(item.value[op])}`);
                });
                this.log('}');
            }
            else
                this.log(`${operator} = ${cli_core_1.clColor.yellow(item.value)}`);
            const extraFields = Object.keys(item).filter((field) => !['label', 'value', 'date'].includes(String(field)));
            const nestedBreakdown = (extraFields.length > 0) ? extraFields[0] : undefined;
            if (nestedBreakdown)
                this.printBreakdown(nestedBreakdown, item, level);
            this.log('----------------------------------------');
        }
    }
}
exports.default = MetricsDateBreakdown;
