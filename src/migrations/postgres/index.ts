import * as migration_20261018_104945_initial from './20261018_104945_initial';
import * as migration_20261018_110842_hero_image from './20261018_110842_hero_image';

export const migrations = [
  {
    up: migration_20261018_104945_initial.up,
    down: migration_20261018_104945_initial.down,
    name: '20261018_104945_initial',
  },
  {
    up: migration_20261018_110842_hero_image.up,
    down: migration_20261018_110842_hero_image.down,
    name: '20261018_110842_hero_image'
  },
];
