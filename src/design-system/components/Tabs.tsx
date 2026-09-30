/**
 * AKSA Tabs Primitive
 * ===================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Authority: docs/aksa/design/06-responsive-accessibility.md
 *            WAI-ARIA Authoring Practices — Tabs pattern
 *
 * ## Controlled, and not bound to the router
 *
 * `activeId` + `onChange` is the entire contract. The primitive never reads a
 * URL and never imports a path builder, so the same component serves a
 * client-side tab strip, a wizard step indicator, and a Studio panel switcher.
 *
 * ## Keyboard behaviour (implemented, not stubbed)
 *
 * Follows the APG tabs pattern with automatic activation:
 *
 *   ArrowRight / ArrowLeft  move to the next/previous enabled tab and select it
 *   Home / End              jump to the first/last enabled tab
 *   Tab                     leaves the tablist entirely (roving tabindex)
 *
 * The roving tabindex means the tablist occupies ONE tab stop, which is what
 * stops a five-tab header from costing a keyboard user five Tab presses.
 *
 * Activation is automatic rather than manual because these are panel switches,
 * not form fields; a user arrowing past a tab expects to see it.
 */

import { useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

import { colors, radius, spacing, targetSize, typography } from '../tokens/brand';
import { FOCUS_VARS, cx, withVars } from './contract';

export interface TabItem {
  /** Stable identifier. Used for React keys and for the tab/panel id wiring. */
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export const TAB_LIST_SIZES = Object.freeze(['sm', 'md'] as const);
export type TabListSize = (typeof TAB_LIST_SIZES)[number];

const SIZE = {
  sm: { fontSize: typography.fontSize.sm[0], padding: `${spacing[2]} ${spacing[3]}` },
  md: { fontSize: typography.fontSize.base[0], padding: `${spacing[3]} ${spacing[4]}` },
} as const;

export interface TabsProps {
  items: readonly TabItem[];
  /** Id of the selected tab. */
  activeId: string;
  /** Called with the newly selected tab id. */
  onChange: (id: string) => void;
  /** Accessible name for the tablist. Required: a bare `role="tablist"` is not named. */
  ariaLabel: string;
  size?: TabListSize;
  className?: string;
}

export function Tabs({
  items,
  activeId,
  onChange,
  ariaLabel,
  size = 'md',
  className,
}: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const s = SIZE[size];

  function focusAt(index: number) {
    const count = items.length;
    for (let step = 0; step < count; step += 1) {
      const candidate = (index + step + count) % count;
      if (!items[candidate].disabled) {
        tabRefs.current[candidate]?.focus();
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = items.findIndex((item) => item.id === activeId);
    if (current === -1) return;

    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        next = current + 1;
        break;
      case 'ArrowLeft':
        next = current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusAt(next);
    const target = items[(next + items.length) % items.length];
    if (target && !target.disabled) onChange(target.id);
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cx('aksa-tabs', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[1],
        borderBottom: `1px solid ${colors.neutral[200]}`,
        overflowX: 'auto',
      }}
    >
      {items.map((item, index) => {
        const selected = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`aksa-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`aksa-panel-${item.id}`}
            disabled={item.disabled}
            // Roving tabindex: only the selected tab is in the tab order.
            tabIndex={selected ? 0 : -1}
            data-aksa-tab=""
            data-aksa-focusable=""
            className="aksa-tab"
            style={withVars(
              {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                minHeight: targetSize.min,
                padding: s.padding,
                marginBottom: '-1px',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: s.fontSize,
                fontWeight: selected ? 700 : 600,
                color: selected
                  ? colors.brand.emerald
                  : colors.neutral[600],
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                borderBottom: selected
                  ? `2px solid ${colors.brand.tealAccessible}`
                  : '2px solid transparent',
                borderRadius: `${radius.md} ${radius.md} 0 0`,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                opacity: item.disabled ? 0.55 : 1,
                transition: 'background-color 150ms ease, color 150ms ease',
              },
              {
                ...FOCUS_VARS,
                '--aksa-tab-bg-hover': colors.surface.mint,
                '--aksa-tab-color-hover': colors.brand.emerald,
              },
            )}
            onClick={() => {
              if (!item.disabled) onChange(item.id);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TabsPanelProps {
  /** Must match the `id` of the corresponding `TabItem`. */
  id: string;
  /** The currently selected tab id. */
  activeId: string;
  children?: ReactNode;
  className?: string;
}

/**
 * The panel paired with a `Tabs` entry.
 *
 * `tabIndex={0}` is not optional: APG requires a scrollable region to be
 * focusable, otherwise a keyboard user cannot scroll a long panel.
 */
export function TabsPanel({ id, activeId, children, className }: TabsPanelProps) {
  const active = id === activeId;
  const style: CSSProperties = {
    paddingTop: spacing[5],
  };
  return (
    <div
      role="tabpanel"
      id={`aksa-panel-${id}`}
      aria-labelledby={`aksa-tab-${id}`}
      hidden={!active}
      tabIndex={0}
      data-aksa-focusable=""
      className={cx('aksa-tabs-panel', className)}
      // A negative offset keeps the ring inside the panel box, so a long panel
      // nested in a padded container cannot be clipped by its own overflow.
      style={withVars(style, { ...FOCUS_VARS, outlineOffset: '-2px' })}
    >
      {children}
    </div>
  );
}

export default Tabs;
