# Post Hub

## Description

A Model-View-Controller application that provides authentication and authorization for users to sign up, sign in, sign out. Each user can create, update, and delete posts. 

## Features

- User authentication and authorization (Sign up, Sign in, Sign out)
- Each user can Create, Update, and Delete their own posts
- Each user can see ALL the posts in the website
- A guest user (user who doesn't sign in) can see ALL the post, as well as can comment on ALL the posts
- Each user who signed in can also comment on ALL the posts


## Technologies:
- Node.js
- Express.js
- express-session
- Cloudinary
- multer
- MongoDB
- Mongoose
- EJS
- Bootstrap
- bcrypt
- dotenv
- method-override
- morgan
- Heroku

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/manijehshirzadeh/post-hub
   cd post-hub
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

    Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following environment variables to the `.env` file:
     ```env
     MONGODB_URI=<connection-string-to-mongo-db>
     SESSION_SECRET=your_session_secret
     ```

3. Start the application:
   ```bash
   npx nodemon
   ```

4. Visit `localhost:3000`



## Deployment
The project is deployed to Heroku. Can be accessed via:

https://post-hub-ac12c1aebd05.herokuapp.com/

## Next Steps:
- Adding Edit and Delete functinality for Comments
- Adding Like a Comment or Post functinality
- Adding Date and Time for the Comments and Posts Schema/Models
- Adding a user image upload functinality, so we can show their image next to their Posts and Comments
