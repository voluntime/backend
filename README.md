# Voluntime - Backend

## Run Locally

You need a `.env` file created with the following features defined:

```bash
COOKIE_SECRET=voluntime           # the secret

COOKIE_DOMAIN=localhost           # the domain in which the cookie is set
CORS_ORIGIN=http://localhost:3000 # the url for the frontend

DATABASE_URL=db_url_goes_here     # could be a remote
                                  # Postgres instance or local

NODE_ENV=development              # Dev for development

POSTGRES_SSL=true                 # true if you use a Postgres
                                  # instance that enforces SSL
```

Then, it's as simple as:

```bash
$ yarn
$ yarn start
```