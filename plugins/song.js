import fetch from 'node-fetch';
import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (command === 'song') {
        if (!text) return conn.reply(m.chat, `「 ✰ 」ENTER A *LINK* OR *TITLE* OF THE *AUDIO* YOU WANT TO DOWNLOAD FROM *YOUTUBE*\n\n*• EXAMPLE:*\n> ${usedPrefix + command} Ryllz - Nemesis`, m);

        try {
            const search = await yts(text);
            if (m.text.includes('http://') || m.text.includes('https://') || m.text.includes('youtube.com') || m.text.includes('youtu.be')) {
                return conn.reply(m.chat, `「 ✰ 」INVALID DOWNLOAD.\n\n> IF YOU WANT TO PERFORM A *DOWNLOAD* FROM THE *YOUTUBE* PLATFORM USING A DOWNLOAD LINK, YOU MUST USE THE FOLLOWING COMMANDS DEPENDING ON WHAT YOU WANT TO DOWNLOAD\n\n❀ */YTMP3* = AUDIO\n❀ */YTMP4* = VIDEO`, m);
            }

            let bodyv1 = `「 ✰ 」 *SEARCH RESULTS:*\n> SEARCH: ${text}\n\n❀ *TITLE:* > ${search.videos[0].title}\n\`\`\`----------\`\`\`\n❀ *VIEWS:*\n> ${search.videos[0].views}\n\`\`\`----------\`\`\`\n❀ *DURATION:*\n> ${search.videos[0].duration}\n\`\`\`----------\`\`\`\n❀ *UPLOADED:*\n> ${search.videos[0].ago}\n\`\`\`----------\`\`\`\n❀ *URL:*\n> ${search.videos[0].url}\n\`\`\`----------\`\`\`\n\`SENDING YOUR RESULTS...\``;
            conn.sendMessage(m.chat, { image: { url: search.videos[0].thumbnail }, caption: bodyv1 }, { quoted: m });

            const api = await axios.get(`https://api-rin-tohsaka.vercel.app/download/ytmp3?url=${search.videos[0].url}`)
            const response = await api.data.data.download;
            
            await conn.sendMessage(m.chat, { document: { url: response }, mimetype: 'audio/mpeg', fileName: `${search.videos[0].title}.mp3` }, { quoted: m });
        } catch (e) {
            conn.reply(m.chat, `「 ✰ 」AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST\n\n> ${e}`, m);
        }
    }

    if (command === 'song2') {
        if (!text) return conn.reply(m.chat, `「 ✰ 」ENTER A *TITLE* OF THE *VIDEO* YOU WANT TO DOWNLOAD FROM *YOUTUBE*\n\n*• EXAMPLE:*\n> ${usedPrefix + command} Ryllz - Nemesis`, m);

        try {
            const search = await yts(text);
            if (m.text.includes('http://') || m.text.includes('https://') || m.text.includes('youtube.com') || m.text.includes('youtu.be')) {
                return conn.reply(m.chat, `「 ✰ 」INVALID DOWNLOAD.\n\n> IF YOU WANT TO PERFORM A *DOWNLOAD* FROM THE *YOUTUBE* PLATFORM USING A DOWNLOAD LINK, YOU MUST USE THE FOLLOWING COMMANDS DEPENDING ON WHAT YOU WANT TO DOWNLOAD\n\n❀ */YTMP3* = AUDIO\n❀ */YTMP4* = VIDEO`, m);
            }

            let bodyv2 = `「 ✰ 」 *SEARCH RESULTS:*\n> SEARCH: ${text}\n\n❀ *TITLE:* > ${search.videos[0].title}\n\`\`\`----------\`\`\`\n❀ *VIEWS:*\n> ${search.videos[0].views}\n\`\`\`----------\`\`\`\n❀ *DURATION:*\n> ${search.videos[0].duration}\n\`\`\`----------\`\`\`\n❀ *UPLOADED:*\n> ${search.videos[0].ago}\n\`\`\`----------\`\`\`\n❀ *URL:*\n> ${search.videos[0].url}\n\`\`\`----------\`\`\`\n\`SENDING YOUR RESULTS...\``;
            conn.sendMessage(m.chat, { image: { url: search.videos[0].thumbnail }, caption: bodyv2 }, { quoted: m });

            const api = await axios.get(`https://api-rin-tohsaka.vercel.app/download/ytmp4?url=${search.videos[0].url}`)
            const response = await api.data.data.download;
            
            await conn.sendMessage(m.chat, { document: { url: response }, mimetype: 'video/mp4', fileName: `${search.videos[0].title}.mp4` }, { quoted: m });
        } catch (e) {
            conn.reply(m.chat, `「 ✰ 」AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST\n\n> ${e}`, m);
        }
    }
};
handler.tags = ['downloader'];
handler.help = ['song', 'song2'];
handler.command = ['song', 'song2'];
export default handler;
