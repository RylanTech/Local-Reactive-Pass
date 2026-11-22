Building the backend Docker container
```
sudo docker build --build-arg VITE_API_URL=http://192.168.68.66:3000/ -t rpass-frontend-image .
```

Running the container
```
sudo docker run -d --name rpass-frontend -p 3001:80 rpass-frontend-image
```
