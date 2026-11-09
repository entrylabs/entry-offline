const { spawnSync } = require('child_process');
const path = require('path');
const { apply } = require('./prepare-windows-native');
const root = path.resolve(__dirname, '..');
function run(script, args = [], env = {}) {
    const result = spawnSync(process.execPath, [script, ...args], {
        cwd: root, stdio: 'inherit', env: { ...process.env, ...env },
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Build failed: ${script} (${result.status})`);
}
const hardwareBuild = spawnSync(process.execPath, [
    'node_modules/webpack-cli/bin/cli.js', '--config', 'webpack/webpack.beomeo.config.js',
], {
    cwd: path.join(root, '../entry-hw'), stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', NODE_OPTIONS: '--openssl-legacy-provider' },
});
if (hardwareBuild.error) throw hardwareBuild.error;
if (hardwareBuild.status !== 0) throw new Error('Micro:bit-only hardware build failed.');
run('scripts/sync-beomeo.js');
run('scripts/check-beomeo.js');
run('node_modules/webpack-cli/bin/cli.js', [], {
    NODE_ENV: 'production', NODE_OPTIONS: '--openssl-legacy-provider',
});
const restore = apply();
try {
    run('node_modules/electron-builder/cli.js', [
        '--config', 'electron-builder.beomeo.json', '--win', '--x64', '--publish', 'never',
    ]);
} finally {
    restore();
}
