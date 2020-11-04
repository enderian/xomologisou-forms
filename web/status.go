package web

import (
	"github.com/ender-gr/xomologisou-common"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

type statusAction struct {
	Action string `json:"action"`
}

type statusResponse struct {
	Id         string `json:"id"`
	Content    string `json:"content"`
	Image      string `json:"image,omitempty"`
	PublishUrl string `json:"publish_url,omitempty"`
	Status     *int   `json:"status,omitempty"`
	Deletable  *bool  `json:"deletable,omitempty"`
}

func StatusRead(c *gin.Context) {
	err := db.RunInTransaction(func(tx *pg.Tx) error {
		cid := c.Param("carrier")
		secret, err := xomologisou.FindPublishable(db, c.Param("id"))
		if err != nil || cid != secret.Carrier || secret.Status == xomologisou.PublishableDeleted {
			return formError{"Δεν υπάρχει τέτοιο μυστικό."}
		}
		return statusProcess(tx, secret, c)
	})
	if err != nil {
		c.AbortWithStatusJSON(403, err)
	}
}

func StatusPatch(c *gin.Context) {
	err := db.RunInTransaction(func(tx *pg.Tx) error {
		cid := c.Param("carrier")
		secret, err := xomologisou.FindPublishable(tx, c.Param("id"))
		if err != nil || cid != secret.Carrier {
			return formError{"Δεν υπάρχει τέτοιο μυστικό."}
		}

		patch := &statusAction{}
		_ = c.ShouldBindJSON(patch)

		if patch.Action == "delete" &&
			(secret.Status == xomologisou.PublishableSent || secret.Status == xomologisou.PublishableDeclined) {
			secret.Status = xomologisou.PublishableDeleted
		}
		return statusProcess(tx, secret, c)
	})
	if err != nil {
		c.AbortWithStatusJSON(400, err)
	}
}

func statusProcess(tx orm.DB, secret *xomologisou.Publishable, c *gin.Context) error {
	secret.ChecksData = append(secret.ChecksData, ConstructSourceData(c))
	if err := xomologisou.SavePublishable(tx, secret); err != nil {
		return err
	}

	content := secret.OriginalContent
	publishUrl := ""
	status := 0
	deletable := false

	if secret.Status == xomologisou.PublishablePublished {
		status = 1
		publishUrl = "https://www.facebook.com/" + secret.FacebookPost
	}
	if secret.Status == xomologisou.PublishableDeleted {
		status = 2
	}
	if secret.Status == xomologisou.PublishableSent || secret.Status == xomologisou.PublishableDeclined {
		deletable = true
	}
	if content == "" {
		content = secret.Content
	}

	c.JSON(200, statusResponse{
		Id:         secret.Id,
		Content:    content,
		Image:      secret.ImageId,
		PublishUrl: publishUrl,
		Status:     &status,
		Deletable:  &deletable,
	})
	return nil
}
