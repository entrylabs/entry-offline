import { app } from 'electron';
import { merge, reduce, toPairs } from 'lodash';
import path from 'path';
import fs from 'fs';
import createLogger from './createLogger';

const logger = createLogger('ConfigInitialize');

/**
 * 외부 config 파일이 존재하지 않는 경우의 기본값.
 */
const defaultConfigSchema: FileConfigurations = {
    updateCheckUrl: 'https://playentry.org',
    moduleResourceUrl: 'http://localhost:23518/modules',
    remoteModuleResourceUrl: 'http://playentry.org/modules',
};

export default (configName: string = 'ko'): Readonly<FileConfigurations> => {
    const configFilePath = path.join(app.getAppPath(), 'config', `config.${configName}.json`);

    logger.info(`load ${configFilePath}...`);

    if (!fs.existsSync(configFilePath)) {
        return defaultConfigSchema;
    }

    const fileData = fs.readFileSync(configFilePath) as any;
    const mergedConfig: FileConfigurations = merge(defaultConfigSchema, JSON.parse(fileData));

    logger.info(reduce(toPairs(mergedConfig), (result, [key, value]) =>
        `${result}\n${key}: ${value}`, 'config file configurations applied'));

    return mergedConfig;
};
