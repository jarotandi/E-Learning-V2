/**
 * Admin feature localStorage helpers
 * ==================================
 * B1.4D-T3 — platform + users extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/12-b1.4d-t3-platform-users.md
 *
 * `readStorageArray` used to be a private helper inside `AdminDashboard.tsx`.
 * T3 extracts the Users domain into `features/admin/users/`, which needs the
 * same reader, so the helper is lifted here (one definition, two callers)
 * instead of being duplicated.
 *
 * It is a pure read of a JSON array from localStorage with a fallback: no
 * domain knowledge and no key registry. The 13 `theprams_demo_*` keys remain
 * owned by the components that use them and are NOT renamed.
 */

export const readStorageArray = <T,>(key: string, fallback: T[] = []): T[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};
