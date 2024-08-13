
export enum MsgT {
    set = '/set', // Поместить файл в хранилище
    get = '/get', // Поместить файл в хранилище
    info = '/info' // Информация по очереди
}

export interface SetI {
    backet: string; // контейнер
    key?: string; // Уникальный идентификатор доступа
    data?: string; // Данные в Base64
}

export interface GetI {
    url: string; // /backet/key
}
