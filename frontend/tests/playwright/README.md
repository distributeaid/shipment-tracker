The tests are split in two folders:

1. `unauthenticated`: these tests are for testing behaviour for users that are
   not authenticated.

2. `authenticated`: these tests are for testing behaviour for authenticated
   users. The depend on a page context stored in the
   [./unauthenticated/register.spec.ts](`unauthenticated/register.spec.ts`)
   test, which contains the cookie for the newly registered user account,
   which then will make the page to be automatically logged in.
   This allows to re-use the **logged in state** so it does not have to be
   repeated for every test.
