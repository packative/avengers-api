# Packative Avengers API

# How to? ❓

- Fork this repository, so it can stay on Github
- Commit your changes after every task
- When you finish, send us the link of your repository

# Goals / Outcomes ✨

- Fetch data from the Marvel OpenAPI
- Use async/await

# Tasks 📖

- Sign up at [https://developer.marvel.com/ ](https://developer.marvel.com/signup)
  - Create a Key ( https://developer.marvel.com/documentation/getting_started ) -> "Get an API Key" -> Accept the Terms
  - Access the API Key from https://developer.marvel.com/account
- Call the API:
  - You can either work with an existing package (e.g npm package: marvel)
  - Or use axio/fetch/fetchFrom etc...
- Filter Series from the Marvel API for "avengers"
- Get all characters related to the avenger series and return them as json over the GET route /avengers

# What's Already Been Done 🏁

- App with express & routes are setup
- Babel is setup to use ES7
- Nodemon is setup so you can start the local environment with `yarn run start`

# Package Manager

- Please use `yarn`

# How To Set Your API KEY

- Write down your public and private key in .env.example file and change file name to .env
- npm run start command your preload the key values.
