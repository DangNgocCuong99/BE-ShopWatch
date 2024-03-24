import { RequestHandler } from "express";
import productModel, { IProduct } from "../model/product";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";
import trademarkModel from "../model/trademark";
import ViewModel from "../model/viewProcduct";
import FavoriteModel from "../model/favorite";
import InvoiceModel from "../model/invoice";
import dayjs from "dayjs";
import { sortProduct } from "../ulti/types";
// import FavoriteModel from "../model/favorite"
async function updateBestSellingProducts(): Promise<void> {
  try {
    // Lấy tất cả các sản phẩm
    const products: IProduct[] = await productModel.find();

    // Tạo một map để lưu trữ số lượng sản phẩm đã bán
    const soldQuantitiesMap: Map<string, number> = new Map();

    // Lấy tất cả các hoá đơn và tính tổng số lượng sản phẩm bán ra
    const invoices = await InvoiceModel.find();
    for (const invoice of invoices) {
      for (const item of invoice.items) {
        const productId: string = item.productId.toString();
        const quantity: number = item.quantity;
        if (soldQuantitiesMap.has(productId)) {
          soldQuantitiesMap.set(productId, soldQuantitiesMap.get(productId) + quantity);
        } else {
          soldQuantitiesMap.set(productId, quantity);
        }
      }
    }

    // Sắp xếp các sản phẩm theo số lượng bán được
    const sortedProducts: IProduct[] = products.sort((a, b) => {
      const soldA: number = soldQuantitiesMap.get(a._id.toString()) || 0;
      const soldB: number = soldQuantitiesMap.get(b._id.toString()) || 0;
      return soldB - soldA;
    });

    // Cập nhật trường isBestSale cho top 10 sản phẩm
    const top10Products: IProduct[] = sortedProducts.slice(0, 10);
    for (const product of top10Products) {
      product.isBestSale = true;
      await product.save();
    }

    console.log('Đã cập nhật top 10 sản phẩm bán chạy nhất');
  } catch (error) {
    console.error('Lỗi khi cập nhật top 10 sản phẩm bán chạy nhất:', error);
    throw error;
  }
}

// Tính toán và cập nhật top 10 sản phẩm bán chạy nhất trong một tuần
async function updateHotProducts(): Promise<void> {
  try {
    // Tính ngày bắt đầu và kết thúc của tuần hiện tại
    const startDate = dayjs().startOf('week').valueOf();
    const endDate = dayjs().endOf('week').valueOf();

    // Lấy tất cả các sản phẩm
    const products: IProduct[] = await productModel.find();

    // Tạo một map để lưu trữ số lượng sản phẩm đã bán
    const soldQuantitiesMap: Map<string, number> = new Map();

    // Lấy tất cả các hoá đơn trong tuần và tính tổng số lượng sản phẩm bán ra
    const invoices = await InvoiceModel.find({ createdAt: { $gte: startDate, $lte: endDate } });
    for (const invoice of invoices) {
      for (const item of invoice.items) {
        const productId: string = item.productId.toString();
        const quantity: number = item.quantity;
        if (soldQuantitiesMap.has(productId)) {
          soldQuantitiesMap.set(productId, soldQuantitiesMap.get(productId) + quantity);
        } else {
          soldQuantitiesMap.set(productId, quantity);
        }
      }
    }

    // Sắp xếp các sản phẩm theo số lượng bán được
    const sortedProducts: IProduct[] = products.sort((a, b) => {
      const soldA: number = soldQuantitiesMap.get(a._id.toString()) || 0;
      const soldB: number = soldQuantitiesMap.get(b._id.toString()) || 0;
      return soldB - soldA;
    });

    // Cập nhật trường isHot cho top 10 sản phẩm
    const top10Products: IProduct[] = sortedProducts.slice(0, 10);
    for (const product of top10Products) {
      product.isHot = true;
      await product.save();
    }

    console.log('Đã cập nhật top 10 sản phẩm bán chạy nhất trong tuần');
  } catch (error) {
    console.error('Lỗi khi cập nhật top 10 sản phẩm bán chạy nhất trong tuần:', error);
    throw error;
  }
}

export const getMangageProduct: RequestHandler = async (req, res) => {
  try {
    const userId = res.locals.user._id
    const name = req.query.name || "";
    const activePage = +req.query.page;
    const limit = +req.query.pageSize;
    const skip = (activePage - 1) * limit;

    let sortQuery = {};
    if (req.query.sortBy) {
      switch(req.query.sortBy) {
        case sortProduct.nameUp:
          sortQuery = { name: -1 };
          break;
        case sortProduct.nameDown:
          sortQuery = { name: 1 };
          break;
        case sortProduct.priceUp:
          sortQuery = { discountedPrice: 1 };
          break;
        case sortProduct.priceDown:
          sortQuery = { discountedPrice: -1 };
          break;
        case sortProduct.createdAtUp:
          sortQuery = { createdAt: 1 };
          break;
        default:
          break;
      }
    }

    // const filterQuery = { 
    //   name: { $regex: name, $options: "i" },
    //   dayDeo: { $regex: dayDeo, $options: "i" }, // Thêm điều kiện filter theo chất liệu
    //   glass: { $regex: glass, $options: "i" } // Thêm điều kiện filter theo mặt kính
    // };


    await updateBestSellingProducts()
    await updateHotProducts()
    const record = await productModel.countDocuments({
      name: { $regex: name, $options: "i" },
    });
    const data : IProduct[]= await productModel
      .find({ name: { $regex: name, $options: "i" } })
      .sort(sortQuery) 
      .skip(skip)
      .limit(limit);


      const favorites = await FavoriteModel.find({ userId });
      const favoriteProductIds = new Set(favorites.map(favorite => favorite.productId.toString()));

    const idTrademark = data.map((i) => i.trademarkId);
    const listTrademark = await trademarkModel.find({
      _id: { $in: idTrademark },
    });

    const dataR = data.map((i) => {
      return {
        ...i.toObject(),
        trademark: listTrademark.find(
          (value) => value._id.toString() == i.trademarkId,
        ),
        favorite: favoriteProductIds.has(i._id.toString()),
        isNewProject: i.isNewProject        
      };
    });

    // const trademark = await trademarkModel.findById(data.trademarkId)
    res.send(
      dataReturn({
        items: dataR,
        total: record,
      })
    );
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const dataBody = req.body;
    const data = await productModel.create({
      ...dataBody,
      trademarkId: dataBody.trademark,
    });
    res.send(dataReturn(data, "them moi thanh cong"));
  } catch (error) {
    res.send(error);
  }
};

export const detailProductByManage: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const trademark = await trademarkModel.findOne({
      _id: product.trademarkId,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloneProduct: any = { ...product };
    const dataRe = { ...cloneProduct._doc, trademark };
    res.send(dataReturn(dataRe));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const detailProductByShop: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    // const view = await ViewModel.findOne({productId: product.id})
    // if (view){
    //   view.quantity = view.quantity + 1
    //   await view.save()
    // }else{
    await ViewModel.create({productId: product.id})
    // }
    // // Tăng số lượt xem lên 1
    // product.view = (product.view || 0) + 1;

    // // Lưu sản phẩm đã cập nhật với số lượt xem mới vào cơ sở dữ liệu
    // await product.save();
    const trademark = await trademarkModel.findOne({
      _id: product.trademarkId,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloneProduct: any = { ...product };
    const dataRe = { ...cloneProduct._doc, trademark };
    res.send(dataReturn(dataRe));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const dataBody = req.body;
    const data = await productModel.findByIdAndUpdate(id, {
      ...dataBody,
      trademarkId: dataBody.trademark,
    });
    res.send(dataReturn(data));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await productModel.findByIdAndDelete(id);
    res.send(dataReturn(data));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

