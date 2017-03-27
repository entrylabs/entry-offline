(function(module) {
    const path = require('path');

    module.exports = {
        'make_targets': {
            'win32': [
                'zip'
            ],
            'darwin': [
                'dmg'
            ]
        },
        'electronPackagerConfig': {
            'icon': 'build/icon',
            'asar': true,
            'extendInfo': './build/build.plist',
            'win32metadata': {
                'CompanyName': 'EntryLabs',
                'FileDescription': 'Entry Offline Version',
                'OriginalFilename': 'Entry.exe',
                'ProductName': 'Entry',
                'InternalName': 'Entry'
            }
        },
        'electronInstallerDMG': {
            'name': 'Entry',
            'title': 'Entry',
            'contents': [{
                'x': 240,
                'y': 380,
                'type': 'link',
                'path': '/Applications'
            }, {
                'x': 240,
                'y': 120,
                'type': 'file',
                'path': path.resolve(__dirname, 'out', 'Entry-darwin-x64', 'Entry.app'),
            }, {
                'x': 380,
                'y': 250,
                'type': 'file',
                'path': path.resolve(__dirname, 'src', 'README.md'),
            }],
            'osxSign': {
                'identity': 'Entry Education Laboratory INC.'
            },
            'icon': './build/icon.icns',
            'background': './build/background.png',
            'icon-size': 80
        }
    };
}(module));
