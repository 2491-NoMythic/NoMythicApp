# NoMythic App

This web app will provide access to the day to day housekeeping and admin type stuff that a First Robotics team has to do to keep going. Right now it might be NoMythic centric, but the hope would be that other teams would be able to deploy it and use it too.

Since most students run their lives through their phones, the goal is to keep the app as responsive as possible to allow most useage that students would have possible via phone.

## Tech

-   Typescript - A form of Javascript that can use Types
-   [date-fns](https://date-fns.org) - Because dates are hard
-   [SolidJS](https://www.solidjs.com) - React like framework
-   [Solid Forms Handler](https://solid-form-handler.com/docs/introduction) - Provides form validation support
-   [TailwindCSS](https://tailwindcss.com) - CSS framwork
-   [DaisyUI](https://daisyui.com) - helper for TailwindJS
-   [Solid Icons](https://solid-icons.vercel.app) - icon set for consistancy
-   GoogleCloud - account login
-   [Supabase](https://supabase.com) - database in the cloud
-   [Netlify](https://www.netlify.com/for/web-applications/) - Used to deploy the app to their cloud servers

## For Robotics Students

This is going to look pretty overwhelming looking at the above tech stack. There is no doubt that there are a lot of things to learn, but at the core, it is a HTML / CSS / Javascript application that runs on a server.

To get started you should get some basic skills in HTML, and the most common tags used. CSS is simply about making that HTML pretty. Then learn some Javascript. If you are already programming a robot, this is not going to be too unfamiliiar to you. Do you use Java and understand Generics? That is pretty much what the Types are Typescript adds to Javascript.

You get a basic understanding of those things, and you can start to understand this app. SolidJS is a Javascript framework and learning about that will be the next task. At it's core, it allows data to change, and immediately update the HTML (actually JSX here) so that you see the changes immediately. All this runs in the browser.

Where is the data though? Supabase! From within the browser we make REST api calls (almost the same as requesting a web page) and they return data that is stored in a database server they host. The data here is not available to anyone. You need to be authenticated, and that is where Google comes in.

We are using Google Cloud to get our credentials. When logging in to this app, you are directed to Google to allow your account to access the app. Say yes, and we get credentials we can use for Supabase to access the data.

## Magic Keys and Accounts

You will need to get your Supabase keys to run. If you are not NoMythic, you will have to set up a Supabase and GoogleCloud account for login and storing data.

These things are beyond the scope of this readme. If you are another First Robotics team interrested in this, contact. Chris Ward <veggie2u@cyberward.net>

## Usage

In order to get all of the "Stuff" to run, we need to get our project to download all of the requirements. To do that type at a command line: (search for npm if you don't have that installed)

```bash
$ npm install
```

## Run the app locally

In the project directory, you can type:

```bash
$ npm run dev
```

This will run the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.<br>

ViteJS builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

To deploy this app, the included ViteJS compiler needs to get it ready. At command line type:

```bash
$ npm run build
```

This builds the app for production to the `dist` folder.
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.) We are currently deploying via netlify.
