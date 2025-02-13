import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
