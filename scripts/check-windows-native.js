const fs = require('fs');
const path = require('path');

module.exports = async ({ packager }) => {
    const appDir = packager.info.appDir;
    const files = [
        'node_modules/@serialport/bindings/build/Release/bindings.node',
        'node_modules/node-hid/build/Release/HID.node',
        'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe',
        'node_modules/@ffprobe-installer/win32-x64/ffprobe.exe',
        'node_modules/entry-hw/app/native/MicrobitIdentity.exe',
    ];
    for (const file of files) {
        const bytes = fs.readFileSync(path.join(appDir, file));
        const pe = bytes.readUInt32LE(0x3c);
        if (bytes.toString('ascii', 0, 2) !== 'MZ' ||
            bytes.readUInt32LE(pe) !== 0x4550 || bytes.readUInt16LE(pe + 4) !== 0x8664) {
            throw new Error(`Windows x64 binary required: ${file}`);
        }
    }
    console.log('Verified Windows x64 USB and media binaries.');
};
