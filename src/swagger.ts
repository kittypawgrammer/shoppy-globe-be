import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUiExpress from "swagger-ui-express";
import YAML from "yamljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the OpenAPI spec once at startup; it is served by Swagger UI on /api-docs.
export const swaggerDocument = YAML.load(
  path.join(__dirname, "..", "docs", "openapi.yaml")
) as object;

export const swaggerUi = swaggerUiExpress;
