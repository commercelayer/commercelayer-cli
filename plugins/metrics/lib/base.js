"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flags = exports.Args = exports.BaseBreakdownCommand = exports.BaseResourceCommand = exports.BaseCommand = void 0;
const tslib_1 = require("tslib");
const sdk_1 = tslib_1.__importStar(require("@commercelayer/sdk"));
const core_1 = require("@oclif/core");
Object.defineProperty(exports, "Args", { enumerable: true, get: function () { return core_1.Args; } });
Object.defineProperty(exports, "Flags", { enumerable: true, get: function () { return core_1.Flags; } });
const cli_core_1 = require("@commercelayer/cli-core");
const common_1 = require("./common");
const cliux = tslib_1.__importStar(require("@commercelayer/cli-ux"));
const pkg = require('../package.json');
const REQUIRED_APP_KIND = cli_core_1.clConfig.metrics.applications;
class BaseCommand extends core_1.Command {
    static baseFlags = {
        organization: core_1.Flags.string({
            char: 'o',
            description: 'the slug of your organization',
            required: true,
            env: 'CL_CLI_ORGANIZATION',
            hidden: true
        }),
        domain: core_1.Flags.string({
            char: 'd',
            required: false,
            hidden: true,
            dependsOn: ['organization'],
            env: 'CL_CLI_DOMAIN'
        }),
        accessToken: core_1.Flags.string({
            char: 'a',
            description: 'custom access token to use instead of the one used for login',
            hidden: true,
            required: true,
            env: 'CL_CLI_ACCESS_TOKEN',
            dependsOn: ['organization']
        })
    };
    // INIT (override)
    async init() {
        cli_core_1.clUpdate.checkUpdate(pkg);
        return await super.init();
    }
    async catch(error) {
        return await this.handleError(error);
    }
    async handleError(error, flags) {
        if (sdk_1.CommerceLayerStatic.isApiError(error)) {
            if (error.status === 401) {
                const err = error.first();
                this.error(cli_core_1.clColor.msg.error(`${err.title}:  ${err.detail}`), { suggestions: ['Execute login to get access to the organization\'s resources'] });
            }
            else
                this.error(cli_core_1.clOutput.formatError(error, flags));
        }
        else
            return await super.catch(error);
    }
    commercelayerInit(flags) {
        const organization = flags.organization;
        const domain = flags.domain;
        const accessToken = flags.accessToken;
        const userAgent = cli_core_1.clUtil.userAgent(this.config);
        return (0, sdk_1.default)({
            organization,
            domain,
            accessToken,
            userAgent
        });
    }
    checkAcessTokenData(accessToken, flags) {
        const info = cli_core_1.clToken.decodeAccessToken(accessToken);
        if (info === null)
            this.error('Invalid access token provided');
        else if (!REQUIRED_APP_KIND.includes(info.application.kind)) // Application
            this.error(`Invalid application kind: ${cli_core_1.clColor.msg.error(info.application.kind)}. Only these access tokens can be used: [${REQUIRED_APP_KIND.join(', ')}]`);
        else if (info.organization?.slug !== flags.organization) // Organization
            this.error(`The access token provided belongs to a wrong organization: ${cli_core_1.clColor.msg.error(info.organization?.slug)} instead of ${cli_core_1.clColor.style.organization(flags.organization)}`);
        return true;
    }
    multivalFlag(flag) {
        const values = [];
        if (flag) {
            const flagValues = flag.map(f => f.split(',').map(t => t.trim()));
            flagValues.forEach(a => values.push(...a));
        }
        return values;
    }
    async printResponse(response) {
        if (cliux.action.running)
            cliux.action.stop(response.ok ? cli_core_1.clColor.msg.success('Done') : cli_core_1.clColor.msg.error('Error'));
        const jsonRes = await response.json();
        this.log();
        if (response.ok)
            this.log(cli_core_1.clOutput.formatOutput(jsonRes.data));
        else
            this.log(cli_core_1.clOutput.formatError(jsonRes));
        this.log();
    }
}
exports.BaseCommand = BaseCommand;
class BaseResourceCommand extends BaseCommand {
    static baseFlags = {
        ...BaseCommand.baseFlags,
        filter: core_1.Flags.string({
            char: 'F',
            description: 'the filter to apply to the query in JSON format (enclosed in single quotes)'
        })
    };
    static args = {
        resource: core_1.Args.string({ resource: 'the resource name', options: common_1.resources, required: true })
    };
    filterFlag(flag) {
        let filter;
        if (flag) {
            try {
                filter = JSON.parse(flag);
            }
            catch (error) {
                this.error(`Invalid ${cli_core_1.clColor.cli.flag('filter')} format. Please provide a valid JSON string`);
            }
        }
        return filter;
    }
}
exports.BaseResourceCommand = BaseResourceCommand;
class BaseBreakdownCommand extends BaseResourceCommand {
    static baseFlags = {
        ...BaseResourceCommand.baseFlags,
        by: core_1.Flags.string({
            char: 'b',
            description: 'the field you want the results of the query aggragated by',
            required: true
        }),
        field: core_1.Flags.string({
            char: 'f',
            description: 'the field you want the metrics or statistics computed on',
            required: true
        }),
        operator: core_1.Flags.string({
            char: 'O',
            aliases: ['op'],
            summary: 'the computing operator',
            description: 'the list of valid operators depends on the value of the field key',
            options: common_1.operators,
            required: true,
        }),
        breakdown: core_1.Flags.string({
            char: 'B',
            summary: 'the optional nested breakdown',
            description: 'a JSON object (enclosed in single quotes) containing the nested breakdown',
        })
    };
    static args = {
        ...BaseResourceCommand.args
    };
    breakdownFlag(flag) {
        let breakdown;
        if (flag) {
            try {
                breakdown = JSON.parse(flag);
            }
            catch (error) {
                this.error(`Invalid ${cli_core_1.clColor.msg.error('breakdown')} format. Please provide a valid JSON string`);
            }
        }
        return breakdown;
    }
}
exports.BaseBreakdownCommand = BaseBreakdownCommand;
