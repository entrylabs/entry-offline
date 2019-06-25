import { merge } from 'lodash';
import packageJson from '../../../../package.json';
import path from 'path';

// 입력받을 수 있는 값들
const properties: {
    flag: [keyof CommandLineFlags, string][],
    pair: [keyof CommandLinePairs, any][],
} = {
    flag: [
        ['debug', 'd'],
    ],
    pair: [
        ['version', 'v'],
        ['file', 'f'],
        ['baseUrl', 'h'],
        ['config', 'c'],
    ],
};

// 디폴트 값
const flags: CommandLineFlags = {};
const pairs: CommandLinePairs = {
    version: packageJson.version,
};

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

export default (argv: string[]): Readonly<CommandLineOptions> => {
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
