"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = require("../../base");
const common_1 = require("../../common");
const cliux = tslib_1.__importStar(require("@commercelayer/cli-ux"));
const cli_core_1 = require("@commercelayer/cli-core");
const request_1 = require("../../request");
class MetricsStats extends base_1.BaseResourceCommand {
    static operation = 'stats';
    static aliases = [MetricsStats.operation];
    static description = 'perform a stats query on the Metrics API endpoint';
    static examples = [
        'commercelayer metrics:stats orders -f order.total_amount_with_taxes --op avg',
        'cl stats orders -f order.total_amount_with_taxes -O stats'
    ];
    static flags = {
        field: core_1.Flags.string({
            char: 'f',
            description: 'the field you want the metrics or statistics computed on',
            required: true
        }),
        operator: core_1.Flags.string({
            char: 'O',
            aliases: ['op'],
            description: 'the computing operator',
            options: common_1.operators,
            required: true
        }),
        description: core_1.Flags.boolean({
            char: 'D',
            description: 'show the description of the operator used for the query',
            hidden: true
        }),
    };
    static args = {
        ...base_1.BaseResourceCommand.args
    };
    async run() {
        const { args, flags } = await this.parse(MetricsStats);
        this.checkAcessTokenData(flags.accessToken, flags);
        const resource = args.resource;
        const field = flags.field;
        const operator = flags.operator;
        const queryStats = {
            field,
            operator
        };
        const filterObject = this.filterFlag(flags.filter);
        const query = {
            stats: queryStats,
            filter: filterObject
        };
        const response = await (0, request_1.metricsRequest)(MetricsStats.operation, query, resource, flags);
        if (response.ok) {
            cliux.action.stop(cli_core_1.clColor.msg.success('Done'));
            const operatorInfo = common_1.operatorMap[operator];
            if (flags.description)
                this.log(cli_core_1.clColor.italic(`\n${operatorInfo.description}`));
            const func = `${cli_core_1.clColor.cyan(`${operator}(`)}${cli_core_1.clColor.italic(field)}${cli_core_1.clColor.cyan(')')}`;
            const jsonRes = await response.json();
            const value = jsonRes.data.value;
            this.log();
            if (operatorInfo.type === 'Object') {
                this.log(`${func} = {`);
                ['count', 'min', 'max', 'avg', 'sum'].forEach((op) => {
                    this.log(`  ${op.padStart(5, ' ')}: ${cli_core_1.clColor.yellow(value[op])}`);
                });
                this.log('}');
            }
            else
                this.log(`${func} = ${cli_core_1.clColor.yellow(value)}`);
            this.log();
        }
        else
            await this.printResponse(response);
    }
}
exports.default = MetricsStats;
