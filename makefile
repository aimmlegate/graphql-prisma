start:
	npm run start

start-docker:
	systemctl start docker.service
	docker-compose up -d