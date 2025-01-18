import axios from 'axios';

const base = 'https://gramsaver.com/api/'; // Replace with a working Instagram downloader API

const headers = {
  'authority': 'gramsaver.com',
  'accept': '*/*',
  'referer': 'https://gramsaver.com/',
  'user-agent': 'apitester.org Android/7.5(641)'
};

const logs = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const gramsaver = {
  extractId(url) {
    // Improved regex to handle Instagram Reels, Posts, and Stories with optional query parameters
    const regex = /(?:reel|p|tv|stories)\/([A-Za-z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null; // Return the matched ID
  },

  async fetch(igId) {
    const url = new URL(igId, base);
    try {
      const response = await axios.get(url.toString(), { headers: headers });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw logs(`${error.response.status}`, error.response.status);
      }
      throw logs(`${error.message}`, 'NETWORK_ERROR');
    }
  },

  async *peit(igss) {
    for await (const id of igss) {
      try {
        yield await this.fetch(id);
      } catch (error) {
        yield { error, id };
      }
    }
  },

  async retry(igs, { maxRetries = 3, delay = 1000 } = {}) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.fetch(igs);
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  }
};

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply('Please provide an Instagram URL.');
  }

  const igId = gramsaver.extractId(args[0]);
  if (!igId) {
    return m.reply('Invalid Instagram URL. Please provide a valid URL.');
  }

  try {
    const result = await gramsaver.fetch(igId);
    if (result.error) {
      return m.reply(`Error: ${result.error}`);
    }

    // Handle the API response to extract media URLs
    const { video_url, image_url } = result;

    if (video_url) {
      // Send the video
      await conn.sendMessage(m.chat, { video: { url: video_url }, caption: 'Here is the video from Instagram:' });
    } else if (image_url) {
      // Send the image
      await conn.sendMessage(m.chat, { image: { url: image_url }, caption: 'Here is the image from Instagram:' });
    } else {
      m.reply('No media found in the provided URL.');
    }
  } catch (error) {
    m.reply(`Failed to fetch media: ${error.message}`);
  }
};

handler.help = ['ig','insgagram'];
handler.tags = ['downloader'];
handler.command = /^igdl|instagram|ig$/i;

export default handler;