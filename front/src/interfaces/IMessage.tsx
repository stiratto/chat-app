export interface IMessage {
   host: "remote" | "host",
   message: string
}

export interface IChat {
   messages: IMessage[],
   id: string,
   remoteId: string
}
