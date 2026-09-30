import { Command } from '@oclif/core';
export default class Noc extends Command {
    static hidden: boolean;
    static flags: {};
    run(): Promise<any>;
}
