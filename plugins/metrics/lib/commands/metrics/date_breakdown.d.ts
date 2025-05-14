import { BaseBreakdownCommand } from '../../base';
export default class MetricsDateBreakdown extends BaseBreakdownCommand {
    static operation: string;
    static aliases: string[];
    static description: string;
    static examples: string[];
    static flags: {
        interval: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
    };
    static args: {
        resource: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
