import { RequestHandler } from "express";
import { pass } from "../models/pass";
import { comparePasswords, hashPassword } from "../services/auth";
import { verifyUser } from "../services/authService";
import { decryptString, encryptString } from "../services/stringEncryption";
import { Op, Sequelize } from "sequelize";
import { user } from "../models/user";

export const getPassTitles: RequestHandler = async (req, res, next) => {
    try {
        let passArray: any = []
        let usr = await verifyUser(req)
        if (usr) {
            let entries = await pass.findAll({ where: { userId: usr.userId } })
            entries.map((entry) => {
                passArray.push(entry.serviceName)
            })

            res.status(200).json(passArray)
        } else {
            res.status(401).send()
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getPass: RequestHandler = async (req, res, next) => {
    try {
        const masterPass = req.body.masterPass
        let name = req.params.name
        let usr = await verifyUser(req)

        if (usr) {
            if (masterPass) {
                const passwordMatch = await comparePasswords(masterPass, usr.password)
                if (passwordMatch) {
                    let retrivedPass: any = await pass.findOne({ where: { serviceName: name, userId: usr.userId } })
                    let unEncrptedPass = retrivedPass.dataValues

                    if (retrivedPass.email) {
                        unEncrptedPass.email = await decryptString(retrivedPass.email, masterPass)
                    }

                    if (retrivedPass.password) {
                        unEncrptedPass.password = await decryptString(retrivedPass.password, masterPass)
                    }

                    if (retrivedPass.username) {
                        unEncrptedPass.username = await decryptString(retrivedPass.username, masterPass)
                    }

                    if (retrivedPass.twoFactorKey) {
                        unEncrptedPass.twoFactorKey = await decryptString(retrivedPass.twoFactorKey, masterPass)
                    }

                    if (retrivedPass.otherNotes) {
                        unEncrptedPass.otherNotes = await decryptString(retrivedPass.otherNotes, masterPass)
                    }

                    res.status(200).send(retrivedPass)
                } else {
                    res.status(200).send(false)
                }
            } else {
                res.status(400).send("masterPass required")
            }
        } else {
            res.status(401).send("No user signed in")
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

export const createPass: RequestHandler = async (req, res, next) => {
    try {
        let usr = await verifyUser(req);
        if (!usr) {
            return res.status(200).json({
                success: false,
                message: "Unauthorized, please try logging out and logging back in"
            });
        }

        let passEntry = req.body;
        if (!passEntry.serviceName) {
            return res.status(200).json({
                success: false,
                message: "Service Name is required"
            });
        }

        const masterPass = req.body.masterPass;
        let retrievedPass = await pass.findOne({ where: { serviceName: passEntry.serviceName, userId: usr.userId } });

        if (retrievedPass) {
            return res.status(200).json({
                success: false,
                message: "Service Name already exists"
            });
        }

        if (!masterPass) {
            return res.status(200).json({
                success: false,
                message: "Masterpass required"
            });
        }

        const passwordMatch = await comparePasswords(masterPass, usr.password);
        if (!passwordMatch) {
            return res.status(200).json({
                success: false,
                message: "Incorrect Masterpass"
            });
        }

        let storedPass = { ...passEntry, userId: usr.userId };

        if (passEntry.email) {
            storedPass.email = await encryptString(passEntry.email, masterPass);
        }
        if (passEntry.password) {
            storedPass.password = await encryptString(passEntry.password, masterPass);
        }
        if (passEntry.username) {
            storedPass.username = await encryptString(passEntry.username, masterPass);
        }
        if (passEntry.twoFactorKey) {
            storedPass.twoFactorKey = await encryptString(passEntry.twoFactorKey, masterPass);
        }
        if (passEntry.otherNotes) {
            storedPass.otherNotes = await encryptString(passEntry.otherNotes, masterPass);
        }

        await pass.create(storedPass);
        return res.status(201).json({
            success: true,
            message: "Pass creation success"
        });

    } catch (error) {
        return res.status(500).send(error);
    }
};


export const editPass: RequestHandler = async (req, res, next) => {
    try {
        let id = req.params.id;
        let usr = await verifyUser(req);
        if (usr) {
            let passEntry = req.body;
            const oldEntry = await pass.findByPk(id);
            if (oldEntry) {
                if (usr.userId === oldEntry.userId) {
                    if (passEntry.serviceName) {

                        const masterPass = req.body.masterPass
                        if (masterPass) {
                            const masterPass = req.body.masterPass

                            const passwordMatch = await comparePasswords(masterPass, usr.password)

                            if (passwordMatch) {
                                let storedPass = passEntry

                                storedPass.userId = usr.userId

                                if (passEntry.email) {
                                    storedPass.email = await encryptString(passEntry.email, masterPass)
                                }

                                if (passEntry.password) {
                                    storedPass.password = await encryptString(passEntry.password, masterPass)
                                }

                                if (passEntry.username) {
                                    storedPass.username = await encryptString(passEntry.username, masterPass)
                                }

                                if (passEntry.twoFactorKey) {
                                    storedPass.twoFactorKey = await encryptString(passEntry.twoFactorKey, masterPass)
                                }

                                if (passEntry.otherNotes) {
                                    storedPass.otherNotes = await encryptString(passEntry.otherNotes, masterPass)
                                }

                                pass.update(storedPass, { where: { passId: id } })
                                res.status(200).send(true)
                            } else {
                                res.status(200).send(false)
                            }
                        } else {
                            res.status(400).send("masterPass required")
                        }
                    }
                } else {
                    res.status(401).send("Not the same user")
                }
            } else {
                res.status(400).send("No such entry")
            }
        } else {
            res.status(401).send()
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

export const resetMasterPass: RequestHandler = async (req, res, next) => {
    try {
        let usr = await verifyUser(req)
        if (usr) {
            let masterPass = req.body.masterPass;
            let newMasterPass = req.body.newMasterPass;
            if (masterPass) {
                if (newMasterPass) {
                    const passwordMatch = await comparePasswords(masterPass, usr.password)
                    if (passwordMatch) {
                        let encryptedPasses = await pass.findAll({ where: { userId: usr?.userId } })
                        if (encryptedPasses.length > 0) {
                            encryptedPasses.map(async (encryptedPass) => {
                                let retrivedPass: any = await pass.findOne({ where: { serviceName: encryptedPass.serviceName } })
                                let unEncrptedPass = retrivedPass.dataValues


                                if (retrivedPass.email) {
                                    unEncrptedPass.email = await decryptString(retrivedPass.email, masterPass)
                                }

                                if (retrivedPass.password) {
                                    unEncrptedPass.password = await decryptString(retrivedPass.password, masterPass)
                                }

                                if (retrivedPass.username) {
                                    unEncrptedPass.username = await decryptString(retrivedPass.username, masterPass)
                                }

                                if (retrivedPass.twoFactorKey) {
                                    unEncrptedPass.twoFactorKey = await decryptString(retrivedPass.twoFactorKey, masterPass)
                                }

                                if (retrivedPass.otherNotes) {
                                    unEncrptedPass.otherNotes = await decryptString(retrivedPass.otherNotes, masterPass)
                                }

                                let newStoredPass = unEncrptedPass

                                //Afer unencrypting the passwords, re-encrypt them with the new password

                                if (unEncrptedPass.email) {
                                    newStoredPass.email = await encryptString(unEncrptedPass.email, newMasterPass)
                                }

                                if (unEncrptedPass.password) {
                                    newStoredPass.password = await encryptString(unEncrptedPass.password, newMasterPass)
                                }

                                if (unEncrptedPass.username) {
                                    newStoredPass.username = await encryptString(unEncrptedPass.username, newMasterPass)
                                }

                                if (unEncrptedPass.twoFactorKey) {
                                    newStoredPass.twoFactorKey = await encryptString(unEncrptedPass.twoFactorKey, newMasterPass)
                                }

                                if (unEncrptedPass.otherNotes) {
                                    newStoredPass.otherNotes = await encryptString(unEncrptedPass.otherNotes, newMasterPass)
                                }

                            

                                let id = unEncrptedPass.passId;
                                pass.update(newStoredPass, { where: { passId: id } })
                            })

                            let newUser = usr.dataValues
                            newUser.password = await hashPassword(newMasterPass)
                            user.update(newUser, { where: { userId: newUser.userId } })
                            res.status(200).send("Passwords re-encryted with new password, and masterPass reset")

                        } else {
                            let newUser = usr.dataValues
                            newUser.password = await hashPassword(newMasterPass)
                            user.update(newUser, { where: { userId: newUser.userId } })
                            res.status(200).send("masterPass reset")
                        }
                    } else {
                        res.status(200).send(false)
                    }
                } else {
                    res.status(400).send("No new masterPass")
                }
            } else {
                res.status(400).send("masterPass required")
            }
        } else {
            res.status(404).send("No user found")
        }

    } catch (error) {
        res.status(500).send(error)
    }
}

export const searchPass: RequestHandler = async (req, res, next) => {
    // Convert the search query to lowercase
    let query = req.params.query.toLowerCase();
    // Minimum length of the search query

    //To add a required query length, uncomment these lines of code

    // const minimumQueryLength = 3;
    // // Check if the query has fewer characters than the minimum length
    // if (query.length < minimumQueryLength) {
    //   return res.status(400).json({ error: 'Search query must have at least 3 characters' });
    // }

    try {
        let usr = await verifyUser(req)
        if (usr) {
            let searchArr: any = []
            let resultsDB = await pass.findAll({
                where: {
                    [Op.or]: [
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('serviceName')), 'LIKE', `%${query.toLowerCase()}%`),
                    ],
                    userId: usr.userId,
                },
                limit: 5,
            });

            resultsDB.map((result) => {
                searchArr.push(result.serviceName)
            })

            res.status(200).json(searchArr);
        }
    } catch (err) {
        res.status(404).json({ error: 'Database search query failed' });
    }
};

export const deletePass: RequestHandler = async (req, res, next) => {
    try {
        let id = req.params.id
        let usr = await verifyUser(req)
        if (usr) {
            const oldEntry = await pass.findByPk(id)
            if (oldEntry) {
                if (usr.userId === oldEntry.userId) {
                    pass.destroy({ where: { passId: id } })
                    res.status(200).send()
                } else {
                    res.status(401).send("Not the same user")
                }
            } else {
                res.status(400).send("No such entry")
            }
        } else {
            res.status(401).send()
        }
    } catch (error) {
        res.status(500).send(error)
    }
}