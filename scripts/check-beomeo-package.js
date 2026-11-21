// Verify the delivered package, rather than just trusting builder configuration.
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const asar = require('asar');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const config = require('../electron-builder.beomeo.json');
const output = path.join(root, config.directories.output);
const archive = path.join(output, 'win-unpacked/resources/app.asar');
const read = name => asar.extractFile(archive, path.normalize(name));
const version = config.extraMetadata.version;
assert.equal(JSON.parse(read('package.json')).version, version);
for (const asset of ['src/main/mainRouter.build.js', 'src/preload/preload.bundle.js',
    'src/renderer/react/dist/main.build.js', 'native/MicrobitIdentity.exe', 'native/MicrobitIdentity.exe.config']) {
    assert(read(`node_modules/entry-hw/app/${asset}`).equals(
        fs.readFileSync(path.join(root, '../entry-hw/app', asset))), `Packaged asset mismatch: ${asset}`);
}
const router = read('node_modules/entry-hw/app/src/main/mainRouter.build.js').toString();
assert(router.includes('MicrobitIdentity.exe') && router.includes('microbit COM discovery'));
assert(!router.includes('Get-PnpDevice'));
for (const fixtureValue of ['COM74', 'E5DC3934', 'COM37', '828EF1B5']) {
    assert(!router.includes(fixtureValue), 'Diagnostic fixture must not become a runtime mapping');
}
const icon = fs.readFileSync(path.join(root, 'build/icon-beomeo.png'));
assert(read('src/main/static/icon-beomeo.png').equals(icon), 'Window icon differs from shared source');
const ico = fs.readFileSync(path.join(root, 'build/icon-beomeo.ico'));
assert(fs.readFileSync(path.join(output, 'win-unpacked/resources/beomeo-hot-pink.ico')).equals(ico),
    'Dedicated shortcut icon missing or stale');
assert.equal(config.nsis.shortcutName, '범어중엔트리');
assert.equal(config.nsis.createDesktopShortcut, 'always');
assert.equal(config.productName, '범어중엔트리');
const main = read('src/main_build/main.bundle.js').toString();
assert(main.includes('범어중엔트리 v0.9'), 'Branded window title/version missing');
const shortcutScript = fs.readFileSync(path.join(root, config.nsis.include), 'utf8');
assert(shortcutScript.includes('$INSTDIR\\resources\\beomeo-hot-pink.ico'));
const images = [];
assert.equal(ico.readUInt16LE(2), 1);
for (let i = 0; i < ico.readUInt16LE(4); i++) {
    const entry = 6 + i * 16;
    const width = ico[entry] || 256;
    const size = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    images.push({ width, bytes: ico.subarray(offset, offset + size) });
}
assert.deepEqual(images.map(item => item.width), [16, 24, 32, 48, 64, 128, 256]);
const executable = fs.readFileSync(path.join(output, 'win-unpacked/Entry Beomeo.exe'));
for (const image of images) assert(executable.includes(image.bytes), `EXE missing pink ${image.width}px icon`);
assert(executable.includes(Buffer.from(version, 'utf16le')), 'EXE version mismatch');
assert(executable.includes(Buffer.from('범어중엔트리', 'utf16le')), 'Windows executable display name mismatch');
if (!process.argv.includes('--app-only')) {
    const installer = fs.readFileSync(path.join(output, `Entry-Beomeo-${version}-x64-Setup.exe`));
    for (const width of [16, 32, 48]) {
        assert(installer.includes(images.find(item => item.width === width).bytes), `Installer missing pink ${width}px icon`);
    }
}
const helper = path.join(output, 'win-unpacked/resources/app.asar.unpacked/node_modules/entry-hw/app/native/MicrobitIdentity.exe');
const result = spawnSync(helper, [], { encoding: 'utf8', windowsHide: true, timeout: 15000, maxBuffer: 4 * 1024 * 1024 });
if (result.error) throw result.error;
assert.equal(result.status, 0, result.stderr);
const snapshot = JSON.parse(result.stdout.replace(/^\uFEFF/, '').trim());
assert.equal(snapshot.version, 1);
assert(Array.isArray(snapshot.nodes));
assert(Array.isArray(snapshot.registryIdentities), 'Registry identity helper missing');
console.log(`PASS: ${version} ${process.argv.includes('--app-only') ? 'app' : 'app/installer'} package, exact hardware/helper assets, pink icons, native helper (${snapshot.elapsedMs}ms)`);
