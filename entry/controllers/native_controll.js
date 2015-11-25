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
var nwWindow = gui.Window.get();
// Create menu
var native_menu = new gui.Menu({
	type : 'menubar'
});

var shortCutObj = {};
if (process.platform === 'darwin') {
	isOsx = true;
	// create MacBuiltin
	native_menu.createMacBuiltin('Entry', {
		hideEdit : true,
		hideWindow : true
	});
} else {
	isOsx = false;
	
}

function makeNativeMenu(menus) {
	menus.forEach(function (menu, index) {
		var sub_menu = new gui.Menu();
		if(menu.sub) {
			menu.sub.forEach(function (menu_item, index) {
				var shortcut = {};
				if('shortcut' in menu_item) {
					$.each(Object.keys(menu_item.shortcut), function (idx, key) {
						if(isOsx && key === 'osx') {
							shortcut = menu_item.shortcut[key];
							return false;
						} else if(isOsx && key === 'win') {
							shortcut = menu_item.shortcut[key];
							return false;
						}
					});
				}

				var menu_scheme = {
					label : menu_item.label,
					click : menu_item.click,
					key: shortcut.key,
				  	modifiers: shortcut.modifiers
				};
				if(menu_item.type) {
					menu_scheme.type = menu_item.type;
				}
				sub_menu.append(new gui.MenuItem(menu_scheme));
			});
		}

		var click_fn = function () {};
		if($.isFunction(menu.click)) {
			click_fn = menu.click;
		}
		native_menu.append(new gui.MenuItem({
			label: menu.label,
			click : click_fn,
			submenu: sub_menu
		}));
	});
}

var menu_set = [{
	'label': Lang.Menus.offline_file,
	'sub': [{
		'label': Lang.Workspace.file_new,
		'click': function () {
			angular.element('[data-ng-controller="HeaderController"]').scope().newProject();
		},
		'shortcut' : {
			'osx' : {
				'key' : 'n',
				'modifiers' : 'cmd'	
			},
			'win' : {
				'key' : 'n',
				'modifiers' : 'ctrl'	
			}
		}
	}, {
		'label': Lang.Workspace.file_open,
		'click': function () {
			Entry.dispatchEvent('loadWorkspace');
		},
		'shortcut' : {
			'osx' : {
				'key' : 'o',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : 'o',
				'modifiers' : 'ctrl'	
			}
		}
	}, {
		'type': 'separator'
	}, {
		'label': Lang.Workspace.file_save,
		'click': function () {
			Entry.dispatchEvent('saveWorkspace');
		},
		'shortcut' : {
			'osx' : {
				'key' : 's',
				'modifiers' : 'cmd'
			},
			'win' : {
				'key' : 's',
				'modifiers' : 'ctrl'	
			}
		}
	}, {
		'label': Lang.Workspace.file_save_as,
		'click': function () {
			Entry.dispatchEvent('saveAsWorkspace');
		},
		'shortcut' : {
			'osx' : {
				'key' : 's',
				'modifiers' : 'cmd + shift'
			},
			'win' : {
				'key' : 's',
				'modifiers' : 'ctrl + shift'	
			}
		}
	}]		
}, {
	'label': Lang.Menus.offline_edit,
	'sub': [{
		'label': Lang.Menus.offline_undo,
		'click': function () {
			Entry.dispatchEvent('undo');
		},
		'shortcut' : {
			'osx' : {
				'key' : 'z',
				'modifiers' : 'cmd'	
			},
			'win' : {
				'key' : 'z',
				'modifiers' : 'ctrl'	
			}
		}
	}, {
		'label': Lang.Menus.offline_redo,
		'click': function () {
			Entry.dispatchEvent('redo');
		},
		'shortcut' : {
			'osx' : {
				'key' : 'z',
				'modifiers' : 'cmd + shift'
			},
			'win' : {
				'key' : 'y',
				'modifiers' : 'ctrl'	
			}
		}
		
	}]		
}];

if(!isOsx) {
	var window_menu = [{
		'type': 'separator'
	}, {
		'label': Lang.Menus.offline_quit,
		'click': function () {
			gui.App.quit();
		},
		'shortcut' : {
			'win' : {
				'key' : 'x',
				'modifiers' : 'ctrl'
			}
		}
		
	}];

	var about_menu = {
		'label': '도움말',
		'sub': [{
			'label': 'about',
			'click': function () {
				Entry.plugin.openAboutPage();
			}
		}]
	};
	menu_set.push(about_menu);

	menu_set[0].sub = menu_set[0].sub.concat(window_menu);
}

makeNativeMenu(menu_set);
// Append Menu to Window
gui.Window.get().menu = native_menu;


var _real_path = '.';
var _real_path_with_protocol = '';

console.log = function () {};
console.debug = function () {};
console.warn = function () {};
console.error = function () {};

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

	that.findObject = function (object, key) {
		var r = [];
		Object.keys(object).forEach(function (item_key) {
			if($.isPlainObject(object[item_key])) {
				r = r.concat(that.findObject(object[item_key], key));
			} else {
				if(object[item_key].indexOf(key) >= 0) {
					var a = {};
					a[item_key] = object[item_key];
					r.push(a);
				}
			}
		});
		return r;
	};

	var popup = null;
	that.openAboutPage = function () {
		if(popup)
			popup.close(true);
		popup = gui.Window.open('./views/about.html', {
			toolbar: false,
			width: 300,
			height: 180,
			max_width: 300,
			max_height: 180,
			min_width: 300,
			min_height: 180,
		});

		popup.setAlwaysOnTop(true);

		// Release the 'win' object here after the new window is closed.
		popup.on('closed', function() {
		    popup = null;
		});

		  // Listen to main window's close event
		gui.Window.get().on('close', function() {
		    // Hide the window to give user the feeling of closing immediately
		    this.hide();

		    // If the new window is still open then close it.
		    if (popup != null)
		        popup.close(true);

		    // After closing the new window, close the main window.
		    this.close(true);
		});
	}

	that.init = function (cb) {
		// NanumBarunGothic 폰트 로딩 시간까지 기다린다.
		var font = new FontFace("nanumBarunRegular", "url(./fonts/NanumBarunGothic.woff2)");
		font.load();
		font.loaded.then(function() {
			var isNotFirst = sessionStorage.getItem('isNotFirst');
				if(!isNotFirst) {
					that.initProjectFolder(function() {
						sessionStorage.setItem('isNotFirst', true);
					});
				}
			if(gui.App.argv.length > 0 && !isNotFirst) {
				if(gui.App.argv[0] !== '.') {
					var load_path = gui.App.argv[0];
					var pathArr = load_path.split('/');
					pathArr.pop();
					localStorage.setItem('defaultPath', pathArr.join('/'));

					that.loadProject(load_path, function (data) {
						console.log(data);
						var jsonObj = JSON.parse(data);
						jsonObj.path = load_path;
						localStorage.setItem('nativeLoadProject', JSON.stringify(jsonObj));
						if($.isFunction(cb)) {
							cb();
						}
					});
				} else {
					if($.isFunction(cb)) {
						cb();
					}
				}
			} else {
				if($.isFunction(cb)) {
					cb();
				}
			}
		});
		
	}

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

						var dimensions = sizeOf(dest.imagePath + '.png');
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