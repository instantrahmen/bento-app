# Application Features

This directory is for application features that should be largely self-contained. In accordance with the [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) project structure and for easier scalability and maintanance, most of the project's code should go here.

Shared components are located in the [components](../components/README.md) directory. If the feature is going to be imported and used by multiple components, it should be placed there instead.

## Features

### [icon-select](./icon-select/icon-select.svelte)

Icon selection component. Fetches icons from the [iconify API](https://iconify.design/docs/api/) and displays them in a filterable combo box with fuzzy search.

### [auth](./auth/index.ts)

All authentication related code should go here. This includes any registration or login forms/components, if we ever end up adding those.

### [bento](./bento/index.ts)

All code related to bentos and bento-links should go here.

### [database](./database/index.ts)

All database/prisma related code should go here, with the exception of the prisma schema which can be found in the [/prisma](../../../prisma/schema.prisma) directory.
