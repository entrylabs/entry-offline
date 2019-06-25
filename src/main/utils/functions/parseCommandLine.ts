import { merge } from 'lodash';
import path from 'path';

const properties: {
    flag: [keyof CommandLineFlags, string][],
    pair: [keyof CommandLinePairs, any][],
} = {
    flag: [
        ['debug', 'd'],
        ['version', 'v'],
    ],
    pair: [
        ['file', 'app'],
        ['baseUrl', 'h'],
        ['config', 'c'],
    ],
};

const flags: CommandLineFlags = {};
const pairs: CommandLinePairs = {};

function parseFlags(key: string): boolean | void {
    for (let i = 0; i < properties.flag.length; i++) {
        const [fullName, alias] = properties.flag[i];
        if (`--${fullName}` === key || `-${alias}` === key) {
            flags[fullName as keyof CommandLineFlags] = true;
            return true;
        }
    }
}

function parsePair(key: string, value: string): boolean | void {
    if (!value) {
        return;
    }

    for (let i = 0; i < properties.pair.length; i++) {
        const [fullName, alias] = properties.pair[i];
        if (`--${fullName}` === key || `-${alias}` === key) {

            if (
                (fullName === 'file' || alias === 'app') &&
                !_isValidProjectFilePath(value as string)
            ) {
                continue;
            }
            pairs[fullName as keyof CommandLinePairs] = value;
            return true;
        }
    }
}

const _isValidProjectFilePath = function(filePath: string) {
    return path.isAbsolute(filePath) && path.extname(filePath) === '.ent';
};

export default (argv: string[]): CommandLineOptions => {
    for (const arg of argv) {
        const [key, value] = arg.split('=');
        const isFlagParsed = parseFlags(key);
        const isPairParsed = parsePair(key, value);
        if (!isFlagParsed && !isPairParsed) {
            if (_isValidProjectFilePath(arg)) {
                pairs.file = arg;
            }
        }
    }

    return merge(flags, pairs);
};
