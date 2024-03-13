export type IDataReturn = {
    status:boolean,
    data:unknown,
    message?:string,
    statusCode:number
}

export type IErrorReturn = {
    status:boolean,
    message?:string,
    statusCode?:number
}

export enum accountStatusType {
    inactive="inactive" ,
    active="active" ,
  }
export enum roleAccountType {
    admin="admin",
    user="user"
}

export enum statusPayment {
    paid="paid",
    unpaid="unpaid",
    cash="cash"
}

export enum statusInvoice {
    cancelled="cancelled",
    completed="completed",
    processing="processing",
    todo="todo"
}