import path from 'path';
import fs from 'fs';
import { dialog } from 'electron';
import FileUtils from '../main/fileUtils';

class CommonUtils {
    createFileId() {
        const randomStr = `${Math.random().toString(16)}000000000`.substr(2, 8);
        return require('crypto')
            .createHash('md5')
            .update(randomStr)
            .digest('hex');
    }

    /**
     * 4자리 랜덤값을 생성한다. 이 함수는 Entry.generateHash 와 완전동일하다.
     * Import 된 오브젝트를 엔트리 오브젝트 메타데이터로 만들 때 사용한다.
     * entryjs 의 해당 유틸함수 로직이 바뀌면 같이 바뀌어야 한다.
     *
     * @see Entry.generateHash
     * @return {string} 4자리 값
     */
    generateHash() {
        return Math.random()
            .toString(36)
            .substr(2, 4);
    }

    rename(source, target) {
        return new Promise((resolve, reject) => {
            fs.rename(source, target, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    showSaveDialog({ defaultPath, filters }) {
        return new Promise((resolve, reject) => {
            dialog.showSaveDialog(
                {
                    defaultPath,
                    filters,
                },
                (filePath) => {
                    if (filePath) {
                        resolve(filePath);
                    } else {
                        reject();
                    }
                }
            );
        });
    }
}

export default new CommonUtils();
