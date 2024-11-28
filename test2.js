const axios = require('axios');
const qs = require('qs');
const FormData = require('form-data');

// Function to perform login
async function login(username, password) {
    const url = 'https://multiup.io/api/login';

    try {
        const postData = qs.stringify({ username, password });

        const response = await axios.post(url, postData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (response.data.error && response.data.error !== 'success') {
            console.error('Error:', response.data.error);
            return null;
        }

        console.log('Login Successful!');
        console.log('User ID:', response.data.user);
        return response.data.user;
    } catch (error) {
        console.error('An error occurred during login:', error.message);
        return null;
    }
}

// Function to get the fastest server
async function getFastestServer(fileSize = null, isTorrent = true) {
    const url = 'https://multiup.io/api/get-fastest-server';

    try {
        const params = qs.stringify({ size: fileSize, torrent: isTorrent ? 'true' : 'false' }, { skipNulls: true });
        const requestUrl = params ? `${url}?${params}` : url;

        const response = await axios.get(requestUrl);

        if (response.data.error && response.data.error !== 'success') {
            console.error('Error:', response.data.error);
            return null;
        }

        console.log('Fastest server found:', response.data.server);
        return response.data.server;
    } catch (error) {
        console.error('An error occurred while fetching the fastest server:', error.message);
        return null;
    }
}

async function uploadMagnetOrTorrent({
    user,
    magnet = null,
    name,
    archive = true,
    archiveMaxSize = 5242880, // Default: 5120 MB
    archivePassword = null,
    noSeed = true,
    rename = false,
    files = [0],
    hostList = ['vikingfile'],
}) {
    try {
        const fastestServer = await getFastestServer();
        if (!fastestServer) {
            throw new Error('Could not retrieve the fastest server.');
        }

        const url = `${fastestServer}/upload/torrent.php`;

        // Create form data
        const formData = new FormData();
        formData.append('user', user);
        if (magnet) formData.append('magnet', magnet);
        formData.append('name', name);
        formData.append('archive', archive.toString());
        formData.append('archive-max-size', archiveMaxSize.toString());
        if (archivePassword) formData.append('archive-password', archivePassword);
        formData.append('no-seed', noSeed.toString());
        formData.append('rename', rename.toString());

        files.forEach((file, index) => {
            formData.append(`files[]`, file);
        });

        hostList.forEach((host, index) => {
            formData.append(`host${index + 1}`, host);
        });

        // Send the POST request
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });

        // Log the API response
        if (response.data['Upload success']) {
            console.log('Upload success:', response.data['Upload success']);
        } else {
            console.log('Upload response:', response.data);
        }

        return response.data;
    } catch (error) {
        console.error('An error occurred during upload:', error.message);
        return null;
    }
}

module.exports = {
    login,
    uploadMagnetOrTorrent,
};



