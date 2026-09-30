/**
 * AKSA Icon Button Primitive
 * =========================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * ## Why this exists
 *
 * `Button iconOnly` already renders a square, minimum-target control. This
 * module exists because the public header needs a square control that also
 * carries a tooltip-style label and, optionally, a pressed/expanded state, and
 * because an icon-only control is exactly the place where an accessible name
 * gets forgotten. Wrapping `Button` would not add anything: it would only
 * re-declare the same "square + min target" rule at a second call site.
 *
 * ## `aria-label` is required by the type system
 *
 * `Button`'s props are a union that makes `'aria-label'` mandatory when
 * `iconOnly` is true, and `IconButton` sets `iconOnly` — so an unlabelled
 * icon-only control does not compile. There is no runtime warning to miss.
 */

import type { ReactNode, Ref } from 'react';

import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';

export interface IconButtonProps
  extends Omit<ButtonProps, 'iconOnly' | 'children' | 'ref'> {
  /** The icon. Should be `aria-hidden`; the accessible name is `aria-label`. */
  icon: ReactNode;
  /** Required. The control's accessible name. */
  'aria-label': string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({ icon, ...rest }: IconButtonProps) {
  return (
    <Button iconOnly {...rest}>
      {/* The icon is decorative: the accessible name is `aria-label`, so
          exposing the SVG as well would make screen readers announce it
          twice. */}
      <span aria-hidden="true" style={{ display: 'inline-flex' }}>
        {icon}
      </span>
    </Button>
  );
}

export default IconButton;
