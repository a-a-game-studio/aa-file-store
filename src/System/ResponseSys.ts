import { AAContext } from "@a-a-game-studio/aa-server";

/**
 * Функция рендера страницы
 * @param faCallback - функция контролера
 */
export const faSendRouter = async (ctx: AAContext, data: any): Promise<boolean> => {
    console.log(data);
    try {

        ctx.send(JSON.stringify({
            ok: true,
            e: false,
            data: data
        }));
    } catch (e) {
        ctx.err.errorEx(e, ctx.req.url, 'Ошибка маршрута');
        ctx.error(500);
    }

    return false;
};
