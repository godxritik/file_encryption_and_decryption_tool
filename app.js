const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Define directories
const ENCRYPTED_DIR = 'encrypted_files';
const DECRYPTED_DIR = 'decrypted_files';
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.randomBytes(32); // Generate a 32-byte key
const IV = crypto.randomBytes(16);         // Generate a 16-byte IV

// Middleware to serve static files
app.use(express.static('public/index.html'));

// Encryption Route
app.post('/encrypt', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const encryptedPath = path.join(ENCRYPTED_DIR, `${req.file.filename}.enc`);

    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(encryptedPath);

    input.pipe(cipher).pipe(output);

    output.on('finish', () => {
        fs.unlinkSync(filePath); // Clean up the original file
        res.download(encryptedPath);
    });
});

// Decryption Route
app.post('/decrypt', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const decryptedPath = path.join(DECRYPTED_DIR, `${req.file.filename}.dec`);

    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(decryptedPath);

    input.pipe(decipher).pipe(output);

    output.on('finish', () => {
        fs.unlinkSync(filePath); // Clean up the original file
        res.download(decryptedPath);
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
