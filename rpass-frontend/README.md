Building the backend Docker container
```
sudo docker build -t rpass-frontend-image -f Dockerfile .
```

Running the container
```
docker run -d --name rpass-frontend -p 3000:80 rpass-frontend-image
```
