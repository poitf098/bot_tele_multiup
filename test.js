const axios = require('axios');
const qs = require('qs'); // Untuk meng-encode data sebagai x-www-form-urlencoded

// Function to perform login
async function login(username, password) {
    const url = 'https://multiup.io/api/login';

    try {
        // Encode data sebagai x-www-form-urlencoded
        const postData = qs.stringify({ username: username, password: password });

        const response = await axios.post(url, postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Validasi respons API
        if (response.data.error && response.data.error !== 'success') {
            console.error('Error:', response.data.error);
            return null;
        }

        console.log('Login Successful!');
        console.log('User ID:', response.data.user);
        console.log('Account Type:', response.data.account_type);
        console.log('Premium Days Left:', response.data.premium_days_left);

        return response.data;
    } catch (error) {
        console.error('An error occurred during login:', error.message);
        return null;
    }
}

// Replace with your credentials
const username = 'dodik';
const password = 'dodik123';

// Perform login
login(username, password).then((data) => {
    if (data) {
        console.log('Login response:', data);
    }
});

// Function to get the fastest server
async function getFastestServer(fileSize = null, isTorrent = false) {
    const url2 = 'https://multiup.io/api/get-fastest-server';

    try {
        const params = {
            size: fileSize, // Optional: Size of the file in octets (bytes)
            torrent: isTorrent ? 'true' : 'false', // Optional: true or false for torrent uploads
        };

        // Menggunakan query string jika size diberikan, atau default tanpa parameter
        const query = qs.stringify(params, { skipNulls: true });
        const requestUrl = query ? `${url2}?${query}` : url2;

        // Lakukan permintaan ke API
        const response2 = await axios.get(requestUrl);

        if (response2.data.error && response2.data.error !== 'success') {
            console.error('Error:', response2.data.error);
            return null;
        }

        console.log('Fastest server found:', response2.data.server);
        return response2.data.server;
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

// Contoh penggunaan
(async () => {
    const fileSize = "10485760"; // Ukuran file dalam bytes (opsional)
    const isTorrent = true; // true jika untuk torrent

    const server = await getFastestServer(fileSize, isTorrent);
    if (server) {
        console.log('Fastest server URL:', server);
    }
})();

