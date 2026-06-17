import { Router } from 'express';
import { register, login, sendOTP, verifyOTP, getProfile, getUserRoles } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.get('/profile', getProfile);
router.get('/roles', getUserRoles);

export default router;
