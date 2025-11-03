import express from 'express';
import multer from 'multer';
import { addCheque, getCheques, updateChequeStatus } from '../controller/chequeController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), addCheque);
router.get('/', getCheques);
router.patch('/:id/status', updateChequeStatus);

export default router;
