import {env} from '../config/env.js';


const CODE_PG = {
    '23505': [409, 'Cette valeur est déjà utilisée'],
    '23503': [409, 'Référence inexistante'],
    '23502': [422, 'Champ obligatoire manquant'],
    '22P02': [400, 'Format de valeur invalide'],
};


export function routeInconnue(req,res){
    res.status(404).json({erreur: 'Route Inconnue', chemin: req.originalUrl });
}


export function gestionnaireErreur(err, req, res, next){
    if (res.headerSent) return next(err);

    const [statutPg, messagePg] = CODE_PG[err.code] ?? [];
    const statut = statutPg ?? err.status ?? 500;

    if(statut >= 500) console.error(err);

    res.status(statut).json({
        erreur : statut >= 500 ? 'Erreur interne' : (messagePg ?? err.message),
        details: err.details,
        pile: env.NODE_ENV === 'dev' && statut >= 500 ? err.stack : undefined,
    });
}