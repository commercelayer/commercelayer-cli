"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = require("../../base");
const request_1 = require("../../request");
const cli_core_1 = require("@commercelayer/cli-core");
const cliux = tslib_1.__importStar(require("@commercelayer/cli-ux"));
class MetricsFbt extends base_1.BaseCommand {
    static operation = 'fbt';
    static aliases = [MetricsFbt.operation];
    static description = 'perform a Frequently Bought Together query on the Metrics API analysis endpoint';
    static examples = [
        'commercelayer metrics:fbt --in xYZkjABcde,yzXKjYzaCx'
    ];
    static flags = {
        in: core_1.Flags.string({
            char: 'i',
            description: 'a list of SKU or bundle IDs associated as line items to one or more orders',
            required: false,
            multiple: true
        })
    };
    async run() {
        const { flags } = await this.parse(MetricsFbt);
        this.checkAcessTokenData(flags.accessToken, flags);
        const ids = this.multivalFlag(flags.in);
        const query = (ids.length > 0) ? {
            filter: {
                line_items: {
                    item_ids: {
                        in: ids
                    }
                }
            }
        } : {};
        const response = await (0, request_1.metricsRequest)(MetricsFbt.operation, query, undefined, flags);
        if (response.ok) {
            cliux.action.stop(cli_core_1.clColor.msg.success('Done'));
            const jsonRes = await response.json();
            const data = jsonRes.data;
            if (data?.length > 0)
                this.log(String(data));
            else
                this.log(cli_core_1.clColor.dim(String('\nNo data found for the given SKU or bundle IDs\n')));
        }
        else
            await this.printResponse(response);
    }
}
exports.default = MetricsFbt;
