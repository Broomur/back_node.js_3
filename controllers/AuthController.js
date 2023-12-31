import User from "../models/User.js";
import TokenBlackList from "../models/TokenBlackList.js";
import * as argon2 from "argon2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const AuthController = async (req, res) => {
    if (req.method === "GET") {
        if (req.path === "/logout") {
            const token = req.cookies.access;
            TokenBlackList.create({token: token});
            res.json({ message: "logout" });
        } else if (req.path === "/me") {
            res.json({ message: true });
        }
    } else if (req.method === "POST") {
        if (req.path === "/login") {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(404).json({ message: "missing email or password" });
            } else if (email && password) {
                const user = await User.findOne({
                    where: { email: email },
                });
                if (user) {
                    const hashPassword = user.password;
                    const match = await argon2.verify(hashPassword, password);
                    if (match) {
                        const payload = { userID: user.id };
                        const options = { expiresIn: "2h"};
                        const token = jwt.sign(payload, process.env.SERVER_SECRET, options);
                        res.cookie("access", token, { httpOnly: true, sameSite: "Lax" });
                        res.json({ message: "login successful" });
                    } else {
                        res.status(401).json({ message: "login failed" });
                    }
                } else {
                    res.status(404).json({ message: "no user found" });
                }
            }
        }
    }
}

export default AuthController;