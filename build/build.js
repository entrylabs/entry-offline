var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
	appName: '엔트리',
	appVersion: '0.1.0',
	version: '0.12.3',
    files: '../entry/**', // use the glob format
    platforms: ['osx64', 'win64'],
    winIco: '../entry/icon/app.ico',
    macIcns: '../entry/icon/app.icns',
});

//Log stuff you want

var max = 0;
nw.on('log',  function (log) {
	if(max < log.length) {
		max = log.length;
		console.log(max);
		console.log(log);
	}
});

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});