<div align="center">
  <h1>Bento App</h1>
  
  <p>
    View and manage your frequently used links in a convenient way.
  </p>
  
<div>

  <h4>
    <a href="https://github.com/instantrahmen/bento-app/issues/">Report Bug</a>
  <span> · </span> 
    <a href="https://github.com/instantrahmen/bento-app/issues/">Request Feature</a>
  </h4>
</div>

<br />

## :star2: About the Project

Bento is a tool to help manage and organize your frequently used links in a convenient way. It allows you to create lists of links, known as "bentos," which you can access quickly whenever you need them. This makes it easier for you to navigate to your favorite apps, pages, and resources with just a few clicks.

</div>

<!-- TechStack -->

### :space_invader: Tech Stack

- [Bun](https://bun.sh/)
- [Typescript](https://www.typescriptlang.org/)
- [Prisma](https://prisma.io/)
- [SvelteKit](https://kit.svelte.dev/)

<!-- Run Locally -->

### :running: Run Locally

Clone the project:

```bash
git clone https://github.com/instantrahmen/bento-app.git
```

Go to the project directory:

```bash
cd bento-app
```

Copy the .env.example file to .env and fill out the required keys.
For the Discord ID and secret, go to [https://discord.com/developers/applications](https://discord.com/developers/applications) and create a new application.

For the GitHub ID and secret, go to [https://github.com/settings/apps](https://github.com/settings/apps) and create a new application.

```bash
cp .env.example .env
```

Generate a new auth secret (remember to copy it into .env):

```bash
openssl rand -hex 32
```

Install dependencies:

```bash
bun install
```

Create the database:

```bash
bun db:push
```

Start the development server:

```bash
bun dev
```

<!-- Code of Conduct -->

### :scroll: Code of Conduct

Please read the [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing. It's based on the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct.html) and has been slightly adapted for extra clarity.

## :warning: License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.
