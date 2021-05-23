export default class Logger{
    prefix: string;

    constructor(prefix: string){
        this.prefix = prefix;
    }

    log(data: any){
        process.stdout.write(`[${this.prefix}] `)
        console.log(data)
    }

    error(data: any){
        process.stdout.write(`[ERROR][${this.prefix}] `)
        console.log(data)
    }

    debug(data: any){
        process.stdout.write(`[DEBUG][${this.prefix}] `)
        console.log(data)
    }
}