# Lost-and-FoundIt

## Project Description
Lost-and-FoundIt is a back-end web-server that can be used by businesses or institutions to help match lost items with their owners. Finders of lost items can post the item via the web-server, which logs the item into a database. Those who have lost items can post a "lost item" request, and be notified through a text should there be a match in the database.

## Technologies
- Node.js
- Express
- MongoDB / Mongoose
- bcrypt
- AWS S3
- Twilio
- Travis CI

## Project Team
- Noah Alexander 
- Karen Lai 
- Liz Petersen

## Entity Relationship
![erd diagram](https://raw.githubusercontent.com/team-finders/lost-and-found-app/staging/src/temp/erd.png)

### Schemas
- Owner
- User
- Item
- Assets (images of the items, unless security is needed)

## Account Routes 
### POST 
/api/signup tp create a new Account, and enter the properties: 
- Username
- Email
- Password
- First Name
- Last Name
- Phone Number

On success, we return our created account, we delete the password from the body of our Schema for security purposes. We then create a new promise for our token which will log success when a token is returned in JSON format to our database. If unsuccessful, our catch will move us to the next operation.

###GET  
/api/login, logs us into an existing an account. On success, we receive a 200 status code, and create a new token promise which returns a token response in JSON format. Authentication to Bearer Token: set Token field to token retrieved from Account creation, then confirm with Preview Request



