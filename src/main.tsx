/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppRouter from './app/router/AppRouter';
import './index.css';
// AKSA design-system primitive STATE layer (`:hover`, `:focus-visible`,
// `[aria-invalid]`, `[data-aksa-disabled]`). Imported here, beside
// `index.css`, rather than from `design-system/components/index.ts`.
//
// B1.4A note: this keeps the component barrel pure TypeScript, which is what
// lets `scripts/verify-design-system.mjs` import the real modules and assert
// their actual exported API. A barrel that reaches for a `.css` file cannot be
// loaded by plain Node. It also follows the convention already established in
// this file: global stylesheets are loaded once, at the entry point.
//
// The file contains no colour literals — every value is a `var(--aksa-*)`
// custom property published by the primitives from the token contract.
import './design-system/components/primitives.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
