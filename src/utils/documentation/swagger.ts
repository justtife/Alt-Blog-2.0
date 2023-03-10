import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version, license, description, author } from "../../../package.json";
import logger from "../logger/logger";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AltBlog API Documentation",
      version,
      description,
    },
    license: {
      name: license,
      url: "http://localhost:4321/",
    },
    contact: {
      name: author,
      url: "https://justtech.net",
      email: "farinubolu@gmail.com",
    },
    components: {
      securitySchemas: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "f&f.sid",
        },
      },
    },
    security: [{ cookieAuth: [], sessionAuth: [] }],
  },
  apis: ["./src/routes/*.route.ts", "./src/schema/*.schema.ts"],
};
var Otheroptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Teepha F&F Doc",
  customfavIcon:
    "https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg",
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app: Express, port: any) {
  //Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, Otheroptions));
  //Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  logger.info(`Documentation available at http://localhost:${port}/docs`);
}
export default swaggerDocs;
