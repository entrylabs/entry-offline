const packager = require('electron-packager');
const { serialHooks } = require('electron-packager/hooks');
const path = require('path');
const fs = require('fs-extra');

const filesToDelete = [
    '.bowerrc',
    '.compilerc',
    '.gitignore',
    '.travis.yml',
    'appdmg.json',
    'appveyor.yml',
    'bower.json',
    'forge.config.js',
    'build',
];

packager({
    dir: 'src',
    icon: 'build/icon',
    asar: true,
    extendInfo: './build/build.plist',
    win32metadata: {
        CompanyName: 'EntryLabs',
        FileDescription: 'Entry Offline Version',
        OriginalFilename: 'Entry.exe',
        ProductName: 'Entry',
        InternalName: 'Entry',
    },
    osxSign: {
        identity:
            'Developer ID Application: Connect Foundation (DLFUSDA3L5)',
    },
    afterCopy: [
        (buildPath, electronVersion, platform, arch, callback) => {
            filesToDelete.forEach((filePath) => {
                console.log(buildPath, filePath);
                // fs.remove(path.join(buildPath, filePath));
            });
        },
    ],
    packageManager: 'yarn',
});
