FROM golang:alpine

EXPOSE 80/tcp

WORKDIR /root/
COPY forms .
COPY static ./static

RUN mkdir -p /opt/certificates
RUN apk --no-cache add ca-certificates
RUN chmod ug+x ./forms
RUN ls -la ./

ENTRYPOINT ["./forms"]
