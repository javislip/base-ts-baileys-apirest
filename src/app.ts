import 'dotenv/config'
import { createBot, MemoryDB, createProvider, addKeyword, createFlow } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
//import flow from './flows';

const PORT = process.env.PORT ?? 3001

const flowEmpty = addKeyword ('ABCDEFG').addAnswer('Mensaje Recibido')

const main = async () => {
    const provider = createProvider(BaileysProvider)

    const { handleCtx, httpServer } = await createBot({
        database: new MemoryDB(),
        provider,
        flow: createFlow([flowEmpty]),
    })

    httpServer(+PORT)

    provider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        try {
          const { number, message } = req.body
          await bot.sendMessage(number, message, {})
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ respuesta: "enviado" }))
        } catch (error) {
          console.error('Error sending message:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }

    }))
}

main()
