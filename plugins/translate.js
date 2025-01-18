let handler = async (m, { conn, args }) => {
    // Check if the user provided a query and a language code
    if (args.length < 2) {
        return conn.reply(m.chat, 'Usage: .translate <text> <language code> \n exemple : \n . translate hello my name is silana lite en', m);
    }

    const query = args.slice(0, -1).join(' '); // Extract the text to translate
    const lang = args[args.length - 1]; // Extract the target language code

    try {
        const translatedText = await translate(query, lang);
        conn.reply(m.chat, `Translated Text: \n\n${translatedText}`, m);
    } catch (err) {
        console.error(err);
        conn.reply(m.chat, 'Failed to translate the text. Please try again later.', m);
    }
}

handler.help = ['translate'];
handler.command = ['translate','tr'];
handler.tags = ['tools'];
export default handler;

async function translate(query = "", lang) {
    if (!query.trim()) return "";
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.append("client", "gtx");
    url.searchParams.append("sl", "auto");
    url.searchParams.append("dt", "t");
    url.searchParams.append("tl", lang);
    url.searchParams.append("q", query);

    try {
        const response = await fetch(url.href);
        const data = await response.json();
        if (data) {
            return [data[0]].map(([[a]]) => a).join(" ");
        } else {
            return "";
        }
    } catch (err) {
        throw err;
    }
}