# Carbon Applications and Packages

This mono-repository contains the source code for the Carbon ERP.

### Apps

| Package Name | Description     |
| ------------ | --------------- |
| `carbon`     | ERP Application |
| `docs`       | Documentation   |

### Packages

| Package Name           | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `eslint-config-carbon` | Shared, extendable eslint configuration for apps and packages           |
| `@carbon/database`     | Database migrations and types                                           |
| `@carbon/jest`         | Jest preset configuration shared across apps and packages               |
| `@carbon/logger`       | Shared logger used across apps                                          |
| `@carbon/react`        | Shared web-based UI components                                          |
| `@carbon/redis`        | Redis cache client                                                      |
| `@carbon/tsconfig`     | Shared, extendable tsconfig configuration used across apps and packages |
| `@carbon/utils`        | Shared utility functions used across apps and packages                  |

## Tech Stack

- [Turborepo](https://turbo.build)
- [Remix](https://remix.run)
- [Supabase](https://supabase.com/)
- [Postgres] (https://postgresql.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Redis](https://redis.io)
- [Prisma](https://prisma.io/)

## Local Development

Make sure that you have [Docker installed](https://docs.docker.com/desktop/install/mac-install/) and [yarn installed](https://yarnpkg.com/lang/en/docs/install/#debian-stable)
on your system since this monorepo uses the yarn package manager.

Then download and initialize the repository dependencies.

```bash
$ yarn           # install dependencies
$ yarn db:start  # pull and start the containers
```

Copy the environment variables from the initialization script to an `.env` file:

```
$ cp ./.env.example ./.env
```

After you've set the enviroment variables to the output of `db:start` you can run

```bash
$ yarn setup     # run db migrations and seed script
```

Finally, start the apps and packages:

```bash
yarn dev         # yarn dev in all apps & packages
```

To kill the database containers, you can run, but fair warning that this will delete the database:

```bash
$ yarn db:kill   # stop and delete all database containers
```

To run a particular application, use the `yarn workspace` command.

For example, to run the `carbon` app you can run:

```
$ yarn workspace carbon dev
```

The generalized command for workspaces is:

```
$ yarn workspace <package name> <dev|build|lint|test>
```

In order to import a package from the repo into another package/app from
the repo, use the convention of using `"*"` for the version number.

For example, in order to include the `@carbon/react` package, add this line
to the `package.json`:

```
{
"@carbon/react": "*"
}
```
