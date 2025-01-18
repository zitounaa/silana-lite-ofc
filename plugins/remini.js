import { createReadStream, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Buffer } from 'buffer';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

async function Upscale(imageBuffer) {
    try {
        const response = await fetch("https://lexica.qewertyy.dev/upscale", {
            body: JSON.stringify({
                image_data: Buffer.from(imageBuffer, "base64"),
                format: "binary",
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        return Buffer.from(await response.arrayBuffer());
    } catch {
        return null;
    }
}

let handler = async (m, { conn }) => {
    // Check if the message contains an image
    if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('image')) {
        return m.reply('Please reply to an image with the command to upscale it.');
    }

    // Download the image
    const media = await m.quoted.download();
    const imageBuffer = media.toString('base64');

    // Upscale the image
    const upscaledImageBuffer = await Upscale(imageBuffer);

    if (!upscaledImageBuffer) {
        return m.reply('Failed to upscale the image.');
    }

    // Save the upscaled image to a temporary file
    const tempFilePath = join(tmpdir(), 'upscaled_image.png');
    await writeFile(tempFilePath, upscaledImageBuffer);

    // Send the upscaled image
    await conn.sendFile(m.chat, tempFilePath, 'upscaled_image.png', 'Here is your HD image: by silana lite ai', m);

    // Clean up the temporary file
    unlinkSync(tempFilePath);
}

handler.help = handler.command = ['remini','hd']
handler.tags = ['tools']
handler.limit = true
export default handler

// Helper function to write files using promises
import { writeFile } from 'fs/promises';