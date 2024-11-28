const TelegramBot = require('node-telegram-bot-api');
const { login, uploadMagnetOrTorrent } = require('./test2');
const generateUsername = require('unique-username-generator');

// Replace with your bot token
const token = '7714727245:AAEk1IvgnApuKMxgLfoO05Ibnk99imaVEdA';
const bot = new TelegramBot(token, { polling: true });

// User credentials (could be extended to support dynamic input)
const username = 'dodik';
const password = 'dodik123';

// Global state to store user data (for demo purposes)
let loggedInUser = null;

// Temporary storage for dynamic input
const userInput = {};

// /start Command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to MyBot! Use the menu to interact with the bot.');
});

// /login Command
bot.onText(/\/login/, async (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Attempting to log in...');
    const user = await login(username, password);

    if (user) {
        loggedInUser = user;
        bot.sendMessage(chatId, `Login successful! Your user ID: ${user}`);
    } else {
        bot.sendMessage(chatId, 'Login failed. Please check your credentials.');
    }
});

// /upload Command (Dynamic)
bot.onText(/\/upload/, async (msg) => {
    const chatId = msg.chat.id;

    if (!loggedInUser) {
        return bot.sendMessage(chatId, 'Please log in first using the /login command.');
    }

    // Ask user for the magnet link
    bot.sendMessage(chatId, 'Please send me the magnet link to upload.');
    userInput[chatId] = { step: 'waiting_for_magnet', user: loggedInUser };
});

// Handle responses for dynamic input
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Check if the user is in the middle of the upload process
    if (userInput[chatId]?.step === 'waiting_for_magnet') {
        const magnet = msg.text;

        // Validate magnet link format (basic validation)
        if (!magnet.startsWith('magnet:?xt=')) {
            return bot.sendMessage(chatId, 'Invalid magnet link. Please send a valid magnet link.');
        }

        const name = generateUsername();

        // Proceed with the upload process
        bot.sendMessage(chatId, `Uploading file with the name: "${name}"...`);
        const { user } = userInput[chatId];

        // Upload the magnet link
        const response = await uploadMagnetOrTorrent({
            user,
            magnet,
            name,
            archive: true,
            archiveMaxSize: 5242880, // 5120 MB
            noSeed: true,
            rename: false,
            files: [0],
            hostList: ['vikingfile'], // Customize as needed
        });

        if (response && response['Upload success']) {
            bot.sendMessage(chatId, `Upload successful! Link: ${response['Upload success']}`);
        } else {
            bot.sendMessage(chatId, 'Upload failed. Please try again.');
        }

        // Clear the user input state for this chat
        delete userInput[chatId];
    }
});
