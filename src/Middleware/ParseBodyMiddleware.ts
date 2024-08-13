
import { AAContext } from '@a-a-game-studio/aa-server';
import colors from 'colors';


/* LEGO ошибок */
export default function ParseBodyMiddleware(ctx: AAContext): void {
    if (ctx.req.method === 'POST') {
        const body: Buffer[] = [];

        ctx.req.on('error', (err) => {
            console.error(colors.red('Ошибка парсинга тела запроса - '), ctx.req.url, err);
            ctx.error(400);
        });

        ctx.req.on('data', (chunk: Buffer) => {
            body.push(chunk);
        });

        ctx.req.on('end', () => {
            ctx.body = Buffer.concat(body);

            ctx.next();
        });
    } else {
        ctx.next();
    }
}
