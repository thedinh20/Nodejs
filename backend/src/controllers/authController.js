import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Session } from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14*24*60*60*1000; // 14 ngay

export const signUp = async (req, res ) => {
    try {
        const {username, password, email, firstName, lastName} = req.body;

        if(!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: "Không thể thiếu username, password, email, firstName, và lastName"
            });
        }

        // kiem tra username da ton tai chua
        const duplicateUser = await User.findOne({username});

        if(duplicateUser) {
            return res.status(409).json({
                message: 'Username da ton tai',
            });
        }

        // ma hoa password
        const hashedPassword = await bcrypt.hash(password, 10); //salt = 10

        // tao user moi va luu vao db
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${lastName} ${firstName}`,
        });

        // tra ve ket qua
        return res.sendStatus(204); 
    } catch (error) {
        console.error('Lỗi khi gọi signUp', error);
        return res.status(500).json({message: 'Lỗi hệ thống' });
    }
}

export const signIn = async (req, res) => {
    try {
        // lay du lieu tu body
        const {username, password} = req.body;

        if(!username || !password) {
            return res.status(400).json({message: 'Thiếu username hoặc password.'});
        }

        // lay hashedPassword tu db dua tren username
        const user = await User.findOne({username});

        if(!user) {
            return res.status(401).json({
                message: 'Sai username hoac password',
            });
        }

        // kiem tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if(!passwordCorrect) {
            return res.status(401).json({
                message: 'Sai username hoac password',
            });
        }

        // so sanh password voi hashedPassword
        const accessToken = jwt.sign(
            {userId: user._id}, 
            // @ts-ignore
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: ACCESS_TOKEN_TTL}
        );

        // tao refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // tao session luu refresh token vao db
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // tra ve access token cho cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        });

        // tra ve access token cho client
        return res.status(200).json({
            message: `User ${user.displayName} đã logged in!`, 
            accessToken,
        });

    } catch (error) {
        console.error('Lỗi khi gọi signIn', error);
        return res.status(500).json({
            message: 'Lỗi hệ thống',
        });
    }
};

export const signOut = async (req, res) => {
    try {
        // lay refresh token tu cookie
        const token = req.cookie?.refreshToken;
        
        if(!token) {
        // xoa session trong session 
            await Session.deleteOne({refreshToken: token});
        // xoa cookie tren trinh duyet            
            res.clearCookie('refreshToken');
        }
        return res.sendStatus(204);

    } catch (error) {
        console.error('Lỗi khi gọi signOut', error);
        return res.status(500).json({
            message: 'Lỗi hệ thống',
        });
    }
};

// tao aaccess token moi bang refresh token
export const refreshToken = async (req, res) => {
    try {
        // lay refresh token tu cookie
        const token = req.cookies?.refreshToken;
        if(!token) {
            return res.status(401).json({
                message: 'Token không tồn tại.',
            });
        }

        // so sanh token voi db
        const session = await Session.findOne({refreshToken: token});
        if(!session) {
            return res.status(403).json({
                message: 'Token không hợp lệ hoặc đã hết hạn',
            });
        }
        // kiem tra het han
        if(session.expiresAt < new Date()) {
            // xoa session trong db
            // await Session.deleteOne({refreshToken: token});
            return res.status(403).json({
                message: 'Token đã hết hạn.',
            });
        }

        // tao access token moi
        const accessToken = jwt.sign(
            {userId: session.userId}, 
            // @ts-ignore
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: ACCESS_TOKEN_TTL}
        );
        // tra ve access token moi
        return res.status(200).json({
            accessToken,
        });
        
    } catch (error) {
        console.error('Lỗi khi gọi refreshToken', error);
        return res.status(500).json({
            message: 'Lỗi hệ thống',
        });
    }
};

export const test = async (req, res) => {
    return res.sendStatus(204).json({
        message: 'Test route is working!',
    });
}