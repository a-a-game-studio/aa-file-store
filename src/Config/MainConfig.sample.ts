
export const dbConf = { // Knex mysql
    client: "mysql2",
    connection: {
        host: "localhost",
        user: "root",
        port: 3306,
        password: "****",
        database: "aa_mq"
    },
    pool: { "min": 0, "max": 7 },
    acquireConnectionTimeout: 5000
};


/** Общие настройки приложения */
export const common = {
    env: 'dev', // Тип окружения
    nameApp: 'imgstore', // Имя приложения // показываем
    host: '0.0.0.0', // Внутренний host на котором стартует noda слушается обращение к API
    port: 3030, // порт на котором будет работать нода
    host_public: 'https://dev.angelserv.ru', // Публичный host балансер к которому идет обращение с фронта
}

export const store = {
    alg: 'rand', // rand|line
    table: 'store1',
    dir: '/var/www/store',
    pswd: '123456',
    node: { // Необязательный параметр, при отсутствии работает в 1 ноду, для дочерних node требуется опцию убрать
        node1: 'pass2@127.0.0.2:3032',
        node2: 'pass3@127.0.0.3:3033',
        node3: 'pass4@127.0.0.4:3034'
    }
}