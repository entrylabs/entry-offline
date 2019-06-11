declare module 'puid' {
    type PuidOptions = boolean | string | PuidOption;
    interface PuidOption {
        nodeId ?: string;
        epoch ?: string;
    }
    interface PuidDefaultConfig {
        nlen: number; // machine identifier
        plen: number; // process id
        tlen: number; // timestamp length
        clen: number; // counter/hrtime
        epoch: string; // ex. "1999-06-07 03:00:00 pm GMT"
    }
    export default class Puid {
        new(): this;
        constructor(options?: PuidOptions);
        type: 'long' | 'short';
        config: PuidDefaultConfig;

        static nodeId: string;
        static generate(): string;
        static getTimestamp(): string;
        static getNanos(): string;
        static getNodeId(networkInterface: any, fallback: string): string;
        static getProcessId(): string;
        static getCounter(): string;
        static toBase36String(value: number, padding: number): string;
    }
}
