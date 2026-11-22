sudo docker build --no-cache -t rpass-backend .

sudo docker run -d --env-file .env -p 3000:3000 rpass-backend
