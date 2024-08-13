
import { AAContext, AARoute, AAServer } from '@a-a-game-studio/aa-server';


import { StoreSys } from './System/StoreSys';
import { faSendRouter as faSend } from './System/ResponseSys';

import { MsgT } from './interface/CommonI';
import { common } from './Config/MainConfig';
import ParseBodyMiddleware from './Middleware/ParseBodyMiddleware';

let cntConnect = 0;

const gStoreSys = new StoreSys();

gStoreSys.dbInit();

// =============================================================
// var remoteSocket = new net.Socket();
let bConnect = false;

const app = new AAServer();
// if (config.common.env === 'dev' || config.common.env === 'test') {
app.use((ctx: AAContext) => {
    console.log(`>:${ctx.req.url}`);
    ctx.next();
});
// }



const router = new AARoute();

app.use(ParseBodyMiddleware);

/**
 * Приход сообщений
 */
router.post(MsgT.set, async (ctx: AAContext) => {

    try {
        const out = await gStoreSys.set(<any>ctx.query, ctx.body);
        return faSend(ctx, out);
    } catch (e) {
        console.log(e);
        return faSend(ctx, e);
    }

});

/**
 * Приход сообщений
 */
router.get(MsgT.get, async (ctx: AAContext) => {

    await gStoreSys.get(ctx.body);
    return faSend(ctx, null);
});

/**
 * Количество сообщений
 */
router.post(MsgT.info, async (ctx: AAContext) => {

    const data = await gStoreSys.info(ctx.body);

    return faSend(ctx, data);
});





app.route(router)

// Обработчик ошибок
app.error((AAContext) => {
    console.log('[]>>>ERROR<<<]');
    console.log(AAContext.err.getTraceList());
});

console.log(`

 █████╗ ██████╗ ██╗
██╔══██╗██╔══██╗██║
███████║██████╔╝██║
██╔══██║██╔═══╝ ██║
██║  ██║██║     ██║
╚═╝  ╚═╝╚═╝     ╚═╝

`);

app.listen(common.port, common.host, () => {
    console.log(`server start at ${common.host}:${common.port}`);

    return true;
});
