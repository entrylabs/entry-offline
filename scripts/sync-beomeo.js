// Run after installing dependencies and building ../entryjs.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const workspace = path.dirname(root);
const entryjs = path.join(workspace, 'entryjs');
const hardware = path.join(workspace, 'entry-hw', 'app');
const targetJs = path.join(root, 'node_modules', 'entry-js');
const targetHw = path.join(root, 'node_modules', 'entry-hw', 'app');
const bundle = fs.readFileSync(path.join(entryjs, 'dist', 'entry.js'), 'utf8');
if (!bundle.includes('microbit2_get_ultrasonic')) {
    throw new Error('Build the custom EntryJS first: cd ../entryjs && pnpm run dist');
}
for (const target of [targetJs, targetHw]) {
    if (!fs.existsSync(target)) throw new Error(`Install offline dependencies first: ${target}`);
}
fs.cpSync(path.join(entryjs, 'dist'), path.join(targetJs, 'dist'), { recursive: true });
fs.copyFileSync(
    path.join(entryjs, 'src/playground/blocks/hardware/block_microbit2.js'),
    path.join(targetJs, 'src/playground/blocks/hardware/block_microbit2.js')
);
fs.copyFileSync(path.join(hardware, 'modules/microbit2.js'), path.join(targetHw, 'modules/microbit2.js'));
fs.copyFileSync(path.join(hardware, 'modules/microbit2.json'), path.join(targetHw, 'modules/microbit2.json'));
const hardwareRouter = path.join(hardware, 'src/main/mainRouter.build.js');
fs.copyFileSync(hardwareRouter, path.join(targetHw, 'src/main/mainRouter.build.js'));
fs.cpSync(path.join(hardware, 'src/renderer/react/dist'), path.join(targetHw, 'src/renderer/react/dist'), { recursive: true });
fs.copyFileSync(path.join(hardware, 'src/preload/preload.bundle.js'), path.join(targetHw, 'src/preload/preload.bundle.js'));
for (const file of ['MicrobitIdentity.exe', 'MicrobitIdentity.exe.config']) {
    const source = path.join(hardware, 'native', file);
    if (!fs.existsSync(source)) throw new Error('Build the Windows helper first: node ../entry-hw/cli/buildMicrobitIdentity.js');
    fs.mkdirSync(path.join(targetHw, 'native'), { recursive: true });
    fs.copyFileSync(source, path.join(targetHw, 'native', file));
}

fs.copyFileSync(path.join(hardware, 'firmwares/mircobit-beomeo.hex'), path.join(targetHw, 'firmwares/mircobit-beomeo.hex'));
console.log('Custom EntryJS, microbit2 transport and Beomeo firmware synced.');
