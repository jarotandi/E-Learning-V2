/**
 * AKSA Input Primitive
 * ====================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Authority: docs/aksa/design/06-responsive-accessibility.md
 *
 * ## What this is
 *
 * A labelled text field with error, helper-text, and disabled states. It owns
 * the label/description WIRING (ids, `aria-describedby`, `aria-invalid`) and
 * nothing else. Form state, submission, validation rules, and value storage
 * stay with the caller — a primitive that owned them would be a form library.
 *
 * ## Border contrast — the one non-obvious decision here
 *
 * `neutral.300` measures 1.48:1 against white and `neutral.200` 1.26:1. Both
 * fail the 3:1 that WCAG 1.4.11 requires for the boundary of a control whose
 * state must be identified. The legacy login/register forms use a
 * `slate-200` border, which is the same problem; that is legacy CSS and is
 * B1.4C's business, not a reason to copy it here.
 *
 * An input's resting border therefore uses `neutral.500` (#737373, 4.74:1 on
 * white). The focus border uses `brand.tealAccessible` (5.32:1) and the
 * error border `semantic.error` (4.83:1). None of these is a token invented
 * for this file — they are all reads of the existing palette.
 */

import { useId } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

import { colors, radius, spacing, targetSize, typography } from '../tokens/brand';
import { FOCUS_VARS, cx, withVars } from './contract';

export const INPUT_SIZES = Object.freeze(['sm', 'md', 'lg'] as const);
export type InputSize = (typeof INPUT_SIZES)[number];

const SIZE = {
  sm: { fontSize: typography.fontSize.sm[0], minHeight: targetSize.min, padding: `${spacing[2]} ${spacing[3]}` },
  md: { fontSize: typography.fontSize.base[0], minHeight: targetSize.recommended, padding: `${spacing[3]} ${spacing[4]}` },
  lg: { fontSize: typography.fontSize.base[0], minHeight: '3.25rem', padding: `${spacing[3]} ${spacing[5]}` },
} as const;

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  /** Visible label. Rendered above the field and linked with `htmlFor`. */
  label?: ReactNode;
  /**
   * Keeps the label in the accessibility tree but removes it visually. Use
   * when the surrounding copy already names the field, so a screen reader is
   * not told twice.
   */
  hideLabel?: boolean;
  /** Error message. Sets `aria-invalid` and takes precedence over helper text. */
  error?: ReactNode;
  /** Supplementary guidance. Hidden from AT when an error is present. */
  helperText?: ReactNode;
  size?: InputSize;
  /** Applied to the `<input>` itself. */
  className?: string;
  /** Applied to the wrapper that holds label, input, and messages. */
  containerClassName?: string;
}

export function Input({
  label,
  hideLabel = false,
  error,
  helperText,
  size = 'md',
  disabled = false,
  required = false,
  id,
  className,
  containerClassName,
  style,
  'aria-describedby': describedBy,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const hasError = error !== undefined && error !== null && error !== '';
  const message = hasError ? error : helperText;
  const messageId = hasError ? errorId : helperId;

  // An explicit aria-describedby from the caller is preserved and the
  // primitive's own message is appended, rather than one clobbering the other.
  const described =
    [describedBy, message ? messageId : undefined].filter(Boolean).join(' ') ||
    undefined;

  const s = SIZE[size];

  const inputStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: s.minHeight,
    padding: s.padding,
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: s.fontSize,
    color: disabled ? colors.neutral[500] : colors.brand.emerald,
    backgroundColor: disabled ? colors.neutral[100] : colors.surface.white,
    border: `1px solid ${disabled ? colors.neutral[300] : colors.neutral[500]}`,
    borderRadius: radius.control,
    transition: 'border-color 150ms ease, background-color 150ms ease',
    ...style,
  };

  const vars: Record<string, string> = {
    ...FOCUS_VARS,
    '--aksa-input-border-hover': disabled
      ? colors.neutral[300]
      : colors.brand.tealAccessible,
    '--aksa-input-border-focus': colors.brand.tealAccessible,
    // The error border must win over the focus border, so it is declared last
    // in the stylesheet; both clear 3:1.
    '--aksa-input-border-invalid': colors.semantic.error,
  };

  return (
    <div className={cx('aksa-input-field', containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className={cx(
            'block text-sm font-semibold mb-1.5',
            hideLabel && 'sr-only',
          )}
          style={{ color: colors.brand.emerald }}
        >
          {label}
          {required ? (
            <>
              <span aria-hidden="true" style={{ color: colors.semantic.error }}>
                {' *'}
              </span>
              <span className="sr-only"> (wajib diisi)</span>
            </>
          ) : null}
        </label>
      ) : null}

      <input
        {...rest}
        id={inputId}
        disabled={disabled}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={described}
        data-aksa-input=""
        data-aksa-focusable=""
        className={cx('aksa-input', className)}
        style={withVars(inputStyle, vars)}
      />

      {message ? (
        <p
          id={messageId}
          className="text-xs mt-1.5"
          style={{
            color: hasError ? colors.semantic.error : colors.neutral[600],
            fontWeight: hasError ? 600 : 400,
          }}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
