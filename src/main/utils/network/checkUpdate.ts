import { net } from 'electron';
import createLogger from '../functions/createLogger';

const logger = createLogger('CheckUpdate');

type Response = { hasNewVersion: boolean, version: string };

export default (): Promise<Response> => new Promise((resolve, reject) => {
    const { updateCheckUrl, version } = global.sharedObject;

    const request = net.request({
        method: 'POST',
        url: updateCheckUrl,
    });

    const param = JSON.stringify({ category: 'offline', version });

    logger.info(`request url: ${updateCheckUrl} param: ${param}`);

    request.on('response', (res) => {
        let body = '';
        res.on('data', (chunk) => {
            body += chunk.toString();
        });
        res.on('end', () => {
            let data: Response = {
                hasNewVersion: false,
                version: '0.0.0',
            };
            try {
                data = JSON.parse(body) as Response;
                logger.info(`response : ${JSON.stringify(data)}`);
            } catch (e: any) {
                logger.error(`response json parse error, ${e.message}`);
                console.log(e);
            } finally {
                resolve(data);
            }
        });
    });
    request.on('error', (err) => {
        logger.error(`request error, ${err.name} ${err.message}`);
        resolve({
            hasNewVersion: false,
            version: '0.0.0',
        });
    });
    request.setHeader('content-type', 'application/json; charset=utf-8');
    request.write(param);
    request.end();
});
