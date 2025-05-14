import { BaseCommand } from '../../base';
export default class MetricsFbt extends BaseCommand {
    static operation: string;
    static aliases: string[];
    static description: string;
    static examples: string[];
    static flags: {
        in: import("@oclif/core/lib/interfaces").OptionFlag<string[], import("@oclif/core/lib/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
