import { RequestHandler } from "express"
import trademarkModel from "../model/trademark"
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook"

export const getTrademark: RequestHandler = async (req, res)=>{
    try {
        const isFetchAll = req.query.isFetchAll
        if (isFetchAll){
            const data = await trademarkModel.find()
            res.send(dataReturn(data))
            return
        }
        const name = req.query.name || ""
        const activePage = +req.query.page
        const limit = +req.query.pageSize
        const skip = (activePage -1)*limit
        const record = await trademarkModel.countDocuments()
        const data = await trademarkModel.find({name:{$regex: name , $options :'i'}}).skip(skip).limit(limit)
        res.send(dataReturn({
            items:data, total:record
        }))
    } catch (error) {
        res.send(errorReturn(getErrorMessage(error)))
    }
}


export const detailTrademark : RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        const trademark = await trademarkModel.findOne({_id:id})
        res.send(dataReturn(trademark))
    } catch (error) {
        res.send(errorReturn(getErrorMessage(error)))
    }
}

export const createTrademark:RequestHandler =async (req,res) => {
    try {
        const data = req.body 
        const trademark = await trademarkModel.create(data)
        res.send(dataReturn(trademark))
    } catch (error) {
        res.send(errorReturn(getErrorMessage(error)))
    }
}

export const updateTrademark:RequestHandler =async (req,res) => {
    try {
        const data = req.body 
        const id  = req.params.id
        const trademark = await trademarkModel.findByIdAndUpdate(id,data)
        res.send(dataReturn(trademark))
    } catch (error) {
        res.send(errorReturn(getErrorMessage(error)))
    }
}

export const deleteTrademark :RequestHandler =async (req,res) => {
    try {
        const id = req.params.id
        const trademark = await trademarkModel.findByIdAndDelete(id)
        res.send(dataReturn(trademark))
    }catch (error) {
        res.send(errorReturn(getErrorMessage(error)))
    }
}