import { server } from './server/Server'
import { Knex } from './server/database/knex'

const startServer = () => {
    server.listen(process.env.PORT || 3333, () => console.log(`Server running on port ${process.env.PORT || 3333}!`))
}

if (process.env.IS_LOCALHOST !== 'true') {
    console.log('Rodando migrations')

    Knex.migrate.latest().then(() => {
        Knex.seed.run().then(() => {
            startServer()
        }).catch(console.log)
    }).catch(console.log)
} else {
    startServer()
}
