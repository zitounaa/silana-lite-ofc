import fetch from 'node-fetch';
import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {    
  let additionalText = '';
  if (['play', 'play1doc'].includes(command)) {
    additionalText = 'audio';
  } else if (['play2', 'play2doc'].includes(command)) {
    additionalText = 'video';
  }

  if (command === 'play') {
    if (!text) throw `Please provide a search term. Example: _${usedPrefix + command} song name_`;
    try {
      const apisearch = await axios.get(`https://api-rin-tohsaka.vercel.app/search/ytsearch?text=${encodeURIComponent(text)}`);
      const responsev1 = apisearch.data.data[0];
            
      const body = `Title: ${responsev1.title}\nUploaded: ${responsev1.uploaded}\nDuration: ${responsev1.duration}\nViews: ${responsev1.views}\nAuthor: ${responsev1.author.name}\nID: ${responsev1.identifier}\nType: ${responsev1.type}\nURL: ${responsev1.url}\nAuthor URL: ${responsev1.author.url}\n\n> Downloading ${additionalText}, please wait...`.trim();
      conn.sendMessage(m.chat, { image: { url: responsev1.thumbnail }, caption: body }, { quoted: m });

      const apidownload = await axios.get(`https://api-rin-tohsaka.vercel.app/download/ytmp3?url=${responsev1.url}`);
      const responsev2 = await apidownload.data.data.download;
            
      await conn.sendMessage(m.chat, { audio: { url: responsev2 }, mimetype: 'audio/mpeg' }, { quoted: m });
    } catch (e) {
      conn.reply(m.chat, `「 ✰ 」AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST\n\n> ${e}`, m);
    }
  }

  if (command === 'play2') {
    if (!text) throw `Please provide a search term. Example: _${usedPrefix + command} song name_`;
    try {
      const apisearch = await axios.get(`https://api-rin-tohsaka.vercel.app/search/ytsearch?text=${encodeURIComponent(text)}`);
      const responsev1 = apisearch.data.data[0];
            
      const body = `Title: ${responsev1.title}\nUploaded: ${responsev1.uploaded}\nDuration: ${responsev1.duration}\nViews: ${responsev1.views}\nAuthor: ${responsev1.author.name}\nID: ${responsev1.identifier}\nType: ${responsev1.type}\nURL: ${responsev1.url}\nAuthor URL: ${responsev1.author.url}\n\n> Downloading ${additionalText}, please wait...`.trim();
      conn.sendMessage(m.chat, { image: { url: responsev1.thumbnail }, caption: body }, { quoted: m });

      const apidownload = await axios.get(`https://api-rin-tohsaka.vercel.app/download/ytmp4?url=${responsev1.url}`);
      const responsev2 = await apidownload.data.data.download;
            
      await conn.sendMessage(m.chat, { video: { url: responsev2 }, mimetype: 'video/mp4' }, { quoted: m });
    } catch (e) {
      conn.reply(m.chat, `「 ✰ 」AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST\n\n> ${e}`, m);
    }
  }
  
  if (command === 'play1doc') {
    if (!text) throw `Please provide a search term. Example: _${usedPrefix + command} song name_`;
    try {
      const apisearch = await axios.get(`https://api-rin-tohsaka.vercel.app/search/ytsearch?text=${encodeURIComponent(text)}`);
      const responsev1 = apisearch.data.data[0];
            
      const body = `Title: ${responsev1.title}\nUploaded: ${responsev1.uploaded}\nDuration: ${responsev1.duration}\nViews: ${responsev1.views}\nAuthor: ${responsev1.author.name}\nID: ${responsev1.identifier}\nType: ${responsev1.type}\nURL: ${responsev1.url}\nAuthor URL: ${responsev1.author.url}\n\n> Downloading ${additionalText}, please wait...`.trim();
      conn.sendMessage(m.chat, { image: { url: responsev1.thumbnail }, caption: body }, { quoted: m });

      const apidownload = await axios.get(`https://api-rin-tohsaka.vercel.app/download/ytmp3?url=${responsev1.url}`);
      const responsev2 = await apidownload.data.data.download;
            
      await conn.sendMessage(m.chat, { document: { url: responsev2 }, mimetype: 'audio/mpeg', fileName: `${responsev1.title}.mp3` }, { quoted: m });
    } catch (e) {
      conn.reply(m.chat, `「 ✰ 」AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST\n\n> ${e}`, m);
    }
  }

  if (command === 'play2doc') {
    if (!text) throw `Please provide a search term. Example: _${usedPrefix + command} song name_`;
    try {
      const apisearch = await axios.get(`https://api-rin-tohsaka.vercel.app/search/ytsearch?text=${encodeURIComponent(text)}`);
      const responsev1 = apisearch.data.data[0];
            
      const body = `Title: ${responsev1.title}\nUploaded: ${responsev1.uploaded}\nDuration: ${responsev1.duration}\nViews: ${responsev1.views}\nAuthor: ${responsev1.author.name}\nID: ${responsev1.identifier}\nType: ${responsev1.type}\nURL: ${responsev1.url}\nAuthor URL: ${responsev1.author.url}\n\n> Downloading ${additionalText}, please wait...`.trim();
      conn.sendMessage(m.chat, { image: { url: responsev1.thumbnail }, caption: body }, { quoted: m });

      const apidownload = await axios.get(`https://api-rin-tohsaka.vercel.app/download/ytmp4?url=${responsev1.url}`);
      const responsev2 = await apidownload.data.data.download;
            
      await conn.sendMessage(m.chat, { document: { url: responsev2 }, mimetype: 'video/mp4', fileName: `${responsev1.title}.mp4` }, { quoted: m });
    } catch (e) {
      conn.reply(m.chat, `「 ✰ 」AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST\n\n> ${e}`, m);
    }
  }
};

handler.command = ['play', 'play2', 'play1doc', 'play2doc'];
handler.help = ['play', 'play2', 'play1doc', 'play2doc'];
handler.tags = ['downloader'];
export default handler;