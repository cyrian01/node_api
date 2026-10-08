import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => console.error ('Erreur de pool PostgreSQL', err));

export const requete = (texte, params) => pool.query(texte, params);

export async function verifieConnexion() {
    const {rows} = await pool.query('SELECT NOW() AS maintenant');
    console.log('PostgreSQL connecté - ', rows[0].maintenant.toISOString());
}

export const fermerPool = () => pool.end();