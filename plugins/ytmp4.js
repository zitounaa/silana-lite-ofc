/* Features Play YouTube
 * Base API : https://axeel.my.id/docs
 * Code by : AxellNetwork
 */
import yts from "yt-search";
import axios from "axios";

// Custom utility function to check if a string is a URL
const isUrl = (text) => {
    try {
        new URL(text);
        return [text];
    } catch (e) {
        return false;
    }
};

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(" Please enter a search term or URL.");
    m.reply(" Please wait...");

    let txt = "";
    if (isUrl(text)) {
        txt = isUrl(text)[0];
    } else {
        const searchResults = await yts(text);
        if (!searchResults.videos || searchResults.videos.length === 0) {
            return m.reply(" No results found.");
        }
        txt = searchResults.videos[0].url; // Use the first video result
    }

    let { data } = await axios
        .get("https://ytdl.axeel.my.id/api/download/video?url=" + txt, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        .catch((e) => {
            console.error("API Error:", e.message);
            return m.reply(" Failed to fetch video data.");
        });

    if (!data || !data.metadata || !data.metadata.thumbnail || !data.downloads) {
        return m.reply(" Invalid video data.");
    }

    // Ensure thumbnail URL is valid
    const thumbnailUrl = data.metadata.thumbnail.url || data.metadata.thumbnail;
    if (!thumbnailUrl) {
        return m.reply(" Thumbnail not found.");
    }

    // Ensure download URL is valid
    const downloadUrl = data.downloads[0]?.url || data.downloads.url;
    if (!downloadUrl) {
        return m.reply(" Download link not found.");
    }

    let cap = "*– YouTube Video Downloader*\n";
    cap += Object.entries(data.metadata)
        .map(([a, b]) => `> *- ${a.charAt(0).toUpperCase() + a.slice(1)} :* ${b}`)
        .join("\n");
    cap += "\n\nSILANA LITE 🧠";

    await conn.sendMessage(
        m.chat, {
            image: { url: thumbnailUrl },
            caption: cap,
        }, {
            quoted: m,
        },
    );

    await conn.sendMessage(
        m.chat, {
            video: { url: downloadUrl },
        }, {
            quoted: m,
        },
    );
};

handler.help = handler.command = ['ytmp4', 'ytv'];
handler.tags = ['downloader'];
export default handler;