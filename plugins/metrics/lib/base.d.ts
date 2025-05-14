import { type CommerceLayerClient } from '@commercelayer/sdk';
import { Command, Args, Flags } from '@oclif/core';
import { type MetricsFilter, type MetricsQueryBreakdown } from './common';
export declare abstract class BaseCommand extends Command {
    static baseFlags: {
        organization: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        domain: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        accessToken: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
    };
    init(): Promise<any>;
    catch(error: any): Promise<any>;
    protected handleError(error: any, flags?: any): Promise<any>;
    protected commercelayerInit(flags: any): CommerceLayerClient;
    protected checkAcessTokenData(accessToken: string, flags?: any): boolean;
    protected multivalFlag(flag?: string[]): string[];
    protected printResponse(response: Response): Promise<void>;
}
export declare abstract class BaseResourceCommand extends BaseCommand {
    static baseFlags: {
        filter: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        organization: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        domain: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        accessToken: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
    };
    static args: {
        resource: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    protected filterFlag(flag?: string): MetricsFilter | undefined;
}
export declare abstract class BaseBreakdownCommand extends BaseResourceCommand {
    static baseFlags: {
        by: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        field: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        operator: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        breakdown: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        filter: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        organization: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        domain: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        accessToken: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
    };
    static args: {
        resource: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    protected breakdownFlag(flag?: string): MetricsQueryBreakdown | undefined;
}
export { Args, Flags };
