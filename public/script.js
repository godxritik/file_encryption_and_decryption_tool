document.getElementById('encryptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/encrypt', {
        method: 'POST',
        body: formData,
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'encrypted_file.enc';
    link.click();
    window.URL.revokeObjectURL(url);
});

document.getElementById('decryptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/decrypt', {
        method: 'POST',
        body: formData,
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decrypted_file';
    link.click();
    window.URL.revokeObjectURL(url);
});
