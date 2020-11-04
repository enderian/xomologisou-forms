package web

import (
	"github.com/ender-gr/xomologisou-common"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg"
)

const globalCarrier = "*"
const globalSection = "*"

type formResponse struct {
	Form         *xomologisou.CarrierForm `json:"form"`
	FacebookId   string                   `json:"facebook_id"`
	FacebookName string                   `json:"facebook_name"`
}

type formError struct {
	Message string `json:"error"`
}

func (e formError) Error() string {
	return e.Error()
}

func CarrierForm(c *gin.Context) {
	err := db.RunInTransaction(func(tx *pg.Tx) error {
		data := formResponse{}
		cid := c.Param("carrier")
		carrier, err := xomologisou.FindCarrier(tx, cid)
		if err != nil {
			return formError{"Η φόρμα δεν υπάρχει!"}
		}
		if carrier.Suspended {
			return formError{"Η φόρμα έχει ανασταλεί από τους διαχειριστές του xomologisou."}
		}

		if carrier.Form.Enabled {
			data.Form = carrier.Form
			data.FacebookName = carrier.Name
			data.FacebookId = carrier.FacebookPage
		} else {
			return formError{"Η φόρμα είναι απενεργοποιημένη από τους διαχειριστές της."}
		}

		c.Writer.Header().Set("Cache-Control", "public, no-transform, max-age=300")
		c.JSON(200, data)

		return nil
	})
	if err != nil {
		c.JSON(400, err)
	}
}
