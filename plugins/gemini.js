import axios from 'axios'

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {

    if (!text) return m.reply('`يمكنك ان تبحث او تسأل اي شيء انا Gemini الذكاء الاصطناعي الخاص بغوغل إسألني ما تشاء مثال :` \n\n *.gemini من هو علي ابن طالب؟*')
    try {
const result = await gemini(text);
        const {
            key
        } = await conn.sendMessage(m.chat, {
            image: {
                url: 'https://telegra.ph/file/e628941df62f8d0f8c5aa.png'
            },
            caption: wait
        }, {
            quoted: fVerif,
            mentions: [m.sender]
        })
        

        await conn.delay(500)
        await conn.sendMessage(m.chat, {
            image: {
                url: 'https://telegra.ph/file/e628941df62f8d0f8c5aa.png'
            },
            caption:  `\`✨Gemini Ai ^_^ SILANA AI\`\n\n${result.reply}`,
            edit: key
        }, {
            quoted: fVerif,
            mentions: [m.sender]
        })
    } catch (e) {
        throw e
    }
}
handler.help = ["gemini"]
handler.tags = ["ai"]
handler.command = /^(gemini)$/i
handler.limit= true
handler.premium = false

export default handler

async function gemini(txt) {
    try {
        const { data  } = await axios.get(`https://hercai.onrender.com/gemini/hercai?question=${encodeURIComponent(txt)}`, {
            headers: {
                "content-type": "application/json",
            },
        })
        return data;
    } catch (e) {
    console.log(e)
}
}