requirements:
	./requirements.sh

install:
	docker run -v C:\Users\1013606332\app\colcomercio\ck-invoicexml:/app -w /app -i -t node bash -c "npm install"

up:
	docker-compose up -d

down:
	docker-compose down

ps:
	docker-compose ps

start:
	docker-compose start

restart:
	docker-compose restart

stop:
	docker-compose stop

log:
	docker-compose logs -f

cli:
	docker exec -it ck-invoicexml /bin/sh

build:
	docker build -t registry.gitlab.com/alkosto/microservices/ck-invoicexml:$(version) .

push:
	docker login registry.gitlab.com
	docker push registry.gitlab.com/alkosto/microservices/ck-invoicexml:$(version)

npm-i:
	npm install --save body-parser swagger-tools

npm-i-dev:
	npm install --save-dev cross-env

sw-gentest:
	swagger project generate-test