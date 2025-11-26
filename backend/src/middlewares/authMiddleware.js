import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// middleware xac minh jwt user la ai
export const protectedRoute = async (req, res, next) => {
    try {
        // lay token tu header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];// Bearer <token>
        if(!token) {
            return res.status(401).json({
                message: 'Khong co token, truy cap bi tu choi',
            });
        }

        // kiem tra token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if(err) {
                console.error(err);
                return res.status(403).json({
                    message: 'Token khong hop le, truy cap bi tu choi',
                });
            }
            // tim user tu token
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');
            if(!user) {
                return res.status(404).json({
                    message: 'Khong tim thay user',
                });
            }

            // gan user vao req
            req.user = user;
            next();
        });

    } catch (error) {
        console.error('Loi khi xac minh jwt trong authmiddleware:', error);
        return res.status(500).json({
            message: 'loi he thong',
        });
    }
};