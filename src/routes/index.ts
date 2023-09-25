import express from 'express';
import accounts from './accounts/api';
import app from './app/api';


const router = express.Router();


router.use('/accounts', accounts);
router.use('/app', app);

export default router;
