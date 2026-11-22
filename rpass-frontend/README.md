Build the container
```
sudo docker build --build-arg VITE_API_URL=http://backend-ip:port/ -t rpass-frontend-image .
```

Run the container
```
sudo docker run -d --name rpass-frontend -p 80:80 rpass-frontend-image
```
