import { app, net } from 'electron';
import root from 'window-or-global';

export default () => new Promise((resolve, reject) => {
    const request = net.request({
        method: 'POST',
        host: root.sharedObject.hostURI,
        protocol: root.sharedObject.hostProtocol,
        path: '/api/checkVersion',
    });

    request.on('response', (res) => {
        let body = '';
        res.on('data', (chunk) => {
            body += chunk.toString();
        });
        res.on('end', () => {
            let data = {};
            try {
                data = JSON.parse(body);
            } catch (e) {
                console.log(e);
                reject(e);
            }
            resolve(data);
        });
    });
    request.on('error', (err) => {
        console.log(err);
    });
    request.setHeader('content-type', 'application/json; charset=utf-8');
    request.write(
        JSON.stringify({
            category: 'offline',
            version: app.getVersion(),
        }),
    );
    request.end();
});
