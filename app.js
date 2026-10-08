import express from 'express';
import 'dotenv/config';
import { env } from './config/env.js';
import {verifieConnexion} from'./config/db.js';

const app = express();
const PORT = Number(env.PORT) || 3000;

app.get('/', (req, res) => {
  res.status(200).send('Hello World from Express!');
});



async function startServer() {
  try {
    await verifieConnexion();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Échec du démarrage du serveur :', error);
    process.exit(1);
  }
}

startServer();


