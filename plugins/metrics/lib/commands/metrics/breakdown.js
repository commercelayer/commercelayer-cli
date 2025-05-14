"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_core_1 = require("@commercelayer/cli-core");
const base_1 = require("../../base");
const common_1 = require("../../common");
const request_1 = require("../../request");
class MetricsBreakdown extends base_1.BaseBreakdownCommand {
    static operation = 'breakdown';
    static aliases = ['metrics:break', MetricsBreakdown.operation];
    static description = 'perform a breakdown query on the Metrics API endpoint';
    static examples = [
        'commercelayer metrics:breakdown orders'
    ];
    static flags = {
        condition: base_1.Flags.string({
            char: 'c',
            summary: 'an additional constraint to fine-tune the set of records',
            description: 'the condition is applied to the computed results of the query and it is available for operators that return single numeric (float or integer) values.'
        }),
        sort: base_1.Flags.string({
            char: 's',
            description: 'the way you want the results of the query to be sorted',
            options: common_1.sorts
        }),
        limit: base_1.Flags.integer({
            char: 'l',
            description: 'the maximum number of records shown in the response',
            min: 1,
            max: 100
        })
    };
    static args = {
        ...base_1.BaseResourceCommand.args
    };
    async run() {
        const { args, flags } = await this.parse(MetricsBreakdown);
        this.checkAcessTokenData(flags.accessToken, flags);
        const resource = args.resource;
        const operator = flags.operator;
        const condition = this.conditionFlag(flags.condition);
        const sort = flags.sort;
        const breakdown = this.breakdownFlag(flags.breakdown);
        const queryBreakdown = {
            by: flags.by,
            field: flags.field,
            operator,
            condition,
            sort,
            limit: flags.limit,
            breakdown
        };
        const filterObject = this.filterFlag(flags.filter);
        const query = {
            breakdown: queryBreakdown,
            filter: filterObject
        };
        console.log(query);
        const response = await (0, request_1.metricsRequest)(MetricsBreakdown.operation, query, resource, flags);
        await this.printResponse(response);
    }
    conditionFlag(flag) {
        let condition;
        if (flag) {
            const eqi = flag.indexOf('=');
            if (eqi < 1)
                this.error(`Invalid condition flag: ${cli_core_1.clColor.msg.error(flag)}`, {
                    suggestions: [`Condition flag must be defined using the format ${cli_core_1.clColor.cli.value('name=value')}`]
                });
            // Condition name and value
            const name = flag.substring(0, eqi);
            if (!common_1.conditions.includes(name))
                this.error(`Invalid condition name: ${cli_core_1.clColor.msg.error(name)}`, {
                    suggestions: [`Condition name must be one of the following: ${cli_core_1.clColor.cli.value(common_1.conditions.join(', '))}`]
                });
            const value = flag.substring(eqi + 1, flag.length);
            const usi = name.indexOf('_');
            if (usi > 0) { // interval condition
                const values = value.split(',');
                if (values.length !== 2)
                    this.error(`Invalid condition value: ${cli_core_1.clColor.msg.error(value)}`, {
                        suggestions: [`Interval condition flag must be defined using the format ${cli_core_1.clColor.cli.value('name=from,to')}`]
                    });
                const from = values[0];
                const to = values[1];
                condition = { [name]: [from, to] };
            }
            else
                condition = { [name]: value };
        }
        return condition;
    }
}
exports.default = MetricsBreakdown;
