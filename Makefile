.build-go:
	go build -o forms github.com/ender-gr/xomologisou-forms/bootstrap

.build-alpine-go:
	GOPRIVATE=github.com/ender-gr/* CGO_ENABLED=0 GOOS=linux \
	go build -a -installsuffix cgo -o forms github.com/ender-gr/xomologisou-forms/bootstrap

.build-app:
	cd app; yarn install && yarn build:prod

build: .build-alpine-go .build-app
	docker build --tag xomologisou-forms:latest .

start-app:
	cd app; yarn start

start-go: .build-go
	./forms -dev

debug-go:
	dlv debug .
