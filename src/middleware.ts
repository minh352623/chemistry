import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  
  // Always use locale prefix
  localePrefix: 'as-needed'
});

export const config = {
  // Match all pathnames except for
  // - … if they have a file extension
  // - … if they start with `/api`
  // - … if they contain `_next`
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
