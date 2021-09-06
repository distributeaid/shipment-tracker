# Authentication

The backend authenticates requests using signed cookies which contains user's id so that it does not have to be fetched for every request.

Cookies are sent [`secure` and `HttpOnly`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies) when users register their account, or when they log in using email and password.

Cookies expire after 30 minutes and the client is responsible for renewing cookies by calling the `GET /me/cookie` endpoint before they expire.

When renewing cookies, the server will re-check if the user still exists and if they haven't changed their password. For this a hash of the user's password hash, email, and id will be generated and included in the cookie. If any of these properties changes, the cookie cannot be renewed and the user has to log-in again.

A CAPTCHA is used to protect authentication routes against automated attacks (e.g. trying to figure out which email addresses are registered, requesting large amounts of reset emails). The CAPTCHA solution is sent in the `x-friendly-captcha` by the frontend.

## Admin permissions

Admin permission are granted via the `isAdmin` flag on the `UserAccount` model.

## Configuration

These environment variables control the authentication:

- Backend
  - `COOKIE_SECRET`: sets the secret used to sign cookies, default value is a random string
  - `FRIENDLYCAPTCHA_API_KEY`: sets the API key for [FriendlyCaptcha.com](https://friendlycaptcha.com/) which allows to verify CAPTCHA challenges sent from the frontend
- Frontend
  - `REACT_APP_FRIENDLYCAPTCHA_SITE_KEY` configures the [FriendlyCaptcha.com](https://friendlycaptcha.com/) site key.
