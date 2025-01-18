import https from 'https'

let handler = async (m, { conn, args }) => {
  let url = args[0]
  if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url)) 
    throw "*اكتب الأمر متبوع رابط الفيديو مثال* : \n\n. ytmp3 https://youtube.com/watch?v=fIJMUX7B5E0"
  
  https.get(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${url}`, res => {
    let data = ''
    res.on('data', chunk => data += chunk)
    res.on('end', async () => {
      let response = JSON.parse(data)      
      let ress = response.result.download.url
      await conn.sendFile(m.chat, ress, 'silana.mp3', '.', m.quoted || m )   
    })
  }).on('error', () => {
    throw "فشل تحميل المقطع اسفه"
  })
}

handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = /^ytmp3$/i
handler.limit = true
export default handler