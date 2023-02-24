import { Container } from 'inversify';

export let container = new Container({ autoBindInjectable: true });

export const TYPES = {
    'Logger': Symbol.for('Logger'),
    'Controller': Symbol.for('Controller'),
    'ConnectionProvider': Symbol.for('ConnectionProvider'),
    'DefaultConnection': Symbol.for('DefaultConnection'),
    'Auth': Symbol.for('Auth'),
    'UserRepository': Symbol.for('UserRepository'),
    'CategoryRepository': Symbol.for('CategoryRepository'),
    'ApplicationRepository': Symbol.for('ApplicationRepository'),
    'ProductRepository': Symbol.for('ProductRepository'),
    'ProductImageRepository': Symbol.for('ProductImageRepository'),
    'ApplicationImageRepository': Symbol.for('ApplicationImageRepository'),
    'ThicknessRepository': Symbol.for('ThicknessRepository'),
    'SettingsRepository': Symbol.for('SettingsRepository')
};