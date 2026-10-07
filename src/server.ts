import express from "express";

interface serverOptions {
    port: number;
}

export class Server{
    private readonly port:number;
    private readonly server = express();
    constructor(options: serverOptions){
        this.port = options.port;
        this.server.use(express.json());
    }

    start(){
        this.server.listen(this.port, ()=>{
            console.log(`server running on port: ${this.port}`);
        });
    }
}