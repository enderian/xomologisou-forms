package web

import (
	"github.com/ender-gr/xomologisou-common"
	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
	"log"
	"time"
)

var db *pg.DB

func InitializeDatabase(dial string) {
	options, err := pg.ParseURL(dial)
	if err != nil {
		log.Panicf("Unable to parse database url: %s\n", err.Error())
	}

	options.PoolSize = 40
	options.PoolTimeout = time.Second * 5

	db = pg.Connect(options)
	for _, model := range []interface{}{
		(*xomologisou.Carrier)(nil),
		(*xomologisou.CarrierHashtag)(nil),
		(*xomologisou.CarrierPlan)(nil),
		(*xomologisou.Publishable)(nil),
		(*xomologisou.ArchivedPublishable)(nil),
	} {
		err := db.CreateTable(model, &orm.CreateTableOptions{
			IfNotExists:   true,
			FKConstraints: true,
		})
		if err != nil {
			log.Panicf("Unable to connect to database: %s\n", err.Error())
		}
	}
}
