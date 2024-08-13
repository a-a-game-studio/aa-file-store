import * as util from 'util';
import * as fs from 'fs';

/**
 * Асинхронное чтение файла
 * @param sFileName
 */
export async function maReadFile(sFileName: string) {
    return util.promisify(fs.readFile)(sFileName);
}

/**
 * Асинхронное запись файла
 * @param sFileName
 */
export async function maWriteFile(sFileName: string, data: any, option?: fs.WriteFileOptions) {
    return util.promisify(fs.writeFile)(sFileName, data, option);
}

/**
 * Асинхронное создание папок
 * @param 
 */
export async function maMkDir(sPath: string, option: fs.MakeDirectoryOptions) {
    return util.promisify(fs.mkdir)(sPath, option);
}

/**
 * Проверка доступа к папке
 * @param 
 */
export async function maAccessDir(sPath: string) {
    return new Promise((resolve, reject) => {
        try {
            console.log('maAccessDir>>>', sPath)
            fs.access(sPath, (e) => {
                if (e) {
                    console.log(e.message);

                    if (e.code === 'ENOENT') {
                        console.log('The directory does not exist');
                        resolve(false);
                    }


                }
                resolve(true);
            });
        } catch (e) {
            console.log('maAccessDir>>>', e)
            resolve(false)
        }
    });

}