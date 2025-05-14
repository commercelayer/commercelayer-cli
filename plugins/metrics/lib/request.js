"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsRequest = metricsRequest;
const tslib_1 = require("tslib");
const cli_core_1 = require("@commercelayer/cli-core");
const common_1 = require("./common");
const cliux = tslib_1.__importStar(require("@commercelayer/cli-ux"));
async function metricsRequest(operation, query, resource, flags) {
    console.log();
    cliux.action.start(`Performing ${cli_core_1.clColor.yellow(operation)} operation ${resource ? `on ${cli_core_1.clColor.api.resource(resource)}` : ''}`);
    const baseUrl = cli_core_1.clApi.baseURL('metrics', flags.organization, flags.domain);
    const analysisPath = common_1.analysisOperations.includes(operation) ? 'analysis/' : '';
    const resourcePath = resource ? `${resource}/` : '';
    const endpoint = `${baseUrl}/${cli_core_1.clConfig.metrics.default_path}/${resourcePath}${analysisPath}${operation}`;
    const body = JSON.stringify(query);
    const headers = {
        'Accept': 'application/vnd.api.v1+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${flags.accessToken}`
    };
    const response = fetch(endpoint, {
        method: "POST",
        headers,
        body
    });
    return await response;
}
