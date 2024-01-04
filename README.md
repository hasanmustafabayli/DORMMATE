=======
# CS411 Project :computer:
A4 group 11: Viktoria, Hasan, Mya

## *DormMate* :iphone: :mag_right: 🧑‍🤝‍🧑

### Project description:
Introducing "*DormMate*" - the ultimate solution for university students looking for a roommate. Our blog-like app offers a user-friendly interface that allows you to browse and match with potential roommates from your university or nearby universities. Users can scroll through potential roommates and view their descriptions to determine if they're a good match. The app requires users to sign up with their gmail email address. User needs to pick their most preferred location on/off campus to display at their personal site. *DormMate* is designed to help students avoid the uncertainty of living with a stranger and provide a platform to find a compatible roommate with ease.

### Database to use: 
* MongoDB

### APIs to use: 
- ***Weather API*** - shows weather in the location the user currently is.

- ***GiphyAPI*** - user can add funny posts to share.


### Third-party authentification: 
OAuth for logging in using Google, Facebook

### Decoupled architecture:
* BackEnd - Node.js
* FrontEnd - React Native
----------------------------------
## Mongo DB
Open a terminal to the project directory and run the following to start mongo in docker

`docker compose up`

There is a web UI you can use to view/delete mongo tables
`http://localhost:8081/`


## Server
Open a terminal and cd to the server directory and run the following

`npm install` (one time to install dependencies)

`PORT=3001 JWT_SECRET=somesuperhardstringtoguess MONGO_URL=mongodb://root:example@localhost:27017 node index.js` (to start server)


## Client
Open a terminal into the client directory and run the following

`npm install` (one time to install dependencies)

`npm start` (to start client)

Go to `http://localhost:3000/` to access the client


