xomologisou.gr -  forms
===

## Introduction

This project is the customer-facing side of the xomologisou a§pp, a popular Greek application
that handles confesessions for Facebook confession pages.

The managing software is located in a different repo, and will be published at a later time.

## Structure

The project structure is as follows:
```
.
├── .github/workflows  # The GitHub workflows to build and distribute this image.
├── app                # The Angular app root that contains the frontend portion of the site.
├── bootstrap          # The `bootstrap` Go package, that handles app boot.
└── web                # The REST API logic for the endpoints the apps handles.
```
Unfortunately the project does not include any sort of tests, and none are planned to be added.

If you feel like it, I would be eternally humbled if you contributed some tests!

## Build it, ship it! :shipit:

Building the application requires Go 1.13+, NodeJS 10 and Yarn.

Building it is as simple as:
```
make
```

In the end, you'll have a Docker image ready with the `xomologisou-forms:latest` tag.

## Development

Development guide starting soon!

Long story short, you need a PostgreSQL database available and a reCAPTCHA key. You can start up the
app with the `start-app` and the `start-go` targets.
