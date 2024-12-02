
## The project is an implementation of test automation for the Hackathon.

### Test run results can be found at:

- dev - ```./report-dev.html```
- prod - ```./report-prod.html```
- video - https://youtu.be/d31sYHmsEvE

### Encountered bugs:

- api-1 Delete existing user: server returns 500 error code trying to delete registered user
- api-2 Search games by name: Search by name not working and returns all games
- api-3 Create a new user and verify it: Sending post request to create a new user  creates a user with empty "nickname" field value
- api-4 Update user profile: Server allows to update user with email field that already exists on another user and returns 200 code instead of 409
- api-5 Post and item to wishlist: Server returns 422 code instead of 200 trying to add a game to users wishlist
- api-6 Get list all users: Server always return offset=0
- api-7 Get a user by email and password: Server returns 404 trying to login resgistered user
- api-8 Remove an item from wishlist: Server does not remove an item from wishlist
- api-9 Get a game: Server returns 404 code and does not return a game by UUID
- api-10 Get game by category: Server returns games with wrong category UUID
- api-11 Update users avatar: Server generates wrong avatar url
- api-12 Get a cart: Server returns carts total price 0 instead of total games price
- api-13 Change an item in users cart: Sending POST request to change users item in the cart - server returns empty list of items in cart
- api-14 Remove an item from users cart: Having 2 items in a users cart, sending POST request to remove one of them - server removes all items in a users cart and returns empty items list
- api-15 Clear users cart: Server does not clear users cart
- api-18 Update an order status: Updating an order status from 'open' to 'canceled' returns 422 error code instead of 200
- api-21 List all users: GET request to slist users with limit=1 returns meta.total key with value 0 instead of 11
- api-22 Create a new user: Sending POST request to create new user returns 500 status code instead of 200
- api-23 GET a user: Sending request to get a user with non existing UUID returns 200 code and first user instead od 404 status code
- api-24 Update a user: Updating a valid registered user and trying to login with the updated user returns error code 404
- api-25 Add an item to users wishlist: Item added to users wishlist is not returned requesting the users wishlist 

### Bugs pendiing to find: 

#### Orders 

API-16

API-17

#### PAYMENT 

API-19

API-20


## Project setup 

You have to have NodeJS and Java installed.

clone the repo

```npm install```

set the desired ENV in the .env file

set the TOKEN in the .env file

```npm run test```

The allure report will be generated at the end of the tests run in the forlder ``report/allure-report``

## Project description

⏰ Key Dates:
Start: Nov 29, 18:00 UTC ← We're here now
Submit: Dec 2, 15:00 UTC

🏆 Prizes: 1st → $700 ■ 2nd → $550 ■ 3rd → $400 ■ 4th → $250 ■ 5th → $100

📱 Progress Tracking: https://polite-gecko-e1beb8.netlify.app/

🔍 API Documentation (Swagger): https://petstore.swagger.io/?url=https://release-gs.qa-playground.com/api/v1/swagger.json

📺 Opening Session (same as Twitch): https://raptors.wistia.com/medias/oukt87ctpe

👨🏻‍🏫 Slides: https://docs.google.com/presentation/d/1VBHaoJOFWTMZLim5Fi3EU7uwKzYOYdGzKsWd008q2tM/edit?usp=sharing

🛠️ Dev Environment:

https://dev-gs.qa-playground.com/api/v1/

🚀 Release (Production):

https://release-gs.qa-playground.com/api/v1/

What you'll do:
— Test a fully functional API
— Hunt for 25 hidden bugs
— Create & document your test suite
— Submit your findings

Start coding and testing right away!  The project submission link will be shared later.
