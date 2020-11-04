package web

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net"
	"strings"
	"time"

	"github.com/ender-gr/xomologisou-common"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg"
)

type submitSuccess struct {
	Id string `json:"id"`
}

func SecretSubmit(c *gin.Context) {

	multiPartForm, err := c.MultipartForm()
	if err != nil {
		c.AbortWithStatusJSON(400, formError{"Μή έγκυρα δεδομένα!"})
		return
	}
	if !verifyCaptcha(multiPartForm.Value["captcha"][0]) {
		c.AbortWithStatusJSON(403, formError{"Τι κανεις εκει ρε Καραμήτρο;"})
		return
	}

	err = db.RunInTransaction(func(tx *pg.Tx) error {
		cid := c.Param("carrier")
		carrier, err := xomologisou.FindCarrier(tx, cid)
		if err != nil {
			return formError{"Δεν υπάρχει αυτή η φόρμα."}
		}

		formData := struct {
			Content string            `json:"content"`
			Options map[string]string `json:"options"`
		}{}
		_ = json.Unmarshal([]byte(multiPartForm.Value["secret"][0]), &formData)

		hasContent := formData.Content != ""
		hasImage := len(multiPartForm.File["file"]) > 0 && multiPartForm.File["file"] != nil

		if !hasContent && !hasImage {
			return formError{"Δεν υπάρχει περιεχόμενο."}
		}
		if hasContent && len(strings.ReplaceAll(formData.Content, " ", "")) > 2500 {
			return formError{"Κείμενο μεγαλύτερο των 2500 χαρακτήρων."}
		}

		imageId := ""
		if hasImage {
			file, err := multiPartForm.File["file"][0].Open()
			if err != nil {
				return formError{"Μη έγκυρα δεδομένα."}
			}
			bits, err := ioutil.ReadAll(file)
			result, err := uploadPublicImage(bits)
			if err == nil {
				imageId = result
			} else {
				log.Printf("Error while uploading image to S3: %s\n", err.Error())
			}
		}

		source := ConstructSourceData(c)

		content := ""
		if hasContent {
			content = strings.Trim(formData.Content, " \t\n")
		}

		var options = make(map[string]string)
		for id, value := range formData.Options {
			if set, ok := carrier.Form.OptionSets[id]; ok {
				if _, ok := set.Options[value]; ok || set.AllowCustom {
					options[id] = value
				}
			}
		}

		secret := &xomologisou.Publishable{
			Carrier:           carrier.Id,
			Status:            xomologisou.PublishableSent,
			Content:           content,
			ImageId:           imageId,
			Options:           options,
			PublishableSource: source,
		}

		if err := xomologisou.InsertPublishable(tx, secret); err != nil {
			log.Println(err.Error())
			return formError{"Σφάλμα κατα την αποθήκευση. Δοκιμάστε αργότερα."}
		}

		c.JSON(200, submitSuccess{secret.Id})
		return nil
	})
	if err != nil {
		c.AbortWithStatusJSON(400, err)
		return
	}
}

func ConstructSourceData(c *gin.Context) xomologisou.PublishableSource {

	ip := c.Request.Header.Get("CF-Connecting-IP")
	country := c.Request.Header.Get("CF-IPCountry")
	addr, err := net.LookupAddr(ip)

	hostname := "?"
	if err == nil {
		hostname = addr[0]
	}

	return xomologisou.PublishableSource{
		Timestamp: time.Now(),
		IpAddress: ip,
		Country:   country,
		Hostname:  strings.Trim(hostname, "."),
		UserAgent: c.Request.UserAgent(),
	}
}
