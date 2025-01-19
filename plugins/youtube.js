import yts from 'yt-search';
import axios from "axios";

async function SSVID(link) {
    try {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/;
        const match = link.match(regex);
        if (!match) {
            throw new Error("No valid link found, please try a valid link! 😅");
        }
        const id = match[1];

        const headers = {
            accept: "*/*",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            Referer: "https://ssvid.net/",
            Origin: "https://ssvid.net",
        };

        const searchResponse = await axios.post(
            "https://ssvid.net/api/ajax/search",
            `query=${encodeURIComponent(link)}&vt=home`,
            { headers: headers }
        );

        if (!searchResponse.data || !searchResponse.data.vid) {
            throw new Error("Cannot find video information");
        }

        const videoData = searchResponse.data;

        const mp4ConvertKey = videoData.links.mp4.auto.k || videoData.links.mp4["18"].k;
        const mp4ConvertPayload = `vid=${id}&k=${encodeURIComponent(mp4ConvertKey)}`;
        const mp4ConvertResponse = await axios.post(
            "https://ssvid.net/api/ajax/convert",
            mp4ConvertPayload,
            { headers: headers }
        );

        const mp3ConvertKey = videoData.links.mp3.mp3128.k;
        const mp3ConvertPayload = `vid=${id}&k=${encodeURIComponent(mp3ConvertKey)}`;
        const mp3ConvertResponse = await axios.post(
            "https://ssvid.net/api/ajax/convert",
            mp3ConvertPayload,
            { headers: headers }
        );

        if (
            !mp4ConvertResponse.data ||
            mp4ConvertResponse.data.c_status !== "CONVERTED" ||
            !mp3ConvertResponse.data ||
            mp3ConvertResponse.data.c_status !== "CONVERTED"
        ) {
            throw new Error("Video conversion failed");
        }

        return {
            title: videoData.title || "Unknown Title",
            mp4: {
                quality: videoData.links.mp4.auto.q_text || videoData.links.mp4["18"].q_text,
                size: videoData.links.mp4.auto.size || videoData.links.mp4["18"].size,
                downloadLink: mp4ConvertResponse.data.dlink
            },
            mp3: {
                quality: videoData.links.mp3.mp3128.q_text,
                size: videoData.links.mp3.mp3128.size,
                downloadLink: mp3ConvertResponse.data.dlink
            }
        };
    } catch (error) {
        throw new Error("Sorry, an error occurred. Please try again later or use ytmp3. 😅");
    }
}

var handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text || text.trim() === '') {
        return m.reply(`*Enter the title or link of the YouTube video you want✨*
        
*🌀Example:* .play/.youtube title/URL [options]
*❗Options:*
- --video
- --audio
- --document or doc
- --vn`);
    }

    const args = text.split(' ');
    const lastArg = args[args.length - 1];
    const isOption = lastArg.startsWith('--');

    // If option exists, take the query without the last option
    const query = isOption ? args.slice(0, -1).join(' ') : args.join(' ');
    
    // If no option, set default to audio
    const finalOption = isOption ? lastArg : '--audio';

    await m.reply(wait);

    let search = await yts(query);
    let vid = search.videos[0];
    if (!vid) return m.reply('Video not found, please try another title! 😢');

    let {
        videoId,
        image,
        title,
        thumbnail,
        timestamp,
        views,
        ago,
        url,
        description
    } = vid;

    let captvid = `Y O U T U B E 🎥
- VideoId: ${videoId}
- Title: ${title}
- Duration: ${timestamp}
- Views: ${views}
- Upload: ${ago}
- Link: ${url}
- Description: ${description}`;

    await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: captvid
    }, { quoted: m });

    try {
        const { mp3, mp4 } = await SSVID(url);

        if (finalOption === '--video') {
            await conn.sendMessage(m.chat, { 
                video: { url: mp4.downloadLink }, 
                caption: `*${title}*\n\n*Size*: ${mp4.size}\n*Quality*: ${mp4.quality}\n\n*Silana Lite by Noureddine*` 
            }, { quoted: m });
        } else if (finalOption === '--document' || finalOption === '--doc') {
            const audio = await axios.get(mp3.downloadLink, { responseType: 'arraybuffer' });
            await conn.sendFile(m.chat, Buffer.from(audio.data), `${title}.mp3`, '', m, false, { mimetype: 'audio/mpeg', asDocument: true });
        } else if (finalOption === '--vn') {
            await conn.sendMessage(m.chat, { audio: { url: mp3.downloadLink }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
        } else {
            const audio = await axios.get(mp3.downloadLink, { responseType: 'arraybuffer' });
            let doc = {
                audio: Buffer.from(audio.data, 'base64'),
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 2,
                        mediaUrl: url,
                        title: title,
                        body: '',
                        sourceUrl: url,
                        thumbnail: await (await conn.getFile(thumbnail)).data
                    }
                }
            };
            await conn.sendMessage(m.chat, doc, { quoted: m });
        }
    } catch (error) {
        await m.reply("Sorry, an error occurred. Please try again later or use ytmp3. 😅");
    }
};

handler.help = ['youtube']
handler.tags = ['downloader'];
handler.command = /^(youtube)$/i;
export default handler;
