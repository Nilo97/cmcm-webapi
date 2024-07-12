export function limitText(text: any, limit : any) {
    if (text.length <= 20) {
        return text;
    } else {
        return text.substring(0, limit) + '...';
    }
}