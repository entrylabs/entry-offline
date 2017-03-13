class Util {
    static test() {
        console.log(fs);
    }

    static saveFileDialog(source, name, callback) {
        dialog.showSaveDialog({
            title: Lang.Workspace.file_save,
            defaultPath: name,
        }, (target) => {
            this.copyFile(source, target, callback);
        });
    }

    static copyFile(source, target, callback) {
        let cbCalled = false;

        let sourcePath = source;

        if(!path.isAbsolute(source)) {
            sourcePath = path.resolve(__rendererPath, source);
        }

        const p = new Promise((resolve, reject)=> {
            var readStream = fs.createReadStream(sourcePath);
            readStream.on("error", reject);

            var writeStream = fs.createWriteStream(target);
            writeStream.on("error", reject);
            writeStream.on("close", resolve);
            readStream.pipe(writeStream);
        });

        p.then(()=> {
            callback();
        }).catch((e)=> {
            callback(e);
        });
    }
}

export default Util;
