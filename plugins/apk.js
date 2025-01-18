import { search, download } from 'aptoide-scraper';
import baileys from '@adiwajshing/baileys';
const {
					proto,
					generateWAMessageFromContent, 
					prepareWAMessageMedia
				} = baileys;

async function response(jid, data, quoted) {
				let msg = generateWAMessageFromContent(jid, {
					viewOnceMessage: {
						message: {
							"messageContextInfo": {
								"deviceListMetadata": {},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create({
								body: proto.Message.InteractiveMessage.Body.create({
									text: data.body
								}),
								footer: proto.Message.InteractiveMessage.Footer.create({
									text: data.footer
								}),
								header: proto.Message.InteractiveMessage.Header.create({
									title: data.title,
									subtitle: data.subtitle,
									hasMediaAttachment: data. media ? true : false, 
									...(data.media ? await prepareWAMessageMedia(data.media, { upload: conn.waUploadToServer }) : {})
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
									buttons: data.buttons
								})
							})
						}
					}
				}, { quoted })

				await conn.relayMessage(msg.key.remoteJid, msg.message, {
					messageId: msg.key.id
				})
				}
				
				/**async function search(string) {
					let data = await axios.get("https://deliriussapi-oficial.vercel.app/download/apk?query=" + encodeURIComponent(string));
					return data.data
					}**/

let handler = async (m, { conn, command, usedPrefix, text }) => {
    if (command === "apk") {
        if (!text) throw `نكتب على سبيل التجربة:\n\n${usedPrefix + command} facebook lite`;
        
        const data = await search(text);
        if (!data.length) throw `لم نجد اي تطبيق تحت اسم \n "${text}".`;

        let sections = [
            {
                title: 'التطبيقات المتوفرة',
                highlight_label: 'Top', 
                rows: data.map(app => ({
                    title: app.name,
                    description: `عرض التفاصيل "${app.name}"`,
                    id: `.apkview ${app.id}`
                }))
            }
        ];

        const listMessage = {
            text: `Search results for "${text}":`,
            footer: 'حدد تطبيقًا لعرض تفاصيله',
            body: 'المرجو اختيار التطبيق الذي تريد تحميله',
            buttons: [{
            name: 'single_select', 
            buttonParamsJson: JSON.stringify({
            title: 'نتائج بحث التطبيقات', 
            sections
            }) 
            }]
        };

        await response(m.chat, listMessage, m);
    } else if (command === "apkview") {
        if (!text) throw `Usage:\n${usedPrefix + command} <app id>`;
        
        const data = (await axios.get("https://deliriussapi-oficial.vercel.app/download/apk?query="+encodeURIComponent(text))).data.data;
        const details = `*Name:* ${data.name}\n*Last Updated:* ${data.publish}\n*Size:* ${data.size}\n\nتحميل بالضغط على الزر أدناه:`;

        const buttons = [{
            name: 'quick_reply', 
            buttonParamsJson: JSON.stringify({
            	display_text: "تحميل التطبيق الآن", 
                id: ".apkget "+ data.id
            })
        }];

        const buttonMessage = {
            body: details,
            footer: 'تحميل التطبيقات من Aptoide',
            buttons,
            media: { image: { url: data.image }}
        };

        await response(m.chat, buttonMessage, m);
    } else if (command === "apkget") {
        if (!text) throw `Usage:\n${usedPrefix + command} <package name>`;
        
        const data = (await axios.get("https://deliriussapi-oficial.vercel.app/download/apk?query="+encodeURIComponent(text))).data.data;

        await conn.sendMessage(m.chat, { 
            document: { url: data.download }, 
            mimetype: 'application/vnd.android.package-archive', 
            fileName: `${data.name}.apk`, 
            caption: `تم التحميل بنجاح يا  @${m.sender.split('@')[0]}`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });
    }
};

handler.command = ["apk", "apkview", "apkget"];
handler.help = ["apk"];
handler.tags = ["downloader"];
handler.limit = true
export default handler;