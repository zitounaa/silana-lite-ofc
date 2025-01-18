export async function before(m) {
  if (m.isGroup) {
    const groupUrlRegex = /https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/i;
    const channelUrlRegex =
      /https:\/\/(?:www\.)?youtube\.com\/channel\/([A-Za-z0-9_-]+)/i;
    if (groupUrlRegex.test(m.text) || channelUrlRegex.test(m.text)) {
      await conn.sendText(
        m.chat,
        `@${m.sender.split("@")[0]}! *لا يجوز لك نشر عناوين URL للمجموعة أو القناة في هذه المجموعة. سيتم طردك.*.`,
        { mentions: [m.sender] },
      );
      await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }
}
