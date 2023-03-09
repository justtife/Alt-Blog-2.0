import { Sequelize } from "sequelize";
import config from "./config";
let sequelizeConfig = new Sequelize(
  config.DB_NAME as string,
  config.DB_USERNAME as string,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: config.DB_PORT as number,
    dialect: "mysql",
  }
);
export default sequelizeConfig;
