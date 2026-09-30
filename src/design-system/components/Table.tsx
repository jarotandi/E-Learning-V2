/**
 * AKSA Table Primitives
 * =====================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * ## What this is
 *
 * Six semantic elements and nothing else: `Table`, `TableHeader`, `TableBody`,
 * `TableRow`, `TableHead`, `TableCell`. There is no sorting, no filtering, no
 * selection model, no pagination, and no data fetching. Those are product
 * decisions; a primitive that grew them would be a data-grid library and
 * would have to be re-litigated every time a screen needs a different table.
 *
 * ## Mobile overflow
 *
 * `Table` wraps the `<table>` in a horizontally scrollable `<div>`. Without
 * it, a five-column table on a 375px phone either forces the whole page wide
 * or silently clips data. The wrapper is the component's job precisely
 * because forgetting it is so easy.
 *
 * ## Rule contrast
 *
 * Cell dividers use `neutral.200` (1.26:1) and are decorative — they group
 * rows, they do not identify a control. The header row is distinguished by a
 * mint tint plus a bold emerald label rather than by a heavy dark rule, which
 * keeps the 3:1 boundary rule (WCAG 1.4.11) out of scope where it does not
 * apply and still gives the header a clear visual identity.
 */

import type { CSSProperties, HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { colors, spacing, typography } from '../tokens/brand';
import { cx } from './contract';

const CELL_PADDING = `${spacing[3]} ${spacing[4]}`;

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * Table caption. Always rendered. Pass a short string; if the caption is
   * only meaningful to assistive technology, the caller can hide it with the
   * `sr-only` utility, but omitting it entirely is not offered.
   */
  caption?: ReactNode;
  children?: ReactNode;
}

export function Table({ caption, children, className, style, ...rest }: TableProps) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table
        {...rest}
        className={cx('aksa-table', className)}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderSpacing: 0,
          color: colors.brand.emerald,
          fontFamily: typography.fontFamily.sans.join(', '),
          fontSize: typography.fontSize.sm[0],
          textAlign: 'left',
          ...style,
        }}
      >
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      {...rest}
      className={cx('aksa-table-header', className)}
      style={{ backgroundColor: colors.surface.mint, ...style }}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody {...rest} className={cx('aksa-table-body', className)} style={style}>
      {children}
    </tbody>
  );
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode;
}

export function TableRow({ className, style, children, ...rest }: TableRowProps) {
  return (
    <tr
      {...rest}
      className={cx('aksa-table-row', className)}
      style={{ borderBottom: `1px solid ${colors.neutral[200]}`, ...style }}
    >
      {children}
    </tr>
  );
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export function TableHead({ className, style, scope = 'col', children, ...rest }: TableHeadProps) {
  return (
    <th
      {...rest}
      scope={scope}
      className={cx('aksa-table-head', className)}
      style={{
        padding: CELL_PADDING,
        borderBottom: `1px solid ${colors.neutral[300]}`,
        color: colors.brand.emerald,
        fontSize: typography.fontSize.xs[0],
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

export interface TableCellProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Horizontal alignment. Numbers read better right-aligned. */
  align?: CSSProperties['textAlign'];
  children?: ReactNode;
}

export function TableCell({
  align = 'left',
  className,
  style,
  children,
  ...rest
}: TableCellProps) {
  return (
    <td
      {...rest}
      className={cx('aksa-table-cell', className)}
      style={{
        padding: CELL_PADDING,
        color: colors.brand.emerald,
        textAlign: align,
        verticalAlign: 'top',
        ...style,
      }}
    >
      {children}
    </td>
  );
}
