// Source: the official Entry 2.1.36 Windows x64 distribution, not a different ABI.
// Usage: node scripts/prepare-windows-native.js /path/to/official/resources/app.asar
const fs = require('fs');
const path = require('path');
const asar = require('asar');
const root = path.resolve(__dirname, '..');
const cache = path.join(root, '.cache', 'beomeo-windows-native');
const modules = [
    ['@serialport/bindings', 'build/Release/bindings.node'],
    ['node-hid', 'build/Release/HID.node'],
    ['@ffmpeg-installer/win32-x64', 'ffmpeg.exe'],
    ['@ffprobe-installer/win32-x64', 'ffprobe.exe'],
];

function seed(officialAsar) {
    const meta = JSON.parse(asar.extractFile(officialAsar, 'package.json'));
    if (meta.version !== '2.1.36') throw new Error('Expected official Entry 2.1.36');
    for (const [name, binary] of modules) {
        const pkgPath = `node_modules/${name}/package.json`;
        const bytes = asar.extractFile(officialAsar, path.normalize(pkgPath));
        const pkg = JSON.parse(bytes);
        const localPath = path.join(root, pkgPath);
        if (fs.existsSync(localPath) && JSON.parse(fs.readFileSync(localPath)).version !== pkg.version) {
            throw new Error(`Official/local package version mismatch: ${name}`);
        }
        const target = path.join(cache, name);
        fs.mkdirSync(path.dirname(path.join(target, binary)), { recursive: true });
        fs.writeFileSync(path.join(target, 'package.json'), bytes);
        fs.writeFileSync(path.join(target, binary), asar.extractFile(officialAsar,
            path.normalize(`node_modules/${name}/${binary}`)));
    }
    fs.writeFileSync(path.join(cache, 'source.json'), JSON.stringify({
        url: 'https://playentry.org/uploads/data/installers/Entry_2.1.36_Setup.exe',
        installerSha256: '64c04628a147f46b904602e0bffc3fecf8eddef764d1df8418c75741a88d0ab9',
        electron: '18.3.0', abi: 103, platform: 'win32', arch: 'x64',
    }, null, 2));
}

function apply() {
    const backups = [];
    // Validate the whole cache before changing the development installation.
    for (const [name, binary] of modules) {
        const source = path.join(cache, name);
        if (!fs.existsSync(path.join(source, binary))) {
            throw new Error('Prepare the official Windows binary cache first; see BEOMEO.md.');
        }
        const local = path.join(root, 'node_modules', name, 'package.json');
        if (fs.existsSync(local) && JSON.parse(fs.readFileSync(local)).version !==
            JSON.parse(fs.readFileSync(path.join(source, 'package.json'))).version) {
            throw new Error(`Cached/local package version mismatch: ${name}`);
        }
    }
    for (const [name, binary] of modules) {
        const source = path.join(cache, name);
        if (!fs.existsSync(path.join(source, binary))) {
            throw new Error('Prepare the official Windows binary cache first; see BEOMEO.md.');
        }
        const dest = path.join(root, 'node_modules', name);
        const target = path.join(dest, binary);
        if (fs.existsSync(target)) backups.push([target, fs.readFileSync(target)]);
        const metadata = path.join(dest, 'package.json');
        if (fs.existsSync(metadata)) backups.push([metadata, fs.readFileSync(metadata)]);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(path.join(source, 'package.json'), path.join(dest, 'package.json'));
        fs.copyFileSync(path.join(source, binary), target);
    }
    return () => backups.forEach(([file, bytes]) => fs.writeFileSync(file, bytes));
}

module.exports = { seed, apply };
if (require.main === module) {
    if (!process.argv[2]) throw new Error('Pass the official Windows resources/app.asar path.');
    seed(path.resolve(process.argv[2]));
    console.log('Cached matching official Windows x64 USB and media binaries.');
}
