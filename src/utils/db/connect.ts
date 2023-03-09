import { Sequelize } from "sequelize";
import config from "../config/config";
import logger from "../logger/logger";
let sequelize: Sequelize;
export const connectDB = async (host: string, port: number) => {
  sequelize = new Sequelize(
    config.DB_NAME as string,
    config.DB_USERNAME as string,
    config.DB_PASSWORD,
    {
      host,
      port,
      dialect: "mysql",
    }
  );
  await sequelize
    .authenticate()
    .then(() => {
      logger.info("Connection to database has been established successfully");
    })
    .catch((err) => {
      logger.error(`Unable to connect to database \n Error: ${err}`);
    });
};
