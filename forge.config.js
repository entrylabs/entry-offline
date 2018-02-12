(function(module) {
    const path = require('path');
    var fs = require('fs-extra');
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

    module.exports = {
        make_targets: {
            win32: ['zip'],
            darwin: ['dmg'],
        },
        electronPackagerConfig: {
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
                        fs.remove(path.join(buildPath, filePath));
                    });
                    callback();
                },
            ],
        },
        electronInstallerDMG: {
            name: 'Entry',
            title: 'Entry',
            contents: [
                {
                    x: 240,
                    y: 380,
                    type: 'link',
                    path: '/Applications',
                },
                {
                    x: 240,
                    y: 120,
                    type: 'file',
                    path: path.resolve(
                        __dirname,
                        'out',
                        'Entry-darwin-x64',
                        'Entry.app'
                    ),
                },
                {
                    x: 380,
                    y: 250,
                    type: 'file',
                    path: path.resolve(__dirname, 'src', 'README.md'),
                },
            ],
            icon: './build/icon.icns',
            background: './build/background.png',
            'icon-size': 80,
        },
    };
})(module);
