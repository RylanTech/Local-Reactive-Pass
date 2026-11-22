import { Sequelize } from "sequelize";
import { userFactory } from "./user";
import { AssociateUserPass, passFactory } from "./pass";
import 'dotenv/config';

const dbName = process.env.DB_NAME ?? '';
const username = process.env.DB_USER ?? '';
const password = process.env.DB_PASS ?? '';
const dbHost = process.env.DB_HOST ?? '';

const sequelize = new Sequelize(dbName, username, password, {
    host: dbHost,
    port: 3306,
    dialect: 'mysql'
});

userFactory(sequelize);
passFactory(sequelize);
AssociateUserPass();

export const db = sequelize;
