# HSHS Lotteries Documentation

- [T4SG Starter Project](#t4sg-starter-project)
  - [Introduction](#introduction)
  - [Setup](#setup)
      - [Clone repository](#clone-repository)
      - [Package installation](#package-installation)
      - [Supabase Connection Setup](#supabase-connection-setup)
      - [Supabase Database Setup](#supabase-database-setup)
      - [Supabase CLI Setup](#supabase-cli-setup)
      - [Run the webapp](#run-the-webapp)
      - [(Recommended) Configure git message template](#recommended-configure-git-message-template)
      - [Github CI workflow (for SSWEs, do during project setup)](#github-ci-workflow-for-sswes-do-during-project-setup)
  - [Stack references](#stack-references)
    - [Typescript](#typescript)
    - [Components and Styling: `shadcn/ui`, Radix, and Tailwind CSS](#components-and-styling-shadcnui-radix-and-tailwind-css)
    - [Next.js](#nextjs)
      - [Tips for learning:](#tips-for-learning)
    - [Supabase](#supabase)
        - [Troubleshooting the Supabase CLI](#troubleshooting-the-supabase-cli)
    - [Environment variables](#environment-variables)
  - [Development tools](#development-tools)
    - [Code formatting and linting tools](#code-formatting-and-linting-tools)
      - [`eslint`](#eslint)
      - [`prettier`](#prettier)
      - [EditorConfig](#editorconfig)
      - [Github CI workflow](#github-ci-workflow)
      - [VSCode-specific settings](#vscode-specific-settings)
    - [VSCode Extensions](#vscode-extensions)
      - [`eslint`, `prettier`, `editorconfig`, and `tailwindcss`](#eslint-prettier-editorconfig-and-tailwindcss)
      - [BetterComments](#bettercomments)
      - [Live Share](#live-share)
      - [Format Code Action](#format-code-action)
  - [Deployment guides](#deployment-guides)
  - [Additional stack options (for SSWEs)](#additional-stack-options-for-sswes)

---

## Introduction

This project is a versatile starter project for T4SG web development projects. The stack and development tools have been chosen carefully to enable teams to develop rapidly on a variety of projects and build apps that are more easily maintainable by clients post-handoff.

The project uses Next.js, a React-based framework with significant optimizations. The frontend uses `shadcn/ui`, an open-source library of UI components that are built with Radix primitives and styled with Tailwind CSS. The backend uses Supabase, an open-source Firebase alternative. The entire stack is written in Typescript to provide comprehensive typesafety across both frontend and backend.

---

## Setup

#### Clone repository

`cd` into a desired destination folder, then clone the repo (preferably using SSH):

```shell
git clone git@github.com:hcs-t4sg/starter-project-2023-v2.git
```

#### Package installation

1. Open the project folder in VSCode. You can do so with the following terminal shortcut:

   ```bash
   # Navigate into the project directory
   cd starter-project-2023-v2

   # Open in VSCode
   code .

   # If the second command gives you an error, you probably don't have the VS Code 'code' keyword added to your PATH variable. Follow this tutorial:
   # https://www.freecodecamp.org/news/how-to-open-visual-studio-code-from-your-terminal/#:~:text=Once%20your%20terminal%20is%20open,Then%20hit%20enter%20.&text=Once%20you%20hit%20enter%20%2C%20VS%20Code%20will%20now%20open.
   ```

2. Open a terminal in the project folder by dragging up from the bottom of the code window or by going to `Terminal > New Terminal` in the menu bar.

3. Run: `npm install` (`npm i` for short)

   - If you get something like "command not found", you might not have `npm` installed.

- If successful you should see something like:

  ```bash
  added 414 packages, and audited 415 packages in 13s
  
  149 packages are looking for funding
  run `npm fund` for details
  
  found 0 vulnerabilities
  ```

4. You should see a popup in the bottom right prompting you to install recommended extensions. Please install these, they'll be helpful for code formatting and developing the webapp. You can also view the recommended extensions in the extensions sidebar (`cmd + shift + X`.)

5. You will also get a prompt to use the workspace's Typescript version; accept it. You may have to navigate to any `.ts` or `.tsx` file in the project and open it to receive the prompt. If you don't get one, or if you get an error that the path "does not point to a valid tsserver install", make sure you're using the workspace's Typescript version by pressing `cmd` + `shift` + `P` and typing "typescript", selecting `Typescript: Select Typescript Version`, and selecting `Use Workspace Version`. Again, you'll need to be viewing a `.tsx` or `.ts` file to do this.

#### Supabase Connection Setup

1. Visit the Supabase website, create an account (or login if you already have one), and create a new project. You will be prompted to set a **Database Password; remember it**. Wait for your database provisioning and setup to finish.

   * Try to avoid using special characters like `?`, `$`, etc. in your password.

2. There is a `.env.example` file in your local project directory (e.g. in VSCode). Duplicate it (into the same directory) and rename to `.env`. Inside `.env`, set the following variables according to your Supabase project settings:

   - `NEXT_PUBLIC_SUPABASE_URL`: From Project Settings > API > Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From Project Settings > API > Project API Keys > `anon` `public`.
   - `SECRET_SUPABASE_CONNECTION_STRING`: From Project Settings > Database > Connection String > Nodejs. Replace `[YOUR-PASSWORD]` with your database password.
     - If you insist on using special characters in your password you will need to replace them with the **percent-encoded** version ([see this reference](https://stackoverflow.com/a/76551917))


   The final result should look something like this:

   ```shell
   # Some other comments above
   NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijklmnopqrst.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="longlonglongstring"
   SECRET_SUPABASE_CONNECTION_STRING="postgresql://postgres:YourDatabasePasswordHere@db.abcdefghijklmnopqrst.supabase.co:5432/postgres"
   ```

   You should not share these keys publically, especially the `SECRET_SUPABASE_CONNECTION_STRING`. Note that this project uses a package from the popular [T3 stack](https://create.t3.gg/) to validate and provide typesafety to environment variables in `env.mjs` (more on this below). When using these environment variables in your code, you can import them from `env.mjs`. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used in the codebase itself and are thus included in this file. `SECRET_SUPABASE_CONNECTION_STRING` is used only in a helper script in `package.json` and not in the app itself, so it doesn't need to be validated.

#### Supabase Database Setup

1. In your Supabase project dashboard, navigate to `SQL Editor` in the left sidebar, then click `(+) New Query` > `New blank query`. If you wish, you can rename the query from "Untitled Query" to something else by clicking the dropdown in the left sidebar.
2. In your starter code, there is a `setup.sql` file containing a SQL script that will set up the database for you. Copy the entire contents of the file and paste it into your new query.
3. Run the query with the button in the bottom right or by pressing `cmd` + `return`. In the results panel, you should see the message `Success. No rows returned`.

#### Supabase CLI Setup

1. The Supabase CLI will be helpful for a number of functions, such as running Supabase locally and generating Typescript types from our database schema. For the CLI to work, you will have to install [Docker](https://www.docker.com). During the installation process, if Docker prompts you to run an `osascript`, make sure to run it.

2. If you've done `npm install`, the CLI should already be installed. You can test it by running `npx supabase`, which will give you a version (`Supabase CLI 1.64.8`) and a list of commands.

3. We preconfigured a command (in `package.json`) for you to easily generate type definitions in `lib/schema.ts` from your remote Supabase database schema. If you've created tables in Supabase, you can test this command now. Otherwise, make sure to run it frequently in development whenever you edit your database schema.

   ```ts
   // Introspects your remote Supabase database and generates types in lib/schema.ts
   npm run types
   ```

   > Notes:
   >
   > - You need to have `SECRET_SUPABASE_CONNECTION_STRING` configured in `.env` in order for the above command to work.
   > - If you want to generate type definitions for a local Supabase project, you can run the full version of the command (read more about it [here](https://supabase.com/docs/guides/api/rest/generating-types)) or edit the `npm` script in `package.json`.

More instructions on troubleshooting potential errors are below.

#### Run the webapp

You can run the webapp with the following terminal command. By default, the webapp should be accessible at `http://localhost:3000/`.

```bash
# Start the webapp in development mode (usually what you do in development). Exit with Ctrl + C
npm run dev

# You'll get several "compiling" messages after running this command. That's expected!
```

#### (Recommended) Configure git message template

This project also includes a template for writing good git commit messages. You can configure this template (affects only the project repo) using the following terminal command:

```bash
# Set git commit message to the .gitmessage file (this only affects git in the project repo, not globally)
git config commit.template .gitmessage
```

In future commits, you can run `git commit` (with no attached message or `-m` tag) to open the commit message template in VSCode. Fill in the blanks, save the file (`cmd + S`), and close the file (`cmd + W`) to finish the commit.

#### Github CI workflow (for SSWEs, do during project setup)

We implemented a [Github Actions](https://docs.github.com/en/actions) workflow for CI ([continuous integration](<https://www.atlassian.com/continuous-delivery/continuous-integration#:~:text=Continuous%20integration%20(CI)%20is%20the,builds%20and%20tests%20then%20run.>)) that will process any pull requests made to `main`. The workflow auto-formats the code in the pull request with `prettier` and checks for any `eslint` errors. This allows SWEs to freely make commits on side branches (without enforced formatting or linting) but still prevents code with poor quality or formatting from being pushed to `main`. To set this up, do the following steps:

1. In Github, go to Actions > Enable all workflows
2. Go to Settings > Actions > General and under "Workflow Permissions", make sure "Read and write permissions" is selected.
3. Create a dummy branch with a trivial edit (try not to add anything that creates a bug), and create a pull request from that branch to `main`. If you forked the starter project repo, make sure you're pull-requesting into the correct repo (your own)! After creating the pull request, you should see "Some checks haven't completed yet". Wait for the check to finish, it should succeed.
4. Now we can create a Github [branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) for our `main` branch. Go to Settings > Branches > Add branch protection rule. We recommend using the following settings:
   - Branch name pattern: `main`
   - Require a pull request before merging
     - Require approvals (1)
     - Dismiss stale pull request approvals when new commits are pushed
   - Require status checks to pass before merging
     - Require branches to be up to date before merging
     - **Required status checks: "Format source code and check for linting errors"** (important to get our CI workflow to run!)
    

#### secrets.json 
To access Google's services (particularly, the Google Forms API), this project needs to have a secrets.json file added to the source directory. To generate this secrets.json, go to the Google Cloud console. In your project's Google Cloud credentials seciton, make a service account (if you do not have one already). Click into the service account and go to "Keys." Click on "Add a Key" and select "json." Then, a new json file should be downloaded to your computer. Rename that file "secrets.json" and add it to the project's source directory. 


---

## Stack references

This section provides a short description and important commands related to each component of the stack.

### Typescript

Typescript is a strongly-typed programming language based on Javascript. It integrates closely with your editor and provides type inference and static type checking to catch errors/bugs early-on and provide a great developer experience. Furthermore, it is a superset of Javascript and can be transpiled to any version of Javascript to run in browsers.

Typescript applies type inference to your files automatically, but you can also manually run it with the following terminal command:

```bash
# Type check all typescript files (--noEmit disables generation of a report file, which is not needed)
npx tsc --noEmit
```

A quick tip on coding with Typescript: When fixing type errors, you should avoid using [type assertions](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) (with `as`) and the [`any` type](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) **as much as possible**. These functionalities are escape hatches built into Typescript to allow you to avoid type-checking, but they don't actually solve the underlying problem of a type error! Simply ignoring the problem by avoiding type-checking will only make future bugs much more difficult to fix. Personally, out of all the type errors I've resolved in Typescript, I've only had one situation where the `as` keyword was necessary; every other time, the type error exposed an important error/oversight in my code.

Also, note that this project implements a few additions to make Typescript's type-checking more strict (and thus encourage better code). Because of this, you may get typing/warning errors when using code repurposed from projects with less strict type-checking. If these become overly burdensome for you/your team, feel free to remove/disable them!

* The package `ts-reset` is installed, implementing additional rules surrounding JSON and array operations ([read more here](https://github.com/total-typescript/ts-reset?tab=readme-ov-file))
* The rule `noUncheckedIndexedAccess` is set to `true` in `tsconfig.json` to improve typesafety of accessing objects ([read more here](https://www.totaltypescript.com/tips/make-accessing-objects-safer-by-enabling-nouncheckedindexedaccess-in-tsconfig))
* The `eslint` config in `eslintrc.cjs` extends the rule configurations `plugin:@typescript-eslint/recommended-type-checked` and `plugin:@typescript-eslint/stylistic-type-checked`, whereas other projects may extend the less-strict configurations `plugin:@typescript-eslint/recommended` and `plugin:@typescript-eslint/stylistic` ([read more here](https://typescript-eslint.io/linting/typed-linting/)).

Finally, note that type definitions for many `npm` packages are [maintained by the Typescript community](https://github.com/DefinitelyTyped/DefinitelyTyped) and may be found with the `@types/` prefix on [`npm`](https://www.npmjs.com), if they're not already included in the package itself (generally they are). Several of the config files in the project (ex: `.prettierrc.cjs`) manually import type definitions, but you generally will not need to worry about such syntax in your actual source code.

> **More references**
>
> - [T3 Guide to Typescript](https://create.t3.gg/en/usage/typescript)
> - [Official Typescript documentation](https://www.typescriptlang.org/)

### Components and Styling: `shadcn/ui`, Radix, and Tailwind CSS

The project uses UI components from `shadcn/ui`, an open-source library of UI components prebuilt with Radix and Tailwind CSS.

Radix is what developers refer to as a "headless" (or "behavior") UI library. It controls how components **work** (i.e. dropdowns, buttons, checkboxes) and provides a set of unstyled, functional, accessible components (aka **primitives**) to which further styling can be applied. To change how our components **look**, we style them with Tailwind CSS, which is a CSS framework that allows us to rapidly apply CSS styling to our components by adding html classes.

`shadcn/ui` provides a set of UI components prebuilt with Radix and TailwindCSS that can be copy-pasted into our project or added with its CLI (with the terminal command `npx shadcn-ui add`). These components are not "imported" like they are in other component libraries like MUI; they are simply additional code added to our project, which gives us full control over the styling and functionality of each component if necessary. The result is a component library that looks nice with minimal effort but is also easily customizable! Individual `shadcn/ui` components can be customized in `components/ui`, and global theming can be customized in `app/globals.css`.

> **More references**
>
> - [Official `shadcn/ui` documentation](https://ui.shadcn.com)
> - [Radix documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
> - [Official Tailwind CSS documentation](https://tailwindcss.com/docs/installation)
> - [Tailwind CSS cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
> - [Tailwind in 100 seconds](https://www.youtube.com/watch?v=mr15Xzb1Ook)
> - [Reusing styles and creating abstractions when using Tailwind](https://tailwindcss.com/docs/reusing-styles)

### Next.js

Next.js is a React-based framework that offers significant optimizations with relatively small learning curve. Notably, it provides a powerful page routing system, ability to create built-in API routes without a separate backend, and a variety of options for fetching data and rendering content on the server.

To run the webapp in development mode, use the following terminal command:

```bash
# Start the webapp in development mode (usually what you do in development). Exit with Ctrl + C
npm run dev
```

To create and run a production build of the webapp (great for testing before deployment), use the following terminal command:

```bash
# Create a production build
npm run build

# Start the production build
npm start
```

#### Tips for learning:

Note that React 18 introduced server components, which form a new paradigm for conceptualizing and constructing webapps. This project uses the Next.js `app/` router, which was introduced in Next.js 13 and uses React server components. Server components are very new and can take a while to wrap one's head around (especially for people already accustomed to React's old "mental model"). However, React and Next.js development is shifting towards this new paradigm, just like how we shifted from using class components and lifecycle methods to using functional components and hooks in React a few years ago. So we at T4SG Eng want to move along with the rest of the developer community and ensure that we're learning/practicing the most relevant skills!

If you are new to React, check out the React documentation first before touching Next.js. The Next.js docs have a great [React Essentials](https://nextjs.org/docs/getting-started/react-essentials) section. When browsing documentation or looking at tutorials for Next.js, try to first look for examples explicitly referencing Next 13 or the `app` router, not the `pages` router (which is the older way of building Next.js webapps).

> **More references**
>
> - [Official Next.js documentation](https://nextjs.org)
> - [Official React documentation](https://react.dev)
> - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
> - [Next.js GitHub repository](https://github.com/vercel/next.js/) - good place to ask for help!
> - [Example Next.js project](https://github.com/shadcn/taxonomy) built by `shadcn`!

### Supabase

The backend uses [Supabase](https://supabase.com), an open-source Firebase alternative. (Both are BaaS platforms: backend as a service.) Supabase provides all of Firebase's most important functionality and more:

- **Database:** Built on Postgres, a relational database which has better structure than Firebase's Firestore NoSQL database and is open-source (thus more easily maintainable by clients).
- **Realtime:** Analogous to Firestore's `onSnapshot` realtime listeners, allowing you to listen to changes in the **database** (aka Postgres Changes). Supabase also offers Broadcast and Presence, which are other forms of realtime that provide ultra-fast synchronization for features like chatrooms or online games.
- **User authentication:** Like Firebase, a simple auth system with all social providers and user permissions for database access.
- **File storage:** Like Firebase, cloud storage for any kind of digital content.
- **Edge functions:** Server-side Typescript functions that run on Supabase without needing to set up a backend server. Analogous to Firebase Cloud Functions, which are not available on the free tier!
- **Local development:** Ability to easily create locally-hosted Supabase projects with tracked migration history (super useful when working in teams)
- **Typesafety:** The Supabase CLI (command line interface) can be used to generate Typescript types based on your database schema, allowing for typesafe database queries.

> **More references**
>
> - [Official Supabase documentation](https://supabase.com/docs)
> - [Example project](https://github.com/supabase/auth-helpers/tree/main/examples/nextjs) using Supabase auth with Next.js app router
> - [Another example project](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

##### Troubleshooting the Supabase CLI

Whenever you're running the CLI (such as running the type-generating command above) you might get an error:

```bash
Cannot connect to the Docker daemon at unix:///Users/matthewsu/.docker/run/docker.sock. Is the docker daemon running?
```

Make sure you have Docker running, and start a new terminal and retry the command. If that still doesn't work, you may need to manually point your terminal to Docker in the terminal configuration. Example instructions for using a `zsh` terminal on MacOS:

1. Find your `.zshrc` file. Instructions for finding it are [here](https://osxdaily.com/2021/11/18/where-the-zshrc-file-is-located-on-mac/#:~:text=zshrc%20file%20on%20a%20Mac,customizations%20to%20the%20z%20shell.); note that it is a hidden file, so you may have to press `cmd` + `shift` + `.` in Finder in order to see your hidden files.

2. Open `.zshrc` with notepad and add this line:

   ```bash
   export DOCKER_HOST=unix://"$HOME/.docker/run/docker.sock"
   ```

3. Save and close `.zshrc`, then start a new terminal (make sure you're using a `zsh` terminal and not a `bash` terminal) and retry the command.

Feel free to reach out for help!

### Environment variables

The project uses a package from the popular [T3 stack](https://create.t3.gg/) to validate and provide typesafety to environment variables, so the process of adding an environment variable (for use on the client or server) is slightly more involved than just updating `.env.local`. Instructions for managing environment variables are [here](https://create.t3.gg/en/usage/env-variables).

---



## Development tools

This section provides information on various tools this project uses to streamline the development process.

### Code formatting and linting tools

This starter project uses a [combination](https://stackoverflow.com/questions/48363647/editorconfig-vs-eslint-vs-prettier-is-it-worthwhile-to-use-them-all) of code formatting and linting tools to catch errors and enforce consistent code styling across all collaborators working on the project. Documentation and a quick description of each tool is given below. The configuration files for each tool have also been commented with additional information/references.

The preset configurations should work great out of the box, but feel free to customize them to your liking.

#### [`eslint`](https://eslint.org)

A [linting](<https://en.wikipedia.org/wiki/Lint_(software)>) tool that statically analyzes our code to detect and fix issues with code quality (like unused variables, residual console statements, etc). `eslint` is configured to run on save and before making a `git commit` (see below), but you can also run it manually with the following terminal commands:

```bash
# Easiest way to lint all relevant files in the project. Notifies you of any linting issues.
npm run lint

# Lint all relevant files in the project, fix any auto-fixable issues, and notify you of the remaining issues.
npm run lint:fix

# Specification of these npm scripts are in package.json
```

```bash
# Lint a specific file (or all relevant files by using "."). Add the --fix tag to have eslint correct errors that are automatically fixable.
npx eslint [filepath or .] --fix
```

If you need to exclude certain folders/files from the ESLint rules, you can create a `.eslintignore` file.

If you want to modify the `eslint` rules, you can edit the `rules` array in `.eslintrc.cjs`. If adding a new rule, make sure that it doesn't conflict with `prettier` by running the following command ([more info here](https://github.com/prettier/eslint-config-prettier#cli-helper-tool)):

```bash
# Test eslint-config-prettier against some file in the codebase, for example index.tsx. You usually only need to run this for one file
npx eslint-config-prettier src/index.tsx
```

However, note that **if you encounter an `eslint` error when coding, you shouldn't just immediately ignore it or turn the rule off**. These rules are put in place to catch errors you may not even know about, so you should do some extensive research on the rule (and how you might change your code to conform to it) and only ignore/disable the rule as a **last resort**. Listening to `eslint` builds good code quality habits!

Config file is in `.eslintrc.cjs`.

#### [`prettier`](https://prettier.io)

Formats outputted code to a consistent, opinionated style **after** it has been written. `prettier` is configured to run on save and before making a git commit (see below), but you can also run it manually with the following terminal commands:

```bash
# Check files for formatting errors and give a human-friendly summary of all errors.
npm run prettier

# Fix formatting errors in-place for all files.
npm run prettier:fix

# Specification of these npm scripts are in package.json
```

Note that `prettier` and `eslint` have [overlapping functionalities](https://www.robinwieruch.de/prettier-eslint/), so to prevent conflict between the two we also add [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier#cli-helper-tool), which disables all `eslint` rules that would conflict with `prettier`

Finally, our `prettier` configuration also includes a [plugin](https://github.com/trivago/prettier-plugin-sort-imports) for sorting import declarations.

If you need to exclude certain folders/files from the `prettier` formatting, you can create a `.prettierignore` file. The `prettier` config file is in `.prettierrc.cjs`.

#### [EditorConfig](https://editorconfig.org)

Standardizes some settings (only in the project workspace) across different editors (Sublime, VSCode, etc) to apply formatting rules **before** writing code (e.g. hitting `tab` leaves two spaces). Config file is in `.editorconfig`. Both EditorConfig and `prettier` work in tandem to enforce consistent styling/formatting across your entire team, which will help prevent some annoying formatting situations (ex: every line in a pull request being marked as a `diff` because one team member uses tab indents and another uses space indents).

#### Github CI workflow

We implemented a [Github Actions](https://docs.github.com/en/actions) workflow for CI ([continuous integration](<https://www.atlassian.com/continuous-delivery/continuous-integration#:~:text=Continuous%20integration%20(CI)%20is%20the,builds%20and%20tests%20then%20run.>)) that will process any pull requests made to `main`. The workflow auto-formats the code in the pull request with `prettier` and checks for any `eslint` errors. This allows SWEs to freely make commits on side branches (without enforced formatting or linting) but still prevents code with poor quality or formatting from being pushed to `main`.

If you have `eslint` and `prettier` VSCode extensions installed on VSCode (see below), your editor should auto-format and notify you of linting errors as you code, but you can also run formatting manually (see `eslint` and `prettier` sections above). Finally, you can use the following terminal command, which will auto format all your code and notify you of any linting issues that need to be fixed for your pull request to pass the integration test.

```bash
# Format all relevant files with Prettier and check all relevant files for eslint errors
npm run format

# Specification of npm scripts are in package.json
```

For SSWEs, you should protect your `main` branch from unprotected pushes using a Github [branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule). We recommend you use the settings detailed in the setup instructions.

#### VSCode-specific settings

The project contains workspace-specific VSCode settings in `.vscode/settings.json`. These settings (which only apply when inside the project workspace) set the editor to:

- Format with `prettier`, then lint with `eslint` on save (this is the quickest way)

  - (Note that we use an extension, [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action&ssr=false#review-details), to achieve this specific order)

- Use `prettier` as the default formatter
- Prompt the user to use the codebase's version of Typescript for Intellisense (preventing errors arising from differing Typescript versions)

### VSCode Extensions

#### `eslint`, `prettier`, `editorconfig`, and `tailwindcss`

These add in-editor support (syntax highlighting, error checking, etc.) for their respective tools. The recommended workspace extensions are configured in `.vscode/extensions.json`.

#### [BetterComments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

Allows you to categorize your comments into color-coded Alerts, Queries, TODOs, and Highlights for more human-friendly annotations.

#### [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)

Enables you to collaboratively edit and debug with others in real time. Think Google Docs functionality but for your codebase.

#### [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action&ssr=false#review-details)

Allows us to run `eslint` after `prettier` on save, which is the fastest order.

#### [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

Improves error highlighting and displays diagnostic text inline.

#### [Pretty Typescript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

Formats Typescript errors to be more human-readable.

---

## Using the API Endpoints

This app has two API endpoints which can be used to load applicant data into our database. The form of a form response is as follows: 

```
{
  "name": "John Doe", # Applicant name
  "dob": "1983-04-21", # Date of birth, in the form yyyy-MM-dd
  "gender": "Man", # Gender, where options are "Man", "Woman" or "Non-binary" (lowercase also accepted)
  "lottery_info": "John Doe prefers a specific bed type", # Text explaining why a non-binary patient may desire a certain bed type
  "email": "john.doe@example.com", # Applicant email
  "phone": "1234567890", # Applicant phone number
  "other_contact": "2345678901", # Alternate contact method
  "notes": "John Doe's special request", # Any extra notes
  "submitted_at": "2023-02-26T12:34:56.789Z" # Form submission time (ISO string)
}
```

(All fields here are strings)

Passing a single form response in this form to the endpoint at `/api/form-responses/single` will upload that single response to the database, or you can send an array of response objects to the endpoint at `/api/form-responses/bulk` to have them all uploaded.

---

## Deployment guides

Deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker). The easiest way to deploy is with Vercel, which was created by the creators of Next.js!

When deploying, make sure you set the appropriate environment variables for your deployment corresponding to those found in `.env`. That is, if you're using a separate Supabase project for production, use the environment variables for that project, but if you're just using your development database, you can paste in the contents of your local `.env` file.

Additionally, you need to make sure you configure Supabase's redirect URLs to accept login requests from your deployed site. Specifically, it needs to accept `https://my-domain-name.com/auth/callback`, since Supabase redirects to the `/auth/callback` route after login. 

The easiest way to do this is to login to your Supabase dashboard and navigate to Authentication (left sidebar) > URL Configuration > Redirect URLs > Add URL, and add the following URL: `https://my-domain-name.com/**`.

Read more about it [here](https://supabase.com/docs/guides/auth#redirect-urls-and-wildcards).

---

## Additional stack options (for SSWEs)

Check out [this article](https://t4sg.notion.site/Tech-Stack-Recommendations-279121b43d254bdc96f41fea2af17f77?pvs=4) in our Eng Wiki for additional stack recommendations!

