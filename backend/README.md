## .graphql files explanation

- `datamodel.graphql` -> used to define the schema for the Prisma database
- `generated/prisma.graphql` -> generated after the `datamodel.graphql` gets deployed to Prisma
- `schema.graphql` -> public facing API

## Yoga <-> Prisma

- make changes to the Prisma schema (`datamodel.graphql`)
- deploy changes to the Prisma server (`npm run deploy`)
- deployment generates `generated/prisma.graphql` with all available interfaces to the Prisma db
- write queries and mutations in `/resolvers`, using what's available in `generated/prisma.graphql`
