export const config = {
    name: process.env.APP_NAME || 'TIPA API',
    port: process.env.PORT || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
    environment: process.env.ENVIRONMENT || 'dev',
    db: {
        url: process.env.DATABASE_URL
    },
    auth: {
        minPwdLength: 8,
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    },
    s3: {
        bucket: process.env.MEDIA_BUCKET,
        accessKeyId: process.env.AWS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
    },
    mailgun: {
        privateApiKey: process.env.MAILGUN_PRIVATE_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
        host: process.env.MAILGUN_HOST,
        mail: process.env.MAILGUN_MAIL
    },
    signUp: {
        jwt: {
            secret: process.env.JWT_ACTIVATE_SECRET,
            expiresIn: process.env.JWT_ACTIVATE_EXPIRES_IN,
        }
    },
    resetPassword: {
        jwt: {
            secret: process.env.JWT_RESET_PASSWORD_SECRET,
            expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
        }
    },
    frontendHost: process.env.FRONTEND_HOST,
    corpEmailDomain: process.env.TIPA_CORP_EMAIL_DOMAIN,
    zoho: {
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        user_identifier: process.env.ZOHO_USER_IDENTIFIER,
        access_token: process.env.ZOHO_ACCESS_TOKEN,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        api_key: process.env.ZOHO_API_KEY
    },
    microsoftOffice: {
        app_id: process.env.MS_OFFICE_APP_ID,
        app_secret: process.env.MS_OFFICE_APP_SECRET,
        graph_scope_url: process.env.MS_OFFICE_GRAPH_SCOPE_URL,
        tenant_id: process.env.MS_OFFICE_TENANT_ID,
        user_id: process.env.MS_OFFICE_USER_ID
    }
};