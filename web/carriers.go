package web

import (
	"github.com/ender-gr/xomologisou-common"
	"github.com/gin-gonic/gin"
)

type carrierListStruct struct {
	Id           string `json:"id"`
	Name         string `json:"name"`
	FacebookPage string `json:"facebook_page"`
	Likes        int    `json:"likes"`
}

func CarriersGet(c *gin.Context) {

	carriers := make([]*xomologisou.Carrier, 0)
	err := db.Model(&carriers).
		Where("suspended is not ?", true).
		Where("form->>'enabled' = ?", "true").
		Where("statistics->>'likes' is not null").
		OrderExpr("(statistics->>'likes')::integer DESC").
		Limit(9).Select()

	if err != nil {
		_ = c.AbortWithError(500, err)
		return
	}

	ccl := make([]carrierListStruct, 0)
	for _, c := range carriers {
		cc := carrierListStruct{c.Id, c.Name, c.FacebookPage, 0}
		if likes, ok := c.Statistics["likes"].(float64); ok {
			cc.Likes = int(likes)
		}
		ccl = append(ccl, cc)
	}

	c.Writer.Header().Set("Cache-Control", "public, no-transform, max-age=1800")
	c.JSON(200, ccl)
}
