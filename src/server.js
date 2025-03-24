const express = require('express');
const app = express();
const _sodium = require('libsodium-wrappers');
const dummy = require('./dummy');

app.use(express.static('public'));
app.use(express.json());

app.post('/encrypt', async (req, res) => {
    const { index, campo } = req.body;
    try {
        const respuesta = dummy.read(index, campo);
        await _sodium.ready;
        const sodium = _sodium;
        
        let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
        let resPush = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
        let cipher = sodium.crypto_secretstream_xchacha20poly1305_push(resPush.state, 
            sodium.from_string(respuesta), null, 
            sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL);

        res.json({
            cifrado: sodium.to_base64(cipher),
            header: sodium.to_base64(resPush.header)
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));