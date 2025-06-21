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
   res.writeHead(status, { "Content-Type": "application/json" })
   res.end(JSON.stringify(message))
}

const router = (req: http.IncomingMessage, res: http.ServerResponse) => {
   const { pathname, query } = parse(req.url!, true)
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
   } else if (req.method === "POST") {
      switch (pathname) {
         case '/initiateChat':
            try {
               let body = "";
               req.on("data", chunk => {
                  body += chunk.toString();
               });

               req.on("end", () => {
                  const { id, remoteId } = JSON.parse(body)
                  if (!id || !remoteId) {
                     return send(res, "Missing parameters", 400);
                  }

                  const remoteUserSocket = connectedUsers.get(remoteId)

                  if (remoteUserSocket) {
                     console.log(`User ${id} is initiating a chat with user ${remoteId}`)
                     remoteUserSocket.send(JSON.stringify({
                        type: "new_chat",
                        from: id
                     }))
                  }

                  send(res, "Chat initiated", 200)
               })
            } catch (err: any) {
               send(res, "Invalid JSON", 400)
            }


      }
   }
}

const server = http.createServer((req, res) => {
   cors(req, res)
   router(req, res)
})

const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws, req) {
   const { pathname, query } = parse(req.url!, true)

   if (pathname === '/connect') {
      console.log("user connected")
      const { userId: id } = query
      if (id !== 'null') {
         connectedUsers.set(id as string, ws)
      }

   } else if (pathname === "/disconnect") {
      const { id } = query
      if (id !== 'null') {
         connectedUsers.delete(id as string)
      }
   }


   ws.on('message', function message(data: string) {
      const parsedData = JSON.parse(data)
      const { to, message, userId } = parsedData

      console.log(`Message from ${userId} to ${to}: ${message}`)

      const receiverSocket = connectedUsers.get(to)

      if (receiverSocket) {
         console.log("asd")
         receiverSocket?.send(JSON.stringify({
            type: "new_message",
            from: userId,
            to,
            message,
         }))
      } else {
         console.log("nop nop")
      }
   })
})


server.listen(4000)
