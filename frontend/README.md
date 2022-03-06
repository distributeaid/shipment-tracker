# Shipment Tracker frontend

This is a React and Typescript application bootstrapped using [Create React App](https://create-react-app.dev/)

## Development setup

See the [Dev setup section](../README.md#dev-setup) in the project root.

## End-to-end tests using Playwright

The frontend provides [end-to-end tests](./tests/playwright) using [Playwright](https://playwright.dev/).

In order to run the tests follow the steps to launch the backend server, and create a production build of the frontend, which the backend will server from the `build` folder.

Make sure to configure the server URL in your `.env.production.local`:

    REACT_APP_SERVER_URL="http://localhost:3000"

You can also run the tests against the frontend development server. Export the environment variable `PORT` to change the port playwright expects the web app to run at:

    export PORT=8080

You can then run the tests using

    npx playwright test tests/playwright/unauthenticated
    npx playwright test tests/playwright/authenticated/admin
    npx playwright test tests/playwright/authenticated/user/onboarding
    npx playwright test tests/playwright/authenticated/user/offer

This works on your local machine, as well as using the Docker container.

### Playwright Inspector

For developing tests it is helpful to run the [Playwright Inspector](https://playwright.dev/docs/inspector).

Then launch the inspector **on your local machine** using

    PWDEBUG=1 npx playwright test tests/playwright/unauthenticated
    PWDEBUG=1 npx playwright test tests/playwright/authenticated/admin
    PWDEBUG=1 npx playwright test tests/playwright/authenticated/user/onboarding
    PWDEBUG=1 npx playwright test tests/playwright/authenticated/user/offer

This cannot be done inside the Docker container, since it launches the Firefox browser.
[For Linux it is possible to forward the X session from inside the Docker container](https://www.geeksforgeeks.org/running-gui-applications-on-docker-in-linux/), but this is not implemented, yet.

## Infrastructure

### Styling

We use [Tailwind](https://tailwindcss.com/) for styling.

The setup is unfortunately not straighforward: we use [Create-React-App Config Override (CRACO)](https://github.com/gsoft-inc/craco) with postcss v7 in order to compile styles.

### Forms and validation

We use [`react-hook-form`](https://react-hook-form.com/) to build forms with as little code as possible. We put together [an example form with validations](/frontend/src/pages/demo/FormValidationDemo.tsx).

The `TextField` and `SelectField` components abstract a lot of functionality, so they're a good place to explore to get started.

### Environment variables

We follow Create React App's [approach to environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env). There is a `.env` file **checked in** that contains non-sensitive default variables. You can create a `.env.local` file on your own machine and it should **not** be checked in.

Environment variables must be prefixed with `REACT_APP_`.
