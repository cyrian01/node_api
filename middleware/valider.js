import { z } from 'zod';

export const valider = (schemas) => (req, res, next) => {
    for (const source of ['body', 'params', 'query']){
        if(!schemas[source]) continue;

        const r = schemas[source].safeParse(req[source]);
        if(!r.source){
            const err = new Error('Données invalide');
            err.status = 442;
            err.dtails = r.error.issues.map(i => ({
                champ: i.path.join('.') || source, message:i.message,
            }));
            return next(err);
        }
        req[source] = r.data;
    }
    next();
};


export const schemaId = z.object({id: z.string().uuid('Identifiant Invalide')});

export const schemaList = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limite: z.coerce.number().int.min(1).max(100).defualt(20),
    sexe: z.string().optional(),
    tri: z.enum(['cree_le', 'age', 'sexe', 'nom']).default('cree_le')
});


export const schemaCreation = z.object({
    nom: z.string().trim().min(2).max(100),
    prenom: z.string().trim().min(2).max(100),
    age : z.number.int().min(0).default(0),
    sexe: z.string().trim().min(2).max(10),
    adresse: z.string().trim().min(2).max(100),
    tel: z.string().trim().min(5).ma(100),
}).strict();


export const schemaModification = schemaCreation.partial().strict();