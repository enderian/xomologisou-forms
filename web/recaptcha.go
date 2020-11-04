package web

import (
	"encoding/json"
	"net/url"

	xomologisouForms "github.com/ender-gr/xomologisou-forms"
	"github.com/valyala/fasthttp"
)

var reCaptchaSiteSecret string

func SetupCaptcha(configuration *xomologisouForms.Configuration) {
	reCaptchaSiteSecret = configuration.ReCaptchaSecret
}

func verifyCaptcha(response string) bool {
	client := &fasthttp.Client{}
	request := fasthttp.AcquireRequest()
	res := fasthttp.AcquireResponse()

	data := url.Values{}
	data.Set("response", response)
	data.Set("secret", reCaptchaSiteSecret)

	request.URI().Update("https://www.google.com/recaptcha/api/siteverify")
	request.Header.SetMethodBytes([]byte("POST"))
	request.SetBody([]byte(data.Encode()))

	resp := struct {
		Success bool    `json:"success"`
		Action  string  `json:"action"`
		Score   float64 `json:"score"`
	}{}
	err := client.Do(request, res)
	if err != nil {
		return false
	}
	_ = json.Unmarshal(res.Body(), &resp)
	if !resp.Success {
		return false
	}

	if resp.Action == "form" && resp.Score > 0.6 {
		return true
	}
	return false
}
