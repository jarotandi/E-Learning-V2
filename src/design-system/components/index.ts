/**
 * AKSA Design-System Component Primitives — barrel
 * ================================================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Authority: docs/aksa/design/01-design-system.md
 *
 * ## This is the public surface of the primitive layer
 *
 * Import from `@/design-system/components` (or the relative equivalent), not
 * from the individual files, so the stylesheet below is guaranteed to load.
 *
 * ## Where the state layer is loaded
 *
 * `primitives.css` holds only the `:hover` / `:focus-visible` / `[aria-*]`
 * rules that a React style object cannot express. Every colour in it is a
 * `var(--aksa-*)` custom property published by the primitives themselves from
 * `src/design-system/tokens/brand.ts` — it contains no colour literal, so the
 * token file remains the single visual authority.
 *
 * It is imported from `src/main.tsx`, beside `index.css`, rather than from
 * this barrel. Two reasons:
 *
 *   - `index.css` is the legacy styling authority and B1.2 rule 2 keeps new
 *     work from rewriting it. Adding a block there would couple the new
 *     primitive layer to a file that is scheduled to shrink.
 *   - Keeping this barrel free of a `.css` import is what allows
 *     `scripts/verify-design-system.mjs` to import the real modules under
 *     plain Node and assert their actual exported API. A barrel that reaches
 *     for a stylesheet cannot be loaded that way.
 *
 * Every rule in the file is gated on a `data-aksa-*` attribute, so it cannot
 * affect a legacy component in `src/components/`.
 */

export {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Button,
  ButtonLink,
  type ButtonLinkProps,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from './Button';

export { IconButton, type IconButtonProps } from './IconButton';

export {
  CARD_PADDINGS,
  CARD_VARIANTS,
  Card,
  type CardPadding,
  type CardProps,
  type CardVariant,
} from './Card';

export {
  BADGE_SIZES,
  BADGE_VARIANTS,
  Badge,
  type BadgeProps,
  type BadgeSize,
  type BadgeVariant,
} from './Badge';

export {
  INPUT_SIZES,
  Input,
  type InputProps,
  type InputSize,
} from './Input';

export {
  Tabs,
  TabsPanel,
  TAB_LIST_SIZES,
  type TabItem,
  type TabListSize,
  type TabsPanelProps,
  type TabsProps,
} from './Tabs';

export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableCellProps,
  type TableHeadProps,
  type TableProps,
  type TableRowProps,
} from './Table';
