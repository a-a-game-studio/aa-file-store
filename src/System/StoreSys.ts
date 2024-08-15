
import ip from 'ip'
import { db } from './DBConnect';
import { v4 as uuidv4 } from 'uuid';
import { mFormatDateTime } from '../Helper/DateTimeH';
import _, { now, NumericDictionaryIterateeCustom } from 'lodash';
import { SetI } from '../interface/CommonI';
import * as conf from '../Config/MainConfig'
import { Knex } from 'knex';
import { setInterval } from 'timers';
import { maAccessDir, maMkDir, maReadFile, maWriteFile } from '../Helper/FileH';
import { mRandomInteger } from '../Helper/NumberH';
import * as fs from 'fs';
import md5 from 'md5';


/** Система очередей */
export class StoreSys {

    /** Поместить значение в очередь */
    public async set(input: { backet: string, key?: string }, data: Buffer): Promise<any> {

        if (!input.key) {
            input.key = uuidv4();
        }

        let aDir = [input.backet, mRandomInteger(1, 999), mRandomInteger(1, 999), mRandomInteger(1, 999)];
        const sFile = uuidv4();
        const sHash1 = md5(data);
        const iLenFile = data.length;
        let sHash2 = '';
        for (let i = 1; i < 10; i++) {
            // console.log('data.length', data.length);
            sHash2 += String(data[Math.floor(data.length * (i * 0.1))]);
        }
        const sHash = sHash1 + '-' + sHash2 + '-' + data.length;
        console.log(sHash);


        const oneFile = await db(conf.store.table).where({
            backet: input.backet,
            hash: sHash
        }).first()

        let sDir = oneFile ? oneFile.path : aDir.join('/');

        if (oneFile) {
            const idFile: number = await db(conf.store.table).insert({
                backet: input.backet,
                key: input.key,
                path: oneFile.path,
                hash: sHash
            })


        } else {
            const idFile: number = (await db(conf.store.table).insert({
                backet: input.backet,
                key: input.key,
                path: sDir,
                hash: sHash
            }))[0]

            // В случае если последовательное заполнение папок
            if (conf.store.alg == 'line') {
                aDir = [input.backet];
                if (idFile < 999_999_999) {
                    aDir.push(0);
                } else {
                    aDir.push(Math.floor(idFile / 1_000_000_000))
                }
                if (idFile < 999_999) {
                    aDir.push(0);
                } else {
                    aDir.push(Math.floor(idFile / 1_000_000))
                }
                if (idFile < 1000) {
                    aDir.push(0);
                } else {
                    aDir.push(Math.floor(idFile / 1000))
                }

                sDir = aDir.join('/')

                await db(conf.store.table).where('id', idFile).update({
                    path: sDir
                })
            }

            const bAccess = await maAccessDir(conf.store.dir + '/' + sDir)
            if (bAccess) {
                console.log('ПАПКА ЕСТЬ')
            } else {
                console.log('ПАПКИ НЕТ')
                await maMkDir(conf.store.dir + '/' + sDir, { recursive: true, mode: 0o774 })
            }

            await maWriteFile(conf.store.dir + '/' + sDir + '/' + sHash, data, { encoding: 'binary' });
        }

        const sFileKey = sDir + '/' + sHash

        console.log('END>>>', sFileKey)

        return {
            backet: input.backet,
            dir: sDir,
            filekey: sFileKey,
            accesskey: input.key
        };
    }

    /** Поместить значение в очередь */
    public async get(data: SetI): Promise<any> {

        const sPathKey = uuidv4().replace('-', '');

        await db(conf.store.table).where({

        })

        await maReadFile(data.backet + data.key)

        return null;
    }


    /** Получить информацию по очереди */
    public async info(data: SetI): Promise<any> {

        return null;
    }

    /** Получить информацию по очереди */
    public async dbInit() {

        const bExistMsg = await db.schema.hasTable(conf.store.table);
        if (!bExistMsg) {
            await db.schema.createTable(conf.store.table, (table) => {

                table.bigIncrements('id')
                    .comment('ID');

                table.string('backet', 100)
                    .comment('IP отправки');

                table.string('key', 255)
                    .comment('публичный идентификатор доступа');

                table.string('path', 255)
                    .comment('Путь хранения');

                table.string('hash', 42)
                    .comment('наименование файла');

                table.string('filename', 255)
                    .comment('наименование файла');

                table.dateTime('created_at', null)
                    .index('created_at')
                    .notNullable()
                    .defaultTo(db.raw('CURRENT_TIMESTAMP'))
                    .comment('Время создания записи');



                table.unique(['backet', 'key'], { indexName: 'backet_key' })
                table.unique(['backet', 'hash'], { indexName: 'backet_hash' })

            });
        }
    }


}