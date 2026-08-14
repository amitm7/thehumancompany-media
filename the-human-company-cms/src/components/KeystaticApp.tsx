import { makePage } from '@keystatic/astro/ui';
import keystaticConfig from '../../keystatic.config';

// The Keystatic admin app, rendered client-side at /keystatic.
export default makePage(keystaticConfig);
