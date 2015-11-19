'use strict';

var fs = require('fs');
var sizeOf = require('image-size');
var path = require('path');
var Q = require('q');
var gui = require('nw.gui');
var isOsx = false;
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');

// Create menu
var menu = new gui.Menu({
	type : 'menubar'
});

var shortCutObj = {};
if (process.platform === 'darwin') {
	isOsx = true;
	// create MacBuiltin
	menu.createMacBuiltin('Entry', {
		hideEdit : true,
		hideWindow : true
	});
	shortCutObj = {
		'newProject' : {
			'key' : 'n',
			'modifiers' : 'cmd'
		},
		'loadWorkspace' : {
			'key' : 'o',
			'modifiers' : 'cmd'
		},
		'saveWorkspace' : {
			'key' : 's',
			'modifiers' : 'cmd'
		},
		'saveAsWorkspace' : {
			'key' : 's',
			'modifiers' : 'cmd + shift'
		},
		'undo' : {
			'key' : 'z',
			'modifiers' : 'cmd'
		},
		'redo' : {
			'key' : 'z',
			'modifiers' : 'cmd + shift'
		}
	}
} else {
	isOsx = false;
	shortCutObj = {
		'newProject' : {
			'key' : 'n',
			'modifiers' : 'ctrl'
		},
		'loadWorkspace' : {
			'key' : 'o',
			'modifiers' : 'ctrl'
		},
		'saveWorkspace' : {
			'key' : 's',
			'modifiers' : 'ctrl'
		},
		'saveAsWorkspace' : {
			'key' : 's',
			'modifiers' : 'ctrl + shift'
		},
		'undo' : {
			'key' : 'z',
			'modifiers' : 'ctrl'
		},
		'redo' : {
			'key' : 'y',
			'modifiers' : 'ctrl'
		},
		'quit' : {
			'key' : 'x',
			'modifiers' : 'ctrl'
		}
	}
}
// Create file-menu
var fileMenu = new gui.Menu();
// Create edit-menu
var editMenu = new gui.Menu();

fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_new,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().newProject();
	},
	key: shortCutObj.newProject.key,
  	modifiers: shortCutObj.newProject.modifiers
}));
fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_open,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().loadWorkspace();
	},
	key: shortCutObj.loadWorkspace.key,
  	modifiers: shortCutObj.loadWorkspace.modifiers
}));
fileMenu.append(new gui.MenuItem({
	type : 'separator'
}));
fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_save,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().saveWorkspace();
	},
	key: shortCutObj.saveWorkspace.key,
  	modifiers: shortCutObj.saveWorkspace.modifiers
}));
fileMenu.append(new gui.MenuItem({
	label : Lang.Workspace.file_save_as,
	click : function () {
		angular.element('[data-ng-controller="HeaderController"]').scope().saveAsWorkspace();
	},
	key: shortCutObj.saveAsWorkspace.key,
  	modifiers: shortCutObj.saveAsWorkspace.modifiers
}));
if(!isOsx) {
	fileMenu.append(new gui.MenuItem({
		type : 'separator'
	}));
	fileMenu.append(new gui.MenuItem({
		label : '종료',
		click : function () {
			gui.App.quit();
		},
		key: shortCutObj.quit.key,
	  	modifiers: shortCutObj.quit.modifiers
	}));
}

editMenu.append(new gui.MenuItem({
	label : '되돌리기',
	click : function () {
		Entry.dispatchEvent('undo');
	},
	key: shortCutObj.undo.key,
  	modifiers: shortCutObj.undo.modifiers
}));

editMenu.append(new gui.MenuItem({
	label : '다시실행',
	click : function () {
		Entry.dispatchEvent('redo');
	},
	key: shortCutObj.redo.key,
  	modifiers: shortCutObj.redo.modifiers
}));

// Append MenuItem as a Submenu
menu.append(new gui.MenuItem({
	label : '파일',
	submenu : fileMenu
}));
menu.append(new gui.MenuItem({
	label : '편집',
	submenu : editMenu
}));

// Append Menu to Window
gui.Window.get().menu = menu;


var _real_path = '.';
var _real_path_with_protocol = '';

console.log = function () {};
console.debug = function () {};
console.warn = function () {};
console.error = function () {};

// {
// 	var _app_path = process.execPath.split('.app')[0];
// 	var _path_set = _app_path.split('/');
// 	_path_set.pop();
// 	_real_path = _path_set.join('/');
// 	_real_path_with_protocol = 'file://' + _real_path;
// }

// plugin
Entry.plugin = (function () {
	var that = {};

	var TARGET_SIZE = 960;
	var THUMB_SIZE = 96;

	var getUploadPath = function(fileId, option) {
		
		console.log('file id : ' + fileId);
		if(option === undefined) {
			option = 'image';
			console.log("option : " + option);
		} 

	    // prepare upload directory
	    var baseDir = _real_path + '/temp';
	    var uploadDir = path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2));

	    if (!fs.existsSync(path.join(baseDir, fileId.substr(0,2))))
	        fs.mkdirSync(path.join(baseDir, fileId.substr(0,2)));

	    if (!fs.existsSync(path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2))))
	        fs.mkdirSync(path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2))); // uploadDir

	    if (!fs.existsSync(path.join(uploadDir, 'thumb')))
	        fs.mkdirSync(path.join(uploadDir, 'thumb'));

	    if (!fs.existsSync(path.join(uploadDir, 'image')))
	        fs.mkdirSync(path.join(uploadDir, 'image'));	

	    //Path of upload folder where you want to upload fies/
	    if(option === 'image') {
			var thumbPath = path.join(uploadDir, 'thumb', fileId); // thumbnail
	    	var imagePath = path.join(uploadDir, 'image', fileId); // main image
		} else if(option === 'sound') {
			if (!fs.existsSync(path.join(uploadDir, 'sound')))
				fs.mkdirSync(path.join(uploadDir, 'sound'));
			
			var soundPath = path.join(uploadDir, 'sound'); // for sound file
		}

	    var baseUrl = path.join(fileId.substr(0,2) + '/' + fileId.substr(2,2)); // uploads/xx/yy/[tmp/thumb/image]/[hashkey].png

	    return {
	        uploadDir: uploadDir,
	        thumbPath: thumbPath,
	        imagePath: imagePath,
			soundPath: soundPath,
	        baseUrl: baseUrl
	    }

	};

	var deleteFolderRecursive = function(path) {
		if( fs.existsSync(path) ) {
		    fs.readdirSync(path).forEach(function(file,index){
			    var curPath = path + "/" + file;
			    if(fs.lstatSync(curPath).isDirectory()) { // recurse
			        deleteFolderRecursive(curPath);
			    } else { // delete file
			        fs.unlinkSync(curPath);
			    }
		    });
		    fs.rmdirSync(path);
		}
	};

	var createFileId = function() {
		var randomStr = (Math.random().toString(16)+"000000000").substr(2,8);
	    return require('crypto').createHash('md5').update(randomStr).digest("hex");
	};

	// 프로젝트 저장 
	that.saveProject = function(path, data, cb, enc) {
		var string_data = JSON.stringify(data);
		that.mkdir(_real_path + '/temp', function () {
			fs.writeFile(_real_path + '/temp/project.json', string_data, enc || 'utf8', function (err) {
				if(err) {
					throw err;
				}

				var fs_reader = fstream.Reader({ 'path': _real_path + '/temp/', 'type': 'Directory' });

				var fs_writer = fstream.Writer({ 'path': path, 'type': 'File' });

				fs_writer.on('entry', function () {
					// console.log('entry');
				});
				fs_writer.on('end', function () {
					
					if($.isFunction(cb)){
						cb();
					}
				});

				fs_reader.pipe(tar.Pack()) 
					.pipe(zlib.Gzip())
					.pipe(fs_writer)

			});
		});		
	}

	// 프로젝트 불러오기
	that.loadProject = function(path, cb, enc) {
		deleteFolderRecursive(_real_path + '/temp/');

		var fs_reader = fstream.Reader({ 'path': path, 'type': 'File' });
		var fs_writer = fstream.Writer({ 'path': _real_path, 'type': 'Directory' });

		fs_writer.on('entry', function () {
			// console.log('entry');
		});
		fs_writer.on('end', function () {
			fs.readFile(_real_path + '/temp/project.json', enc || 'utf8', function (err, data) {
				if(err) {
					throw err;
				}

				if($.isFunction(cb)) {
					cb(data);
				}
			});
		});

		fs_reader.pipe(zlib.Gunzip())
			.pipe(tar.Parse())
			.pipe(fs_writer);
	}

	that.initProjectFolder = function (cb) {
		deleteFolderRecursive(_real_path + '/temp/');
		that.mkdir(_real_path + '/temp/', function () {
			if($.isFunction(cb)) {
				cb();
			};
		});
	};


	// 파일 저장
	that.writeFile = function(path, data, cb, enc) {
		fs.writeFile(path, data, enc || 'utf8', function (err) {
			if(err) {
				throw err;
			}

			if($.isFunction(cb)) {
				cb();
			}
		});
	}

	// 파일 열기
	that.readFile = function(path, cb, enc) {
		fs.readFile(path, enc || 'utf8', function (err, data) {
			if(err) {
				throw err;
			}

			if($.isFunction(cb)) {
				cb(data);
			}
		});
	}

	that.mkdir = function(path, cb) {
		fs.access(path, function (err, files) {
			if(err){
				fs.mkdir(path, function (err) {
					if(err) {
						throw err;
					}

					if($.isFunction(cb)) {
						cb();
					}
				});
			} else {
				if($.isFunction(cb)) {
					cb();
				}
			}
		})
	}

	//임시 이미지 저장
	that.saveTempImageFile = function (data, cb) {
	    var fileId = createFileId();
		var dest = getUploadPath(fileId);
		that.mkdir(dest.uploadDir + '/image', function () {
			fs.writeFile(dest.imagePath + '.png', data.org, { encoding: 'base64' }, function (err) {
				that.mkdir(dest.uploadDir + '/thumb', function () {
					fs.writeFile(dest.thumbPath + '.png', data.thumb, { encoding: 'base64' }, function (err) {
						if(err) {
							throw err;
						}

						var dimensions = sizeOf('./' + dest.imagePath);
						var picture = {
							type : 'user',
							name : fileId,
							filename : fileId,
							fileurl : encodeURI(dest.imagePath + '.png'),
							dimension : dimensions
						}
						
						if($.isFunction(cb)) {
							cb(picture);
						}
					});
				});
			});
		});
	}

	that.getResizeImageFromBase64 = function (image, canvas, max_size) {
        var tempW = image.width;
        var tempH = image.height;
        if (tempW > tempH) {
            if (tempW > max_size) {
               tempH *= max_size / tempW;
               tempW = max_size;
            }
        } else {
            if (tempH > max_size) {
               tempW *= max_size / tempH;
               tempH = max_size;
            }
        }
        
        canvas.width = tempW;
        canvas.height = tempH;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, tempW, tempH);
        
        return canvas.toDataURL().split(',')[1];
    }

	that.uploadTempImageFile = function (images, cb) {
		var images_cnt = images.length;
		var run_cnt = 0;
		var pictures = [];
		images.forEach(function (url, index) {
			var fileId = createFileId();
			var dest = getUploadPath(fileId);
			var url_split = url.split('/');
			var extension = '.' + url_split[url_split.length-1].split('.')[1];
			var file_name = url_split[url_split.length-1].split('.')[0];
			var imagePath = dest.imagePath + extension;
			var fs_reader = fs.createReadStream(url);
			var fs_writer = fs.createWriteStream(imagePath);
			
			that.mkdir(dest.uploadDir + '/image', function () {
				fs.readFile(url, function (err, stream) {
					fs.writeFile(imagePath, stream, function (err) {
						if(err) {
							throw err;
						}
						var image = new Image();
						image.src = imagePath;
						image.onload = function () {
							var canvas = document.createElement('canvas');
			        		canvas.width = image.width;
			        		canvas.height = image.height;
					    	var ctx = canvas.getContext("2d");
					    	ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					    	var thumb = that.getResizeImageFromBase64(image, canvas, THUMB_SIZE);

					    	fs.writeFile(dest.thumbPath + extension, thumb, { encoding: 'base64' }, function (err) {
								if(err) {
									throw err;
								}

								var dimensions = sizeOf(imagePath);
								var picture = {
									_id : Entry.generateHash(),
									type : 'user',
									name : file_name,
									filename : fileId,
									fileurl : encodeURI(imagePath),
									dimension : dimensions
								}

								pictures.push(picture);

								if($.isFunction(cb) && ++run_cnt === images_cnt) {
									cb(pictures);
								}
							});
						};
					});
				});
			});

		});
	};
	
	//사운드 파일 로컬 업로드
	that.uploadTempSoundFile = function (files, cb) {
	    var sounds_cnt = files.length;
		var run_cnt = 0;
		var soundList = [];
		console.log("file list : " + JSON.stringify(files));
		for(var key in files) {
			console.log("index : " + key);
			if(key === 'length')
				break;
			console.log("file length : " + files.length);
			if(files.hasOwnProperty(key)) {
				var data = files[key];
				var src = data.path;
				var fileId = createFileId();
				var dest = getUploadPath(fileId, 'sound');
				var name = data.name;
				
				console.log("name : " + name);
				var fileName = fileId;
				var extension = name.split('.')[1];
				var dirPath = dest.soundPath;
				var soundPath = dirPath + '/' + fileName + "." + extension;
				
				console.log("dest sound path : " + dest.soundPath);
				//var fs_reader = fs.createReadStream(url);
				//var fs_writer = fs.createWriteStream(soundPath);
				
				that.mkdir(dest.uploadDir + '/sound', function () {
					fs.readFile(src, function (err, stream) {
						fs.writeFile(soundPath, stream, 'utf8', function (err) {
							if(err) {
								throw err;
							}


							var audio = new Audio();
							audio.src = soundPath;
							audio.addEventListener('canplaythrough', function() { 
							   console.log(audio);
								var sound = {
									_id : Entry.generateHash(),
									type : 'user',
									name : name.split('.')[0],
									filename : fileName,
									ext : extension,
									path : soundPath,
									fileurl : soundPath,
									duration : Math.round(audio.duration * 10) / 10
								}
								
								// probe(soundPath, function(err, probeData) {
	   				// 				var probeDuration = (probeData.streams[0].duration).toFixed(1).toString();
								// 	console.log("duration info inside : " +  probeDuration);
								// 	sound.duration = probeDuration;
									
								// });	
		
								soundList.push(sound);
		
								if($.isFunction(cb) && ++run_cnt === sounds_cnt) {
										cb(soundList);
								}
							}, false);
						});
					});
				});
			}
		}
	}
	

	that.getRealPath = function (path, cb) {
		var cache = {};
		fs.realpath(path, function (err, resolvedPath) {
			if (err) throw err;
			console.log(resolvedPath);
			if($.isFunction(cb)) {
			  	cb(resolvedPath);
			}
		});
	}

	that.testPath = function() {
		that.getRealPath('./');
	}
	
	return that;
})();