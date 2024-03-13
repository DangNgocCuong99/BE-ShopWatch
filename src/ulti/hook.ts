import { IDataReturn, IErrorReturn } from "./types"

export const dataReturn  = (data:unknown,message?:string,statusCode?:number):IDataReturn=>{
    return {
        status:true,
        data:data,
        message:message,
        statusCode: statusCode || 200
    }
}

export const errorReturn  = (message?:string,statusCode?:number):IErrorReturn=>{
    return {
        status:false,
        message:message,
        statusCode: statusCode || 500
    }
}

export const getErrorMessage = (error: unknown) =>{
    if (error instanceof Error) return error.message
    return String(error)
  }