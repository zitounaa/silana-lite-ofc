import axios from 'axios';
import { sticker } from '../lib/sticker.js';

const handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(message.chat, "🗿 *يرجى إدخال نص للبحث في Pinterest على شكل ملصق 😝*", message);
  }

  try {
    let { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(text)}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${encodeURIComponent(text)}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);

    let imageUrls = data.resource_response.data.results
      .map(result => result.images.orig.url)
      .filter(url => url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'));

    if (imageUrls.length === 0) {
      return conn.reply(message.chat, "❗ لم يتم العثور على  ملصق تتطابق مع بحثك.", message);
    }

    
    let selectedImages = getRandomElements(imageUrls, 2);

    for (let i = 0; i < selectedImages.length; i++) {
      const imageUrl = selectedImages[i];

      let stiker = await createSticker(imageUrl);

      if (stiker) {
        await conn.sendFile(message.chat, stiker, 'sticker.webp', '', message);
      }

      await delay(4000);
    }

  } catch (error) {
    console.error(error);
    conn.reply(message.chat, "[❗] حدث خطأ أثناء البحث أو الإرسال. حاول مرة أخرى.", message);
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function createSticker(imageUrl) {
  try {
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data);
    return await sticker(buffer, false, 'Pinterest Sticker', 'MINATO-BOT', ["✨"]);
  } catch (error) {
    console.error("Error creating sticker:", error);
    return null;
  }
}


function getRandomElements(array, count) {
  const shuffled = array.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

handler.help = ['obito-sticker'];
handler.tags = ['sticker'];
handler.command = /^(obito-sticker)$/i;

export default handler;
