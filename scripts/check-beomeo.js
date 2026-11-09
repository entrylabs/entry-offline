const assert = require('assert').strict;
const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '..');
const config = require(path.join(root, 'node_modules/entry-hw/app/modules/microbit2.json'));
for (const asset of ['src/main/mainRouter.build.js', 'src/preload/preload.bundle.js', 'src/renderer/react/dist/main.build.js']) {
    assert(fs.readFileSync(path.join(root, 'node_modules/entry-hw/app', asset))
        .equals(fs.readFileSync(path.join(root, '../entry-hw/app', asset))), `Hardware asset not synced: ${asset}`);
}

const customFirmware = config.firmware.find(item => item.translate === 'Microbit V2 범어중');
assert(customFirmware);
assert.equal(customFirmware.type, 'copy');
assert(fs.readFileSync(path.join(root, 'node_modules/entry-hw/app/firmwares', `${customFirmware.name}.hex`))
    .equals(fs.readFileSync(path.join(root, '../entry-hw/app/firmwares/mircobit-beomeo.hex'))));
class AsyncError extends Error {}
global.Entry = {
    Utils: { AsyncError },
    engine: { isState: () => true },
    hw: { update() {} },
};
const colors = { HARDWARE: '#000', TRANSPARENT: 'transparent' };
global.EntryStatic = { colorSet: { block: { default: colors, darken: colors }, arrow: { default: colors }, common: colors } };
global.Lang = { template: {}, Blocks: {} };
const board = require(path.join(root, 'node_modules/entry-js/src/playground/blocks/hardware/block_microbit2.js'));
const hw = require(path.join(root, 'node_modules/entry-hw/app/modules/microbit2.js'));
const block = board.getBlocks().microbit2_get_ultrasonic;
assert(board.blockMenuBlocks.includes('microbit2_get_ultrasonic'));
assert(board.getBlocks().microbit2_set_led);
assert.deepEqual(block.def.params, [8, 12]);
for (const lang of ['ko', 'en', 'jp']) {
    assert(board.setLanguage()[lang].template.microbit2_get_ultrasonic);
}
assert.equal(hw.requestInitialData(), 'localdata;\r\n');
assert(hw.checkInitialData('localdata;2.0 20230216'));
hw.setSocket({ send: data => board.afterReceive(data) });
Entry.hw.update = () => hw.handleRemoteData({ read: key => Entry.hw.sendQueue[key] });
const script = { entity: { id: 'distance-test' }, getValue: key => ({ TRIG: 8, ECHO: 12 })[key] };
for (const value of [25.7, -1, 13.2]) {
    assert.throws(() => block.func(null, script), AsyncError);
    assert.equal(hw.requestLocalData(), 'get-ultrasonic;8;12\r\n');
    assert.equal(hw.requestLocalData(), 'localdata;\r\n');
    hw.handleLocalData(`get-ultrasonic;${value}`);
    assert.equal(block.func(null, script), value);
    assert.equal(hw.requestLocalData(), 'localdata;\r\n');
}
console.log('PASS: block registration, existing LED block, languages, default pins, handshake, repeated request/response and -1 result.');
