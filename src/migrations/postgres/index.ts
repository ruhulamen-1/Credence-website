import * as migration_20261018_104945_initial from './20261018_104945_initial';
import * as migration_20261018_110842_hero_image from './20261018_110842_hero_image';
import * as migration_20261018_113321_hero_cutout from './20261018_113321_hero_cutout';
import * as migration_20261018_113924_branding_footer from './20261018_113924_branding_footer';

export const migrations = [
  {
    up: migration_20261018_104945_initial.up,
    down: migration_20261018_104945_initial.down,
    name: '20261018_104945_initial',
  },
  {
    up: migration_20261018_110842_hero_image.up,
    down: migration_20261018_110842_hero_image.down,
    name: '20261018_110842_hero_image',
  },
  {
    up: migration_20261018_113321_hero_cutout.up,
    down: migration_20261018_113321_hero_cutout.down,
    name: '20261018_113321_hero_cutout',
  },
  {
    up: migration_20261018_113924_branding_footer.up,
    down: migration_20261018_113924_branding_footer.down,
    name: '20261018_113924_branding_footer'
  },
];
