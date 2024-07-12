export function limitText(text: any, limit : any) {
    if (!text) {
        return "Por actualizar...";
    }
    if (text?.length <= limit) {
        return text;
    } else {
        return text?.substring(0, limit) + '...';
    }
}