# Local-Reactive-Pass

## Prerequisites
To set this up you need to have mySQL installed and a database created with the name of your choice, the default name is localreactivepass. You will need npm installed as well to run the project. You will also need a process manager, such as pm2, to run the project constantly.

If your running this on a dedicated computer, please setup a static IP for this VM to be used as the URL to access the site. That IP will also be used as the url that you will hardcode into the frontend to communicate to the backend.

By deafault the frontend uses port 3000 and the backend uses 3001.

https://pm2.keymetrics.io/ \
https://www.npmjs.com/

## Backend Setup

### Modify .env
Open the .env file in the "LocalReactivePass/Rpass-backend" directory with a text editor and change the following: \
\
DB_NAME with the name of choice for your database \
DB_PASS with the password to mySQL\
DB_USER with the username in mySQL, the default is "root"\
ENCRYPTSECRET with an encryption secret, you can use and string of text you like. 


### Running the Backend
run the following in the "LocalReactivePass/Rpass-backend" directory:



    "npm i" - This will install the necessary dependencies which are visable under the frontend's and backend's package.json file
#
    "npm run build" - This will compile the code
#
    "npm start" - Runs the server

If you configured mySQL incorrectly you may get errors here. \
\
Once it starts successfully, get a process manager to run "npm start" in the background.

## Frontend Setup

### Setting Backend URL
Under "rpass-frontend/src/contexts", do the following with PassContext.js and UserContext.js. Once the file is opened in a text editor, change the baseURL on line 5 with your server's IP where the word localhost is. \
\
Before: 

    http://localhost:3001/

#

After:

    http://"Your IP Here":3001/

## Running the Frontend
Run the following in the "LocalReactivePass/rpass-frontend" directory:

    "npm i" - This will install the necessary dependencies which are visable under the frontend's and backend's package.json file
#
    "npm start" - Runs the server

From here the web server should be running on http://"Server IP":3000/.