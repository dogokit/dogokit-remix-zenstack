# Dogokit Remix ZenStack

Docs:

- [Remix](https://remix.run)
- [ZenStack](https://zenstack.dev)

## Installation

```sh
bun install
```

## Development

Migrate database schema to the database:

```sh
bun db:migrate
```

Generate the Prisma client and more using ZenStack:

```sh
bun db:gen
```

Run the dev server:

```sh
bun dev
```

## Deployment

Pick a server host to deploy it to.

Install the dependencies, migrate database, and generate required files:

```sh
bun install && bun db:migrate && bun db:gen
```

Build app for production:

```sh
bun run build
```

Then run the app in production mode:

```sh
bun start
```

### DIY

The built-in Remix app server is production-ready.

Make sure to deploy the output of `bun run build`.

- `build/server`
- `build/client`
