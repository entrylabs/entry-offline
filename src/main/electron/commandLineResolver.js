module.exports = function(args) {
    const option = {
        file: null,
        help: null,
        version: null,
        webdriver: null,
        modules: [],
        hostURI: 'playentry.org',
        hostProtocol: 'https:',
    };

    for (const argv of args) {
        if (argv === '--version' || argv === '-v') {
            option.version = true;
            break;
        } else if (argv.match(/^--app=/)) {
            option.file = argv.split('=')[1];
            break;
        } else if (argv === '--debug' || argv === '-d') {
            option.debug = true;
        } else if (argv.match(/^--host=/) || argv.match(/^-h=/)) {
            option.hostURI = argv.split('=')[1];
        } else if (argv.match(/^--protocol=/) || argv.match(/^-p=/)) {
            option.hostProtocol = argv.split('=')[1];
        } else {
            option.file = argv;
            break;
        }
    }
    return option;
}
