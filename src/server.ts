import express from "express";
import router from "./routes/index.ts";

interface serverOptions {
    port: number;
}

export class Server{
    private readonly port:number;
    private readonly server = express();
    constructor(options: serverOptions){
        this.port = options.port;
        this.server.use(express.json());
        this.server.use('/api',router);
    }

    start(){
        this.server.listen(this.port, ()=>{
            console.log(`server running on port: ${this.port}`);
        });
    }
}