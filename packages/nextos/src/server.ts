/**
 * @connormccarl/nextos/server — server-only exports.
 *
 * Includes DB helpers, auth, sessions, password reset, Zoho email, CMS CRUD,
 * and ready-to-mount Next.js route handlers.
 *
 * Import only from server code (route handlers, server components, middleware).
 */

/* ---------- DB ---------- */
export { createPool, getPool, getPrisma, query, withClient, assertSafeIdentifier } from "./db/pg.js";
export type { DbConfig } from "./db/pg.js";
export { migrate } from "./db/migrate.js";

/* ---------- Auth: passwords ---------- */
export { hashPassword, verifyPassword, passwordStrength } from "./auth/password.js";

/* ---------- Auth: users ---------- */
export {
  registerUser,
  authenticateUser,
  findUserByEmail,
  findUserById,
  changePassword,
  listUsers,
  setUserRole,
  setUserActive,
  updateUserProfile,
  deleteUser,
  hasRole,
  requireRole,
  checkLockout,
  AuthError,
  AuthenticationError,
  AuthorizationError,
} from "./auth/users.js";
export type { Role, RegisterInput, LoginInput, LockoutCheck, UpdateUserProfileInput } from "./auth/users.js";

/* ---------- Auth: sessions ---------- */
export {
  createSession,
  validateSession,
  destroySession,
  destroyAllUserSessions,
  purgeExpiredSessions,
  sessionCookieOptions,
  csrfCookieOptions,
  clearCookieOptions,
  compareCsrf,
  SESSION_COOKIE,
  CSRF_COOKIE,
} from "./auth/session.js";
export type { User, Session, CookieOptions, CreateSessionInput, CreateSessionResult, ValidateSessionResult } from "./auth/session.js";

/* ---------- Auth: password reset ---------- */
export { requestPasswordReset, consumePasswordResetToken } from "./auth/reset.js";

/* ---------- Auth: route handlers (LEGACY — kept temporarily for backwards compat) ---------- */
export { authHandlers } from "./auth/handlers.js";
export type { AuthHandlerOptions } from "./auth/handlers.js";

/* ---------- Auth: NextAuth (Auth.js v5) — the current canonical surface ---------- */
export {
  handlers,        // GET/POST for /api/auth/[...nextauth]/route.ts
  auth,            // await auth() — server-side session reader
  signIn,          // programmatic sign-in
  signOut,         // programmatic sign-out
  authConfig,      // exported in case the consumer wants to extend with more providers
  getCurrentUser,  // NextOS-flavoured wrapper around await auth()
  requireSession,  // role-gated wrapper; throws on missing/insufficient session
  assertCsrf,      // compatibility no-op (see source for the security note)
} from "./auth/nextauth.js";

/* ---------- Auth: seeding ---------- */
export { seedAdmin } from "./auth/seed.js";

/* ---------- Email ---------- */
export { sendEmail } from "./email/zoho.js";
export type { SendEmailOptions, SendEmailResult } from "./email/zoho.js";

/* ---------- CMS ---------- */
export {
  listRecords as cmsListRecords,
  createRecord as cmsCreateRecord,
  updateRecord as cmsUpdateRecord,
  deleteRecord as cmsDeleteRecord,
} from "./cms/server.js";
export type { CmsConfig, ResourceDef, ResourceRecord, FieldDef, FieldType } from "./cms/types.js";
export { defineCmsConfig } from "./cms/types.js";
