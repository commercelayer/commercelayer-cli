import { BaseBreakdownCommand } from '../../base';
import type { MetricsCondition, MetricsOperation } from '../../common';
export default class MetricsBreakdown extends BaseBreakdownCommand {
    static operation: MetricsOperation;
    static aliases: string[];
    static description: string;
    static examples: string[];
    static flags: {
        condition: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        sort: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        limit: import("@oclif/core/lib/interfaces").OptionFlag<number | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
    };
    static args: {
        resource: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
    protected conditionFlag(flag?: string): MetricsCondition | undefined;
}
