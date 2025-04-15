const authConfig = {
    jwtSecret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: '1d',
};

export default authConfig;