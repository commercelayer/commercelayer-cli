import { BaseResourceCommand } from '../../base';
import type { MetricsOperation } from '../../common';
export default class MetricsStats extends BaseResourceCommand {
    static operation: MetricsOperation;
    static aliases: string[];
    static description: string;
    static examples: string[];
    static flags: {
        field: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        operator: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        description: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        resource: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
