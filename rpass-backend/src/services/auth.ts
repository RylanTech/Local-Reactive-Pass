import bcrypt from 'bcrypt';
import { user } from '../models/user';
import speakeasy from 'speakeasy';

export const hashPassword = async (plainTextPassword: string) => {
  const saltRound = 7;
  const hash = await bcrypt.hash(plainTextPassword, saltRound);
  return hash;
}

export const comparePasswords = async (plainTextPassword: string, hashPassword: string) => {
  return await bcrypt.compare(plainTextPassword, hashPassword);
}

export const verifyTwoFactor = async (token: string, userId: number) => {
  try {
    const usr = await user.findByPk(userId)
    if (usr) {
      const secretJson = JSON.parse(usr.twoFactorKey)
      const secret = secretJson.base32
      const status = secretJson.twoFactorStatus

      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token
      })

      if (verified) {
        if (status === false) {
          secretJson.twoFactorStatus = true
          let updatedUser = usr.dataValues
          updatedUser.twoFactorKey = JSON.stringify(secretJson)
          await user.update(updatedUser, {
            where: {
              userId: usr.userId
            }
          })
          return true
        } else if (status === true) {
          return true
        }
      } else {
        return false
      }
    }
  } catch (error) {
    return error
  }
}