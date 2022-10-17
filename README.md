# NoMythic App

This web app will provide access to the day to day housekeeping and admin type stuff that a First Robotics team has to do to keep going. Right now it might be NoMythic centric, but the hope would be that other teams would be able to deploy it and use it too.

Since most students run their lives through their phones, the goal is to keep the app as responsive as possible to allow most useage that students would have possible via phone.

## Tech

-   SolidJS - React like framework
-   Typescript
-   TailwindJS - CSS framwork
-   Daisy - helper for TailwindJS
-   GoogleCloud - account login
-   Supabase - database in the cloud
-   Netlify - deploys

## Keys

You will need to get your Supabase keys to run. If you are not NoMythic, you will have to set up Supabase and GoogleCloud for login.
These things are beyond the scope of this readme. If you are another First Robotics team interrested in this, contact. Chris Ward <veggie2u@cyberward.net>

## Usage

```bash
$ npm install # or pnpm install or yarn install
```

## Available Scripts

In the project directory, you can run:

### `npm dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.) I am currently testing deployment via netlify.
