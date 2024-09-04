## What is this?

VIS (Vehicle Information System), web application to inspect incoming vehicle. This system devided with 3 part :

1. Backend for PWA and SPA.
2. Web Admin SPA (Use React JS and inertia JS as front end).
3. Inspection App PWA (Use React JS) ([here](https://github.com/theadamz/vis-pwa)).
4. Database diagram [here](https://dbdiagram.io/d/vis-6694a18b9939893daee91844).

## Requirements

-   php >= 8.2
-   composer
-   node
-   [pnpm](https://pnpm.io/)
-   [shadcn/ui (Tailwind)](https://ui.shadcn.com/docs)
-   react js with typescript

## Install from stratch

-   Init new laravel project :

    ```
    composer create-project laravel/laravel vis
    cd vis
    ```

-   Add new laravel library breeze as wizard to install inertia JS :

    ```
    composer require laravel/breeze --dev
    ```

-   Install breeze to init react js typescript :

    ```
    php artisan breeze:install
    ```

    Follow these steps when wizard questions appear :

    ```
    Which Breeze stack would you like to install? react
    Would you like any optional features? typescript
    Which testing framework do you prefer? PHPUnit / 1
    ```

-   Init new shadcn :

    ```
    pnpm dlx shadcn-ui@latest init
    ```

-   Follow these steps when wizard questions appear :

    ```
    Would you like to use TypeScript (recommended)? yes
    Which style would you like to use? New York
    Which color would you like to use as base color? Zinc
    Where is your global CSS file? resources/css/app.css
    Would you like to use CSS variables for colors? yes
    Are you using a custom tailwind prefix eg. tw-? (Leave it blank / just enter)
    Where is your tailwind.config.js located? (root folder / just enter)
    Configure the import alias for components: @/Components/shadcn
    Configure the import alias for utils: @/Components/shadcn
    Are you using React Server Components? no
    Write configuration to components.json. Proceed? yes
    ```

-   Change your file `tailwind.config.js` content section with :

    ```
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
      ],
    ```

-   Install font geist :

    `pnpm add geist`

## Development

-   Run server :

    ```
    php artisan serve
    pnpm dev
    ```

-   Add shadcn components :

    ```
    pnpm dlx shadcn@latest add button
    ```

-   Install debug bar for development :

    ```
    composer require barryvdh/laravel-debugbar --dev
    ```

## Production

-   Build frontend :

    `pnpm build`

-   Create symbolink (run this only once) :

    `php artisan storage:link`

## Use laragon portable

-   Open terminal and set it to www/your-project-folder and type below command :

    ```
    ..\..\bin\cmder\cmder.bat
    or
    ../../bin/cmder/cmder.bat
    ```

-   Check with cmd below, it will show php version if it's correct :

    `php -v`

## Cheatsheet

-   Install font in :

    `https://fontsource.org/`

-   Run server with port

    `php artisan serve --port=8000`

-   Easy way to create model, migration, controller, request

    `php artisan make:model Role -mscr`

    atau

    `php artisan make:model Role --migration --seed --controller --resource`

-   Generate model for \_ide_helper

    `php artisan ide-helper:models`

-   Icon library :

    `https://lucide.dev/icons/`
