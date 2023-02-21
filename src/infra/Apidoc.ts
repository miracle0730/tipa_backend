import { getMetadataArgsStorage } from 'routing-controllers';
import { getFromContainer, MetadataStorage } from 'class-validator' // tslint:disable-line
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from 'class-transformer/storage'
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { injectable } from 'inversify';

@injectable()
export class Apidoc {
    constructor() { }

    public getDocContent(specPath: string) {
        return `
<!DOCTYPE html>
<html>

<head>
<title>TIPA API documentation</title>
<!-- needed for adaptive design -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

<!--
ReDoc doesn't change outer page styles
-->
<style>
    body {
        margin: 0;
        padding: 0;
    }
</style>
</head>

<body>
<redoc spec-url=${specPath}></redoc>
<script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
</body>

</html>`;
    }

    public getFullSpec() {
        const storage = getMetadataArgsStorage() as any;

        const routingControllersOptions = {};

        const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
        const schemas = validationMetadatasToSchemas(metadatas, {
            classTransformerMetadataStorage: defaultMetadataStorage,
            refPointerPrefix: '#/components/schemas/'
        });

        const spec = routingControllersToSpec(storage, routingControllersOptions, {
            components: {
                schemas,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'Token'
                    }
                }
            },
            security: [
                {
                    bearerAuth: []
                }
            ],
            servers: [
                { url: '//api.tipa-pro.com', description: 'Production server' },
                { url: '//api-dev.tipa-pro.com', description: 'Dev server' }
            ],
            info: {
                title: 'TIPA API',
                version: '1.0.0',
                description: ``
            }
        });

        return spec;
    }

}