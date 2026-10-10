import {requete} from './../config/db.js';

const CHAMPS = `id, nom, prenom, age, sexe, adresse, tel, cree_le, maj_le`;
const TRIS = {cree_le: 'cree_le', age: 'age', sexe: 'sexe', nom: 'nom'};

export async function lister ({page, limite, sexe, tri}){

    const filtres = [];
    const params = [];

    if(sexe){
        params.push(sexe);
        filtres.push(`sexe = $${params.length}`);
    }

    const WHERE = filtres.length ? `WHERE ${filtres.join(' AND ')}` : '';

    const desc = tri.startsWith('-');
    const colonne = TRIS[desc ? tri.slice(1) : tri] ?? 'cree_le';
    const ordre = `ORDER BY ${colonne} ${desc ? 'DESC' : 'ASC'}`;

    params.push(limite, (page - 1) * limite);

    const {rows} = await requete (`SELECT ${CHAMPS} FROM personne ${WHERE} ${ordre}
        LIMIT $${params.length - 1} OFFSET $${params.length}`, params);

    const { rows : [{total}] } = await requete(`SELECT COUNT(*)::int AS total FROM personne ${WHERE}`, 
        params.slice(0, filtres.length));

    return {lignes: rows, total};
}


export async function parID(id){
    const {rows} = await requete (`SELECT ${CHAMPS} FROM personne WHERE id=$1`, [id]);
    return rows[0] ?? null ;
}


export async function creer({nom, prenom, age, sexe, adresse, tel}){
    const {rows} = await requete(`INSERT INTO personne (nom, prenom, age, sexe, adresse, tel)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${CHAMPS}`, [nom, prenom, age, sexe, adresse ?? null, tel]);
    return rows[0];
}


export async function modifier(id, champs){
    const cles = Object.keys(champs);
    if (cles.length === 0) return parID(id);

    const affectations = cles.map((c,i) => `${c} = $${i+2}`).join(', ');

    const {rows} = await requete(`UPDATE personne SET ${affectations}, maj_le=NOW()
                                WHERE id=$1 RETURNING ${CHAMPS}`,
                                [id, ...cles.map(c => champs[c])]);
    
    return rows[0] ?? null;
}


export async function supprimer(id){
    const {rowCount} = await requete(`DELETE FROM personne WHERE id=$1`, [id]);

    return rowCount > 0;
}