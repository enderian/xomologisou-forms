package web

import (
	"github.com/ender-gr/xomologisou-common"
	"github.com/gin-gonic/gin"
)

type reportResponse struct {
	statusResponse
	Reportable bool `json:"reportable"`
}

func ReportOptions(c *gin.Context) {
	pub, err := xomologisou.FindPublishableByHashtag(db, c.Param("hashtag"))
	if err != nil || pub.Status != xomologisou.PublishablePublished {
		c.JSON(400, formError{"Δεν υπάρχει τέτοιο δημοσιευμένο μυστικό."})
		return
	}
	pub.ClearSensitiveData()

	c.JSON(200, reportResponse{
		statusResponse: statusResponse{
			Id:         pub.Id,
			Content:    pub.Content,
			Image:      pub.ImageId,
			PublishUrl: pub.FacebookPost,
		},
		Reportable: true,
	})
}
