package web

import (
	googleStorage "cloud.google.com/go/storage"
	"context"
	"crypto/rand"
	"encoding/hex"
	"firebase.google.com/go"
	"firebase.google.com/go/storage"
	"fmt"
	"google.golang.org/api/option"
	"log"
	"net/http"
)

const firebaseStorageFormat = "https://storage.googleapis.com/%s/%s"
const firebaseBucket = "xomologisougr.appspot.com"

var storageClient *storage.Client

func InitializeFirebase(credentials string) {
	opt := option.WithCredentialsFile(credentials)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Panic(err)
	}
	scl, err := app.Storage(context.Background())
	if err != nil {
		log.Panic(err)
	}
	storageClient = scl
}

func uploadPublicImage(image []byte) (string, error) {
	bucket, err := storageClient.Bucket(firebaseBucket)
	if err != nil {
		return "", err
	}
	id := make([]byte, 24)
	_, _ = rand.Read(id)
	obj := bucket.Object("images/" + hex.EncodeToString(id)).NewWriter(context.Background())
	obj.ACL = []googleStorage.ACLRule{{Entity: googleStorage.AllUsers, Role: googleStorage.RoleReader}}
	obj.ContentType = http.DetectContentType(image)

	if _, err := obj.Write(image); err == nil {
		_ = obj.Close()
		return fmt.Sprintf(firebaseStorageFormat, obj.Attrs().Bucket, obj.Name), nil
	}
	return "", err
}
