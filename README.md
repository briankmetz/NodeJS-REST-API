#NodeJS

## Database

Import structure and data from /db/schedulerSchema.sql as a self-contained file into MySQL. Use target schema name 'scheduler_dev'.

## Config

Rename EXAMPLE.env to [.env](https://www.npmjs.com/package/dotenv) in the root directory. At a minimum the username and password for the database must be configured so the server can connect with a running instance. The server can run without AWS fields being configured though obviously some functionality won't work.

## Server

Run `npm install' & `node server.js`. If everything is working you should see 'Objection DB connection established' printed to the console.

## Example Endpoint

POST http://localhost:3001/v1.0/auth/signup/test-conference
Required req.body keys: email, password, name

<code>Creates a new user and signs them up as an attendee to the test conference</code>