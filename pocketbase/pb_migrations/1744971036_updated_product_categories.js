/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3283744169")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id != '' ",
    "listRule": "@request.auth.id != '' ",
    "updateRule": "@request.auth.id != '' ",
    "viewRule": "@request.auth.id != '' "
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3283744169")

  // update collection data
  unmarshal({
    "deleteRule": "id = @request.auth.id",
    "listRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id",
    "viewRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
