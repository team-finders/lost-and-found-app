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
