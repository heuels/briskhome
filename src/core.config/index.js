/** @flow
 * @briskhome
 * └core.config <lib/core.config/index.js>
 */

import path from 'path';
import nconf from 'nconf';
import properties from 'properties';
import { resources } from '../resources';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

module.exports = function setup(options: Object, imports: CoreImports, register: CoreRegister) {
  const parse = (dir: string) => properties.parse(dir, {
    comments: '#',
    separators: '=',
    sections: true,
    namespaces: true,
    variables: true,
  });

  const stringify = (dir: string) => properties.stringify(dir, {
    comment: '#',
    separator: '=',
    unicode: true,
  });

  /** Загрузчик переменных среды */
  nconf.env();
  const NODE_ENV = nconf.get('NODE_ENV') || 'briskhome';

  /** Загрузчик основной конфигурации приложения */
  nconf.use('briskhome', {
    type: 'file',
    file: path.resolve('etc', `${NODE_ENV}.conf`),
    format: {
      parse,
      stringify,
    },
  });

  const configs = resources('etc', null);
  for (let i = 0; i < configs.length; i += 1) {
    nconf.use(configs[i], {
      type: 'file',
      file: configs[i],
      format: {
        parse,
        stringify,
      },
    });
  }

  register(null, {
    config: () =>
      nconf.get(String(new Error().stack.split('\n')[2].split('/').slice(-2, -1)).replace('.', ':'))
  });
};
