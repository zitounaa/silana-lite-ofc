let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Please provide a URL. Example: .ssweb https://instagram.com/noureddine_ouafy')
    
    let apiURL = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(text)}&theme=light&device=desktop`
    
    try {
        await conn.sendMessage(m.chat, { 
            image: { url: apiURL }, 
            caption: `Here is the screenshot for: ${text}` 
        })
    } catch (e) {
        m.reply('Failed to fetch screenshot. Please try again later.')
    }
}
handler.help = handler.command = ['ssweb']
handler.tags = ['tools']
export default handler
