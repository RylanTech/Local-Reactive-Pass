import { RequestHandler } from "express";
import { user } from "../models/user";
import { comparePasswords, hashPassword, verifyTwoFactor } from "../services/auth";
import { signUserToken, verifyUser } from "../services/authService";
import speakeasy from 'speakeasy'
import 'dotenv/config';


export const getUser: RequestHandler = async (req, res, next) => {
    let id = req.params.id
    let requestedUser = await user.findOne({
        where: {
            userId: id
        }
    })
    if (requestedUser) {
        res.status(200).send(requestedUser)
    } else {

        res.status(404).send()
    }
}

export const getallUsers: RequestHandler = async (req, res, next) => {

    let users = await user.findAll();
    res.status(200).json(users)
};

export const getallUsersLimited: RequestHandler = async (req, res, next) => {
    let users = await user.findAll({
        attributes: ['email', 'name', 'active', 'userId', 'accountType', 'userType'],
        limit: 20
    });

    res.status(200).json(users)
};

export const createUser: RequestHandler = async (req, res, next) => {
    try {
        let newUser: user = req.body;

        if (!newUser.email || !newUser.password || !newUser.name) {
            console.log("Missing information in request");
            return res.status(200).json({
                type: 'Info is missing in this request',
                success: false
            });
        }

        let usr = await user.findOne({ where: { email: newUser.email } });
        if (!usr) {
            let hashedPassword = await hashPassword(newUser.password);
            newUser.password = hashedPassword;

            let created = await user.create(newUser);



            return res.status(201).json({
                email: created.email,
                userId: created.userId,
                success: true
            });
        } else {
            return res.status(201).json({
                type: "Email in use",
                success: false
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
}

export const loginUser: RequestHandler = async (req, res, next) => {
    const { email, password, token } = req.body;

    if (!email || !password) {
        return res.status(203).json({
            success: false,
            type: "Email and Password required"
        });
    }

    console.log("test1")

    const existingUser: user | null = await user.findOne({
        where: { email }
    });

    if (!existingUser) {
        return res.status(200).json({
            success: false,
            type: "Incorrect Email, Password or 2FA key"
        });
    }

    console.log("test2")

    const loginAttempts = existingUser.loginAttempts;
    if (loginAttempts >= 20) {
        console.log(`${existingUser.name} Attempted to login too many times, their account has been locked until tomorrow`)
        return res.status(200).json({
            type: 'Too many login attempts - attempts will reset tomorrow',
            success: false
        });
    }

    console.log("test3")

    const passwordsMatch = await comparePasswords(password, existingUser.password);
    if (!passwordsMatch) {
        await user.update(
            { loginAttempts: loginAttempts + 1 },
            { where: { userId: existingUser.userId } }
        );
        return res.status(200).json({
            success: false,
            type: "Incorrect Email, Password or 2FA key"
        });
    }

    console.log("test4")

    const twoFactorKey = existingUser.twoFactorKey ? JSON.parse(existingUser.twoFactorKey) : null;
    if (twoFactorKey && twoFactorKey.twoFactorStatus) {
        if (!token) {
            return res.status(200).json({
                success: false,
                type: "Incorrect Email, Password or 2FA key"
            });
        }

        const verified = await verifyTwoFactor(token, existingUser.userId);
        if (!verified) {
            return res.status(200).json({
                success: false,
                type: "Incorrect Email, Password or 2FA key"
            });
        }
    }

    console.log("test5")

    await user.update(
        { loginAttempts: 0 },
        { where: { userId: existingUser.userId } }
    );

    console.log("test6")

    const jwtToken = await signUserToken(existingUser);
    return res.status(200).json({
        success: true,
        token: jwtToken
    });
};

export const verify: RequestHandler = async (req, res, next) => {
    try {
        let usr = await verifyUser(req)

        if (usr) {
            res.status(200).send(true)
        } else {
            res.status(200).send(false)
        }
    } catch {
        res.status(500).send()
    }
}


export const addTwoFactor: RequestHandler = async (req, res, next) => {
    try {
        let usr = await verifyUser(req)
        if (usr && req.body.masterPass) {
            let currentUser = await user.findByPk(usr.userId)
            if (currentUser) {
                let passwordsMatch = await comparePasswords(req.body.masterPass, currentUser.password)

                if (passwordsMatch) {
                    let secret: any = await speakeasy.generateSecret()
                    secret.twoFactorStatus = false
                    currentUser.twoFactorKey = JSON.stringify(secret)

                    await user.update(currentUser.dataValues, { where: { userId: currentUser.userId } });
                    res.status(200).json({
                        auth: true,
                        key: JSON.parse(currentUser.twoFactorKey).base32
                    })
                } else {
                    res.status(200).json({
                        auth: false
                    })
                }
            }
        } else {
            res.status(401).send("Missing fields")
        }
    } catch {
        res.status(500).send()
    }
}

export const removeTwoFactor: RequestHandler = async (req, res, next) => {
    try {
        let usr = await verifyUser(req)
        if (usr && req.body.masterPass) {
            let currentUser: any = await user.findByPk(usr.userId)
            if (currentUser) {
                let passwordsMatch = await comparePasswords(req.body.masterPass, currentUser.password)
                if (passwordsMatch) {
                    currentUser.twoFactorKey = null

                    let updatedUser = await user.update(currentUser.dataValues, { where: { userId: currentUser.userId } });
                    res.status(200).send("deleted")
                } else {
                    res.status(401).send("Wrong MasterPass")
                }
            }
        } else {
            res.status(401).send()
        }
    } catch {
        res.status(500).send()
    }
}

export const getTwoFactorStatus: RequestHandler = async (req, res, next) => {
    try {
        let usr = await verifyUser(req)
        if (usr) {
            let currentUser: any = await user.findByPk(usr.userId)
            if (currentUser) {

                if (!currentUser.twoFactorKey) {
                    return res.status(200).send(false)
                }

                let secretJson = JSON.parse(currentUser.twoFactorKey)

                if (!secretJson) {
                    return res.status(200).send(false)
                }

                if (secretJson.twoFactorStatus || secretJson.twoFactorStatus === true) {
                    res.status(200).send(true)
                } else {
                    res.status(200).send(false)
                }
            } else {
                res.status(401).send("User does not exist")
            }
        } else {
            res.status(401).send()
        }
    } catch {
        res.status(500).send()
    }
}

export const testTwoFactor: RequestHandler = async (req, res, next) => {
    try {
        let usr = await verifyUser(req)
        if (usr && req.body.token) {
            let currentUser: any = await user.findByPk(usr.userId)
            if (currentUser) {
                if (currentUser.twoFactorKey !== null) {
                    let verified = await verifyTwoFactor(req.body.token, currentUser.userId)
                    if (verified) {
                        res.status(200).send(true)
                    } else {
                        res.status(200).send(false)
                    }
                } else {
                    res.status(200).send(false)
                }
            } else {
                res.status(401).send("User does not exist")
            }
        } else {
            res.status(401).send()
        }
    } catch {
        res.status(500).send()
    }
}

export const modifyUser: RequestHandler = async (req, res, next) => {
    try {
        let newUser = req.body;
        let editingUser = await verifyUser(req);

        //Does the user exist? if yes contiune
        if (editingUser) {
            let userId = parseInt(req.params.id);
            newUser.userId = userId

            //Is the user making the edit the same user editing themselves? if yes continue
            if (editingUser.userId === userId) {
                if (newUser.userType) {
                    let foundUser = await user.findByPk(userId);
                    if (!foundUser) {
                        return res.status(404).send();
                    }

                    newUser.password = foundUser.password;
                    newUser.name = foundUser.name;
                    newUser.email = foundUser.email;

                    if (foundUser.dataValues.userId === parseInt(newUser.userId)) {
                        await user.update(newUser, { where: { userId } });
                        res.status(200).json();
                    } else {
                        res.status(400).send();
                    }
                } else {
                    res.status(400).send()
                }
            } else {
                res.status(401).send()
            }
        } else {
            return res.status(401).send();
        }
    } catch {
        return res.status(500).send("Error modifing user")
    }
};
