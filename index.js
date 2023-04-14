
import dotenv from 'dotenv';

import express from "express"
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 1980;

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

let users = [
  { id: 1, word: 'Hello' },
  { id: 2, word: 'Snow' },
  { id: 3, word: 'Glow' },
];
let index = 4;

app.get('/words', (req, res) => {
  res.json(users);
});

app.post('/antonyms', async (req, res) => {
  // const prompt = req.params.id;
  const prompt = req.body.word;
  
  let data = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": `Give antonyms of ${prompt} as array, without explanation`
      }
    ]
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.openai.com/v1/chat/completions',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    const data = JSON.stringify(response.data);
    // console.log(data);
    
    response.data.choices.forEach((it, index) => {
        res.send({antonyms: it.message.content});
    })

    users.push({id: index, word: prompt})
    // res.send(JSON.stringify(response.data))
  })
  .catch((error) => {
    console.log(error);
  });
});

app.post('/words', (req, res) => {
  const user = req.body;
  user.id = users.length + 1;
  users.push(user);
  res.status(201).json(user);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
