import http from "http"
import { parse } from "url"
import { WebSocket, WebSocketServer } from "ws"

let connectedUsers = new Map<string, WebSocket>()

const cors = (req: http.IncomingMessage, res: http.ServerResponse) => {
   if (req.headers.origin === "http://localhost:5173") {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
   }
}

const send = (res: http.ServerResponse, message: string, status: number) => {
   res.writeHead(status, {"Content-Type": "application/json"})
   res.end(JSON.stringify(message))
}

const router = (req: http.IncomingMessage, res: http.ServerResponse) => {
   const {pathname, query} = parse(req.url!, true)
   if (req.method === 'GET') {
      switch (pathname) {
         case "/getId":
            let id = crypto.randomUUID()
            let response = {
               id,
            }
            res.end(JSON.stringify(response))
            break

         case "/checkId":
            if (query.id !== 'null' && connectedUsers.has(query.id as string)) {
               send(res, "Found", 200)
            } else {
               send(res, "ID Not Found", 400)
            }
            break
         default:
            res.writeHead(404)
            res.end()

      }
   }
}

const server = http.createServer((req, res) => {
   cors(req, res)
   router(req, res)  
})

const wss = new WebSocketServer({server})

wss.on('connection', function connection(ws, req) {
   const {pathname, query} = parse(req.url!, true)

   if (pathname === '/') {
      const {id} = query
      if (id !== 'null') {
         connectedUsers.set(id as string, ws)
      }
   }

   ws.on('message', function message(data: string) {
      const parsedData = JSON.parse(data)
      const {to, message, userId} = parsedData
      console.log(`Message from ${userId} to ${to}: ${message}`)
      const receiverSocket = connectedUsers.get(to)
      if (receiverSocket) {
         receiverSocket?.send(message)
      } else {
         console.log("nop nop")
      }
   })
})


server.listen(4000)
