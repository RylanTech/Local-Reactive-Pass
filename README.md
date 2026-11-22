# Local-Reactive-Pass

The public version of this site is available at https://reactivepass.com. It costs $8 a year. This repo is for if you want to use it on your own network which would be the safest way to store your passwords.

## Before You Try
There are some security concerns that you should consider before setting this up. This project, by deafult, will use unencrypted http unless you set up TLS for https. If you do that, make sure to adjust the URLs as needed. If you do not do this, all passwords are sent over the network unencrypted and can be observed from a networking monitoring tool. If you are setting this up on a isolated local network, this may not be a concern, but it is still recommended.

## Setuo

There are two ways to congigure this, through Docker, or just plain on the system.

### Prerequisites

#### MySQL/MariaDB Database
To set this up you need to have a MySQL or MariaDB instance available and a database created with the name of your choice, the default name is rpass.

#### Environment variables
Whether you set up the project with or without Docker, you will need to set up the environment variables located in both the frontend and the backend.

Modify the project's environment variables:
  - rpass-backend
    - VITE_API_URL
  - rpass-frontend
    - DB_NAME
    - DB_HOST
    - DB_USER
    - DB_PASS
    - ENCRYPTSECRET

### Deployment

#### Docker
Please note that the frontend and backend containers are configured to communicate directly with one another over the system's internal network. Container-to-container network communication is permitted and is not isolated or restricted.

For both rpass-frontend and rpass-backend there is a Dockerfile to build a container. Here are the commands to do so.

##### Building and Running the Backend
The backend container will not run unless it can connect to the database.

Build the container
```
sudo docker build -t rpass-backend-image .
```

Run the container
```
sudo docker run -d --env-file .env -p 3000:3000 rpass-backend-image
```

##### Building and Running the Frontend

Build the container
```
sudo docker build --build-arg VITE_API_URL=http://backend-ip:port/ -t rpass-frontend-image .
```

Run the container
```
sudo docker run -d --name rpass-frontend -p 80:80 rpass-frontend-image
```

#### Standalone (Without Docker)

##### node.js
You will need node/npm installed to run the project. You will also need a process manager, such as systemd or pm2, to run the project constantly.

If you're running this on a dedicated computer, please setup a static IP for this VM to be used as the URL to access the site. That IP will also be used as the url that you will hardcode into the frontend to communicate to the backend.

By default both the frontent and backend use port 3000, this will need to be changed if you are running this on the same system.

https://pm2.keymetrics.io/ \
https://www.npmjs.com/

##### Running the Backend
Run the following in the "LocalReactivePass/rpass-backend" directory:

```
npm i - Installs the necessary dependencies which are visable under package.json file
npm run build - Compiles the code
npm start - Runs the server
```

If you configured the database incorrectly, you may get errors here.

##### Running the Frontend
Run the following in the "LocalReactivePass/rpass-frontend" directory:

```
npm i - Installs the necessary dependencies which are visable under the package.json file
npm start - Runs the server
```

From here, the web server should be running.

##### Process Manager
You will want to get a process manager to run "npm start" in the background with a non-root user that has the proper permissions to the code. Either systemd or PM2 will work. PM2 is easier to work with, but if you are familiar with systemd, use that instead.
