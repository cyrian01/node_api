import express from 'express';
import 'dotenv/config';
import { env } from './config/env.js';
import {verifieConnexion, fermerPool} from'./config/db.js';
import personnesRoutes from './routes/personnes.routes.js';
import {routeInconnue, gestionnaireErreurs} from './middleware/erreurs.js';

const app = express();
const PORT = Number(env.PORT) || 3000;

app.get('/', (req, res) => {
  res.status(200).send('Hello World from Express!');
});

app.use(express.json({limit: '100kb'}));
app.use(express.static('public'));

app.get('/health', (req,res) => res.json({status:'ok'}));

app.use('/api/personnes', personnesRoutes);

app.use(routeInconnue);
app.use(gestionnaireErreurs);

let server ;
async function startServer() {
  try {

    await verifieConnexion();

    server = app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Échec du démarrage du serveur :', error);
    process.exit(1);
  }
}

startServer();

for (const signal of ['SIGTERM', 'SIGINT']) {
      process.on(signal, () => {
        console.log(`${signal} reçu — arrêt en cours`);
        server.close(async () => {
          await fermerPool();
          process.exitCode = 0;
        });
      });
}


