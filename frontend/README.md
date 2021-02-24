# Shipment Tracker frontend

This is a React and Typescript application bootstrapped using [Create React App](https://create-react-app.dev/)

## Development setup

1. **Install the dependencies CLI**

   ```shell
   yarn install

   ```

2. **Start the app**

   Get your Gatsby blog set up in a single command:

   ```shell
   yarn start
   ```

3. **That's it!**

   View the app at http://localhost:3001/

### Running the backend

You'll usually want access to our data when running the frontend. Here's how to set that up:

1. **Navigate to the root folder**
2. **Install the dependencies:**

   ```shell
   yarn install

   ```

3. **Launch the server:**

   ```shell
   yarn dev

   ```

4. **Tada 🎉**

   The server is now running at http://localhost:3000. There's a sweet GrapqhQL interface at http://localhost:3000/grapqhl.

## Infrastructure

### Styling

We use [Tailwind](https://tailwindcss.com/) for styling.

The setup is unfortunately not straighforward: we had a choice between [ejecting from Create React App (CRA)](https://create-react-app.dev/docs/available-scripts/#npm-run-eject) or adding some overrides, and we chose the latter.

Here are the commands we use to run the app:

```json
"start": "npm-run-all build:styles --parallel watch:styles start:react",
"start:react": "react-scripts start",
"build:styles": "tailwind build src/stylesheets/index.css -o src/stylesheets/index.output.css",
"watch:styles": "chokidar 'src/**/*.css' --ignore src/stylesheets/index.output.css -c 'npm run build:styles'",
```

In order of operation:

1. we run `build:styles`, which takes `index.css`, compiles it using Tailwind's CLI, and outputs it in the `index.output.css` file.
2. we run `watch:styles` and `start:react` in parallel
   a. `watch:styles` compiles any changes to the CSS files
   b. `start:react` runs CRA's `react-scripts start` command, which runs the React code
