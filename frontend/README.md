# Shipment Tracker frontend

This is a React and Typescript application bootstrapped using [Create React App](https://create-react-app.dev/)

## Development setup

1. **Install the dependencies CLI**

   ```shell
   yarn install --frozen-lockfile

   ```

2. **Start the app**

   ```shell
   yarn start
   ```

3. **That's it!**

   View the app at http://localhost:8080/

### Running the backend

You'll usually want access to our data when running the frontend. Here's how to set that up:

1. **Navigate to the root folder**
2. **Install the dependencies:**

   ```shell
   yarn install --frozen-lockfile

   ```

3. **Launch the server:**

   ```shell
   yarn start

   ```

4. **You're done 🎉**

   The server is now running at http://localhost:3000. There's a sweet GrapqhQL interface at http://localhost:3000/grapqhl.

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
