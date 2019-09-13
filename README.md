# HRR40-FEC1 Target based item detail -Review Section
* clone repo
* run npm install
* install mongodb and start the db
* set up env variables
* review package.json for npm scripts
*   for dev mode -
    *   seed the db -> npm run seed
    *   start webpack -> npm run react-dev
    *   start express
    ```
    "test": "jest",
    "test:watch": "jest --watchAll",
    "test:coverage": "jest --coverage",
    "test:mocks": "node db/faker/index.js",
    "seed": "node db/seed.js",
    "start": "nodemon server/server.js",
    "react-dev": "webpack -d --watch"
    "build": "webpack"
    ```


## SDC3 Targee-Clible Item Review

* Create `env` file with mutiple KEY=VALUE pairs, one on each line, see `.env.example` to see structure. For example:

```
PORT=3004
MONGO_URI=mongodb://localhost/tcreviews
MYSQL_HOST=localhost
MYSQL_DB=tcreviews
MYSQL_USER=root
MYSQL_PASSWORD=mypass

```

To Seed MySQL Database with 10 Millions of records:

* Migrate MySQL Database structure
```bash
npm run migrate:mysql
```
* Seed MySQL DB (This can take 5 to 15 minutes)
```bash
npm run seed:mysql
```

