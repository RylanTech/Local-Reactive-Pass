Build the container
```
sudo docker build -t rpass-backend-image .
```

Run the container
```
sudo docker run -d --env-file .env -p 3000:3000 rpass-backend-image
```
