import * as Personne from '../models/personne.model.js';
import ah from '../middleware/async_handler.js';


const introuvable = () => {
    const e = new Error('Personne introuvable');
    e.status = 404;
    return e;
}

// API GET /api/personnes?page=1&limite=20&sex=femme&tri=-age
export const lister = ah(async (req, res) => {
    const {page, limite, sexe, tri} = req.query;
    const {lignes, total} = await Personne.lister({page, limite, sexe, tri});

    res.json({
        data: lignes,
        paginaation: {page, limite, total, pages: Math.ceil(total/limite)},
    });
});

// GET /api/personnes/:id
export const lire = ah(async (req,res) => {
    const personne = await Personne.parID(req.params.id);
    if(!personne) throw introuvable();
    res.json(personne);
});

// POST /api/personnes
export const creer = ah(async (req, res) => {
    const personne = await Personne.creer(req.body);
    res.satus(201).location(`/api/personnes/${personne.id}`).json(personne);
});


// PATCH /api/personnes/:id
export const modifier = ah(async (req,res) => {
    const personne = await Personne.modifier(req.params.id, req.body);
    if(!personne) throw introuvable();
    res.json(personne);
});

// DELETE /api/personnes/:id
export const supprimer = ah(async (req,res) => {
    const supprime = await Personne.supprimer(req.params.id);
    if(!supprime) throw introuvable();
    res.sendStatus(204); //succes sans contenu
});