const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = async(targetDirPath) => {
    const asarFilePath = path.resolve(targetDirPath, 'app.asar');
    if (!fs.existsSync(asarFilePath)) {
        console.warn('target file not found. checked path is ', asarFilePath);
        return;
    }

    try {
        const digest = await new Promise((resolve, reject) => {
            const checksum = crypto.createHash('sha1');
            const readStream = fs.createReadStream(asarFilePath);
            readStream.on('data', (data) => {
                checksum.update(data);
            });
            readStream.on('end', () => {
                resolve(checksum.digest('hex'));
            });
            readStream.on('error', (e) => {
                reject(e);
            });
        });

        return digest;
    } catch (e) {
        console.error('error occurred while read stream ', e);
    }
};
