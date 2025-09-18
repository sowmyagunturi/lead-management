import { Router } from "express";
const router = Router();
import validateToken from '../Middlewares/validateTokenhandler.js'
import {validateLead } from '../Middlewares/LeadValidation.js'
import {createLead, getLeads, getLeadById, updateLead, deleteLead} from '../Controllers/LeadController.js';

router.get('/',validateToken ,getLeads)

router.get('/:id',validateToken,getLeadById)

router.post('/',validateToken,validateLead,createLead);

router.put('/:id',validateToken,updateLead)

router.delete('/:id',validateToken,deleteLead)

export default router;