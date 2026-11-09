// electron-builder 22 sends UTF-8 NSIS scripts to stdin without declaring their
// encoding. On Korean Windows the NSIS default ACP cannot parse Korean product
// names. A UTF-8 BOM makes the bundled Unicode compiler detect the script format.
const { NsisTarget } = require('app-builder-lib/out/targets/nsis/NsisTarget');
const executeMakensis = NsisTarget.prototype.executeMakensis;
NsisTarget.prototype.executeMakensis = function(defines, commands, script) {
    return executeMakensis.call(this, defines, commands,
        script.charCodeAt(0) === 0xfeff ? script : '\uFEFF' + script);
};
require('electron-builder/cli.js');
