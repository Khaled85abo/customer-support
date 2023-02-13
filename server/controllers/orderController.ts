import { Request, Response } from "express";
import { CLIENTROLES } from "../constants/client";
import { ERRORS } from "../constants/errors";
import Order from "../models/order";
import createToken from "../utils/createToken";

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  public
const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) throw new Error(ERRORS.not_found);
  res.json(order);
};

// @desc    Get  user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ user: res.locals.user.id });
  res.json(orders);
};

// @desc    Allow user to start a refund with only order number
// @route   GET /api/orders/authenticate/:id
// @access  public
const authenticateByOrder = async (req: Request, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id });
  const token = createToken({
    email: null,
    name: null,
    role: CLIENTROLES.client,
    id: null,
  });
  if (!order) {
    throw new Error(ERRORS.not_found);
  }
  res.json({ order, token });
};

export { getOrderById, getMyOrders, authenticateByOrder };
