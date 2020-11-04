package main

import (
	"errors"
	"flag"
	"github.com/ender-gr/xomologisou-forms"
	"github.com/ender-gr/xomologisou-forms/web"
	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"time"
)

var (
	port        = ":80"
	development = flag.Bool("dev", false, "Enable development mode.")
	configFile  = flag.String("config", "config.yml", "Configuration file.")
	firebase    = flag.String("firebase", "firebase.json", "Filebase credentials.")
)

func main() {
	flag.Parse()

	config := &xomologisouForms.Configuration{}
	if file, err := os.Open(*configFile); err == nil {
		b, err := ioutil.ReadAll(file)
		if err != nil {
			log.Panicln(err)
		}
		err = yaml.Unmarshal(b, config)
		if err != nil {
			log.Panicln(err)
		}
	} else {
		log.Panicln(err)
	}

	web.InitializeDatabase(config.PostgresURL)
	web.InitializeFirebase(*firebase)

	if !*development {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	web.SetupCaptcha(config)

	if *development {
		port = ":8091"
		router.Use(gin.Recovery())
	} else {
		router.Use(gin.Logger())
		router.NoRoute(func(context *gin.Context) {
			uri := context.Request.RequestURI
			file, err := os.Open(path.Join("./static/", uri))
			if err != nil || len(uri) < 2 {
				uri = "index.html"
				file, err = os.Open(path.Join("./static/", uri))
			}
			if err != nil {
				_ = context.AbortWithError(404, errors.New("file not found"))
				return
			}
			http.ServeContent(context.Writer, context.Request, filepath.Base(uri), time.Time{}, file)
		})
	}

	router.GET("/api/carriers", web.CarriersGet)
	router.GET("/api/carrier/:carrier/form", web.CarrierForm)
	router.POST("/api/carrier/:carrier/submit", web.SecretSubmit)
	router.GET("/api/carrier/:carrier/secret/:id", web.StatusRead)
	router.OPTIONS("/api/carrier/:carrier/report/:hashtag", web.ReportOptions)
	router.PATCH("/api/carrier/:carrier/secret/:id", web.StatusPatch)

	log.Printf("xomologisou is now running on port %s\n", port)
	err := router.Run(port)
	if err != nil {
		log.Fatal(err)
	}
}
