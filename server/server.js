const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      }
    );

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate image.' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
