import os from 'os';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import readline from 'readline';

// Important variables
const TIME = 1000 * 60 * 200; // 200 minutes
const __dirname = path.resolve(); // Ensure validity

// Ensure the "session" folder exists
const sessionPath = path.join(__dirname, './session');
if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
    console.log('Created session directory:', sessionPath);
}

// Function to clear session files
async function clearSessions() {
    try {
        const sessionDirectories = [os.tmpdir(), sessionPath]; // Array of directories
        const filesToDelete = [];

        for (const dir of sessionDirectories) {
            if (fs.existsSync(dir)) {
                const files = await fs.promises.readdir(dir);
                if (files.length > 1 || (files.length === 1 && files[0] !== 'creds.json')) {
                    for (const file of files) {
                        const filePath = path.join(dir, file);
                        if (file !== 'creds.json') {
                            const stat = await fs.promises.stat(filePath);
                            if (stat.isFile() && Date.now() - stat.mtimeMs >= TIME) {
                                filesToDelete.push(filePath);
                            }
                        }
                    }
                }
            }
        }

        for (const file of filesToDelete) {
            await fs.promises.unlink(file);
            console.log(`Deleted: ${file}`);
        }

        if (filesToDelete.length === 0) {
            console.log('No sessions to clear.');
        } else {
            console.log('Session clearing completed.');
        }
    } catch (error) {
        console.error('Error during session clearing:', error.message);
    }
}

// Function to schedule session clearing at specific times
function scheduleClearSessions() {
    const scheduleTimes = [
        { hour: 0, minute: 0 },
        { hour: 9, minute: 0 },
        { hour: 13, minute: 0 },
    ];

    scheduleTimes.forEach(({ hour, minute }) => {
        const now = new Date();
        const target = new Date();

        target.setHours(hour, minute, 0, 0);

        if (target <= now) {
            // If the target time has passed today, schedule for tomorrow
            target.setDate(target.getDate() + 1);
        }

        const delay = target - now;
        setTimeout(() => {
            // Run clearSessions for the first time
            clearSessions();

            // Schedule daily interval
            setInterval(clearSessions, 24 * 60 * 60 * 1000); // 24 hours
        }, delay);

        console.log(
            `Scheduled session clearing at ${hour.toString().padStart(2, '0')}:${minute
                .toString()
                .padStart(2, '0')}.`
        );
    });
}

// Run scheduled session clearing
scheduleClearSessions();
console.log(chalk.blue.bold('Scheduled session clearing initialized.'));

// Add a listener for manual input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.on('line', async (input) => {
    if (input.trim().toLowerCase() === 'clear') {
        console.log('Manual session clearing initiated...');
        await clearSessions();
        console.log('Manual session clearing completed.');
    }
});
