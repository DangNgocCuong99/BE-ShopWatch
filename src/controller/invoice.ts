import CartModel from "../model/cart";
import InvoiceModel from "../model/invoice";
import ProductModel from "../model/product"; // Import ProductModel
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";
import { RequestHandler } from "express";
import { statusInvoice } from "../ulti/types";
import dayjs from "dayjs";
import ViewModel from "../model/viewProcduct";
import UserModel from "../model/user";

export const checkout: RequestHandler = async (req, res) => {
  try {
    const { statusPayment, statusInvoice, transportFee, userName, address, phone,discount,note,email } =
      req.body;
    // Lấy dữ liệu từ giỏ hàng của người dùng
    const cartItems = await CartModel.find({ userId: res.locals.user._id });
    if (cartItems.length === 0) {
      res.send(errorReturn("Không có sản phẩm nào trong giỏ hàng"));
      return;
    }

    // Kiểm tra xem số lượng sản phẩm có đủ không
    const insufficientQuantityItems = [];
    for (const item of cartItems) {
      const productDetails = await ProductModel.findById(item.productId);
      if (!productDetails || productDetails.quantity < item.quantity) {
        insufficientQuantityItems.push(item.productId);
      }
    }

    if (insufficientQuantityItems.length > 0) {
      res.send(
        errorReturn(
          `Sản phẩm ${insufficientQuantityItems.join(
            ", "
          )} không có đủ số lượng trong kho`
        )
      );
      return;
    }

    // Tính tổng số tiền cần thanh toán và lấy thông tin chi tiết của sản phẩm từ productId
    let totalAmount = 0;
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const productDetails = await ProductModel.findById(item.productId);
        if (!productDetails) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
        const itemTotal = productDetails.discountedPrice * item.quantity;
        totalAmount += itemTotal;
        return {
          productId: item.productId,
          quantity: item.quantity,
          productDetails: productDetails,
          itemTotal: itemTotal,
     
        };
      })
    );

    // Tạo danh sách các mục cho hóa đơn
    const invoiceItems = itemsWithDetails.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      productDetails: item.productDetails,
      itemTotal: item.itemTotal,
    }));

    // Tạo hóa đơn
    const newInvoice = await InvoiceModel.create({
      userId: res.locals.user._id,
      items: invoiceItems,
      totalAmount: totalAmount,
      statusPayment: statusPayment,
      statusInvoice: statusInvoice,
      transportFee: transportFee,
      userName: userName,
      discount:discount,
      note:note,
      address: address,
      phone: phone,
      email:email
    });

    // Xóa các mục trong giỏ hàng sau khi thanh toán thành công
    await CartModel.deleteMany({ userId: res.locals.user._id });

    res.send(dataReturn(newInvoice, "Thanh toán thành công"));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleGetDetailInvoice: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const invoice = await InvoiceModel.findById(id);
    res.send(dataReturn(invoice));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleUpdateInvoice: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const invoice = await InvoiceModel.findByIdAndUpdate(id,body);
    res.send(dataReturn(invoice));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleGetInvoice: RequestHandler = async (req, res) => {
  try {
    const activePage = +req.query.page;
    const limit = +req.query.pageSize;
    const skip = (activePage - 1) * limit;
    const record = await InvoiceModel.countDocuments();
    const data = await InvoiceModel
      .find()
      .skip(skip)
      .limit(limit);
      res.send(
        dataReturn({
          items: data,
          total: record,
        })
      );
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

const getDashboardInvoice = async (start: number, end: number) => {
  return await InvoiceModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        statusInvoice: { $ne: statusInvoice.cancelled },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $group: {
        _id: "$items.productId",
        totalQuantity: { $sum: "$items.quantity" },
        totalAmount: {
          $sum: {
            $multiply: [
              "$items.quantity",
              { $arrayElemAt: ["$productInfo.discountedPrice", 0] },
            ],
          },
        },
        productName: { $first: { $arrayElemAt: ["$productInfo.name", 0] } },
        discountedPrice: {
          $first: { $arrayElemAt: ["$productInfo.discountedPrice", 0] },
        },
      },
    },
    {
      $project: {
        _id: 1, // Loại bỏ trường _id
        totalQuantity: 1,
        totalAmount: 1,
        productName: 1,
        discountedPrice: 1,
      },
    },
  ]);
};

const getDashboardView = async (start: number, end: number) => {
  return await ViewModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end }, // Lọc theo thời gian tạo trong tháng
      },
    }, // Lọc các documents theo điều kiện
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 }, // Tính tổng số lượng của tất cả các documents
      },
    },
  ]);
};

const getNumberOfUsers = async (start: number, end: number) => {
  try {
    const count = await UserModel.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });
    return count;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const calculateGrowthPercentage = (current: number, previous: number) => {
  if (previous === 0) return 100; // Tránh chia cho 0
  return Math.round(((current - previous) / previous) * 100);
};

export const handleGetDashboardInvoice: RequestHandler = async (req, res) => {
  try {
    // Lấy thời điểm đầu tiên của tháng hiện tại
    const currentMonthStart = dayjs().startOf("month").valueOf();

    // Lấy thời điểm cuối cùng của tháng hiện tại
    const currentMonthEnd = dayjs().endOf("month").valueOf();

    // Lấy thời điểm đầu tiên của tháng truoc do
    const lastMonthStart = dayjs()
      .startOf("month")
      .subtract(1, "month")
      .valueOf();

    // Lấy thời điểm cuối cùng của tháng truoc do
    const lastMonthEnd = dayjs().startOf("month").subtract(1, "day").valueOf();

    const result = await getDashboardInvoice(
      currentMonthStart,
      currentMonthEnd
    );

    let totalAmount = 0;
    let quantityInvoice = 0;

    for (const element of result) {
      totalAmount += element.totalAmount;
      quantityInvoice += element.totalQuantity;
    }

    const view = await getDashboardView(currentMonthStart, currentMonthEnd);

    const totalView = view[0]?.totalCount | 0;

    const lastMonthResult = await getDashboardInvoice(
      lastMonthStart,
      lastMonthEnd
    );

    let lastMonthTotalAmount = 0;
    let lastMonthQuantityInvoice = 0;

    for (const element of lastMonthResult) {
      lastMonthTotalAmount += element.totalAmount;
      lastMonthQuantityInvoice += element.totalQuantity;
    }

    const lastMonthView = getDashboardView(lastMonthStart, lastMonthEnd);

    const lastMonthTotalView = lastMonthView[0]?.totalCount | 0;

    const currentMonthUsers = await getNumberOfUsers(
      currentMonthStart,
      currentMonthEnd
    );
    const lastMonthUsers = await getNumberOfUsers(lastMonthStart, lastMonthEnd);

    const growthPercentage = calculateGrowthPercentage(
      currentMonthUsers,
      lastMonthUsers
    );

    res.send(
      dataReturn({
        amount: {
          totalAmount,
          growth: calculateGrowthPercentage(totalAmount, lastMonthTotalAmount),
        },
        view: {
          totalView,
          growth: calculateGrowthPercentage(totalView, lastMonthTotalView),
        },
        invoice: {
          totalInvoice: quantityInvoice,
          growth: calculateGrowthPercentage(
            quantityInvoice,
            lastMonthQuantityInvoice
          ),
        },
        user: {
          newUser: currentMonthUsers - lastMonthUsers,
          growth: growthPercentage,
        },
      })
    );
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

const getCurrentYear = () => {
  return dayjs().year();
};

const getPreviousYear = () => {
  return dayjs().year() - 1;
};

const getStartOfYear = (year) => {
  return dayjs().year(year).startOf("year").valueOf();
};

const getEndOfYear = (year) => {
  return dayjs().year(year).endOf("year").valueOf();
};

const calculateTotalAmountForYear = async (year) => {
  const startDate = getStartOfYear(year);
  const endDate = getEndOfYear(year);

  const totalAmountResult = await InvoiceModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  if (totalAmountResult.length > 0) {
    return totalAmountResult[0].totalAmount;
  } else {
    return 0;
  }
};

const getMonthStartDate = (year, month) => {
  return dayjs()
    .year(year)
    .month(month - 1)
    .startOf("month")
    .valueOf();
};

const getMonthEndDate = (year, month) => {
  return dayjs()
    .year(year)
    .month(month - 1)
    .endOf("month")
    .valueOf();
};

// Tính tổng totalAmount của từng tháng trong năm
const calculateTotalAmountForMonths = async (year: number) => {
  try {
    const totalAmountByMonth = [];
    for (let month = 1; month <= 12; month++) {
      const startDate = getMonthStartDate(year, month);
      const endDate = getMonthEndDate(year, month);

      const query = {
        createdAt: { $gte: startDate, $lte: endDate }, // Lọc hóa đơn trong khoảng thời gian
      };

      const result = await InvoiceModel.aggregate([
        { $match: query }, // Lọc hóa đơn theo điều kiện
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" }, // Tính tổng totalAmount
          },
        },
      ]);

      const monthTotalAmount = result.length > 0 ? result[0].totalAmount : 0;
      totalAmountByMonth.push(monthTotalAmount);
    }

    return totalAmountByMonth;
  } catch (error) {
    console.error("Error calculating total amount for months:", error);
    throw error;
  }
};

const getTotalQuantitySoldForYear = async (year) => {
  try {
    const startDate = getStartOfYear(year);
    const endDate = getEndOfYear(year);

    const query = {
      createdAt: { $gte: startDate, $lte: endDate }, // Lọc hóa đơn trong khoảng thời gian
    };

    const result = await InvoiceModel.aggregate([
      { $match: query }, // Lọc hóa đơn theo điều kiện
      {
        $unwind: "$items", // Tách các mục thành các tài liệu riêng lẻ
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$items.quantity" }, // Tính tổng số lượng của từng mặt hàng
        },
      },
    ]);

    return result.length > 0 ? result[0].totalQuantity : 0;
  } catch (error) {
    console.error("Error calculating total quantity sold for year:", error);
    throw error;
  }
};

export const getDashboardChart: RequestHandler = async (req, res) => {
  try {
    const currentYear = getCurrentYear();
    const previousYear = getPreviousYear();

    const totalAmountCurrentYear = await calculateTotalAmountForYear(
      currentYear
    );
    const totalAmountPreviousYear = await calculateTotalAmountForYear(
      previousYear
    );

    const dataCurrent = await calculateTotalAmountForMonths(currentYear);
    const dataPrevious = await calculateTotalAmountForMonths(previousYear);

    const view = await getDashboardView(
      getStartOfYear(currentYear),
      getEndOfYear(currentYear)
    );

    const viewYear = view[0]?.totalCount ?? 0;

    const totalQuantity = await getTotalQuantitySoldForYear(currentYear);
    const totalUser = await getNumberOfUsers(
      getStartOfYear(currentYear),
      getEndOfYear(currentYear)
    );

    res.send(
      dataReturn({
        amount: {
          totalAmount: totalAmountCurrentYear,
          growth: calculateGrowthPercentage(
            totalAmountCurrentYear,
            totalAmountPreviousYear
          ),
        },
        chart: {
          dataCurrent,
          dataPrevious,
        },
        viewYear,
        totalQuantity,
        totalUser,
      })
    );
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleDeleteInvoice: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id
    const deleteItem = await InvoiceModel.findByIdAndDelete(id)
    res.send(dataReturn(deleteItem))
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
}