import YAML from 'yamljs';
import { connector } from 'swagger-routes-express';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import controllers from '../../controllers';
import { APP_ENV } from 'src/config';

export const YAML_FILE: string = 'src/bootstrap/swagger.yml';

const swagger = async (app: Application) => {
  const apiDefinition = YAML.load(YAML_FILE);

  // swagger End point for api doc
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDefinition));

  // validation
  app.use(
    OpenApiValidator.middleware({
      apiSpec: YAML_FILE,
      validateRequests: true,
      //  validateResponses: true,
      //   validateSecurity: true,
    })
  );

  const connect = connector(controllers, apiDefinition, {
    security: {
      //   eg: JWT,
    },
    middleware: {
      // eg: user, vendor,
    },
  });

  connect(app);
};

export default swagger;
