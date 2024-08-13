/**
 * Получить content type
 * @param sFile файл в формате BASE64
 * @return content-type
 */
export function mGetContentTypeFromDataUrl(sFile:string): string {
    const aContentTypeMatch = /^data:.+;/.exec(sFile);

    // извлекаем сам content-type
    let contentType = null;
    if (aContentTypeMatch && aContentTypeMatch[0]) {
        contentType = aContentTypeMatch[0];

        // убираем 'data:'
        contentType = contentType.replace(/^data:/, '');

        // убираем ';'
        contentType = contentType.replace(/;$/, '');
    }

    return contentType;
}
