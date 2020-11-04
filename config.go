package xomologisouForms

type Configuration struct {
	PostgresURL     string `yaml:"postgres_url"`
	ReCaptchaSecret string `yaml:"re_captcha_secret"`
}
