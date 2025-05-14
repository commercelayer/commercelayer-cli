"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const base_1 = require("../../base");
const common_1 = require("../../common");
const cli_core_1 = require("@commercelayer/cli-core");
const request_1 = require("../../request");
class MetricsSearch extends base_1.BaseResourceCommand {
    static operation = 'search';
    static aliases = [MetricsSearch.operation];
    static description = 'perform a search query on the Metrics API endpoint';
    static examples = [
        'commercelayewr metrics:search orders -l 5 -s asc -b order.placed_at -f order.id,order.number,order.placed_at,customer.email'
    ];
    static flags = {
        limit: core_1.Flags.integer({
            char: 'l',
            description: 'the maximum number of records shown in the response',
            min: 1,
            max: 100
        }),
        sort: core_1.Flags.string({
            char: 's',
            description: 'the way you want the results of the query to be sorted',
            options: common_1.sorts,
            dependsOn: ['sort_by']
        }),
        sort_by: core_1.Flags.string({
            char: 'b',
            description: 'the date field you want the results of the query sorted by'
        }),
        fields: core_1.Flags.string({
            char: 'f',
            description: 'comma-separated list of fields you want to be returned for each record in the response',
            required: true,
            multiple: true
        }),
        cursor: core_1.Flags.string({
            char: 'c',
            description: 'the cursor pointing to a specific page in the paginated search results'
        })
    };
    static args = {
        ...base_1.BaseResourceCommand.args
    };
    async run() {
        const { args, flags } = await this.parse(MetricsSearch);
        this.checkAcessTokenData(flags.accessToken, flags);
        const resource = args.resource;
        const fields = this.multivalFlag(flags.fields);
        const querySearch = {
            fields,
            limit: flags.limit,
            sort: flags.sort,
            sort_by: flags.sort_by,
            cursor: flags.cursor
        };
        const filterObject = this.filterFlag(flags.filter);
        const query = {
            search: querySearch,
            filter: filterObject
        };
        const response = await (0, request_1.metricsRequest)(MetricsSearch.operation, query, resource, flags);
        const res = response.clone();
        await this.printResponse(response);
        // Print pagination info
        if (res.ok) {
            const pagination = (await res.json()).meta.pagination;
            this.log(`Record count: ${cli_core_1.clColor.yellowBright(pagination.record_count)}`);
            if (pagination.cursor)
                this.log(`Cursor: ${cli_core_1.clColor.cyanBright(pagination.cursor)}`);
            this.log();
        }
    }
}
exports.default = MetricsSearch;
