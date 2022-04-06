const express = require("express");
const port = process.env.PORT || 3002;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');
const usersDB = {
    users: require('./users.json'),
    setUsers: function (data) { this.users = data }
}
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.username;
            next();
        }
    );
}

app.post("/auth", async (req, res) => {
    console.log("ksksksk", req.body)
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = usersDB.users.find(person => person.username === user);
    console.log("found user", foundUser)
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    console.log("match", match)
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '.', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
});

app.get("/refresh", async (req, res) => {
    console.log("Hello");
    const cookies = req.cookies;
    console.log("cookies", cookies)
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
});


app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening on port ${port}`);
    }
});
