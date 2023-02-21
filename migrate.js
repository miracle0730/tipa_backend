const { setupSlonikMigrator } = require('@slonik/migrator')
const { createPool } = require('slonik')

// in an existing slonik project, this would usually be setup in another module
const slonik = createPool(process.env.DATABASE_URL)

const migrator = setupSlonikMigrator({
    migrationsPath: __dirname + '/src/infra/database/migrations',
    slonik,
    mainModule: module,
})

module.exports = { slonik, migrator }