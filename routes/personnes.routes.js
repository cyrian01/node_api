import {Router} from 'express';
import * as ctrl from '../controllers/personne.controller.js';
import {valider, schemaId, schemaList, schemaCreation, schemaModification} from '../middleware/valider.js';

const router = Router();

router.get('/', valider({query:schemaList}), ctrl.lister);
router.post('/', valider({body:schemaCreation}), ctrl.creer);
router.get('/:id', valider({params:schemaId}), ctrl.lire);
router.patch('/:id', valider({params:schemaId, body:schemaModification}), ctrl.modifier);
router.delete('/:id', valider({params:schemaId}), ctrl.supprimer);

export default router;