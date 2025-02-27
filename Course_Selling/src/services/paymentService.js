import stripePackage from "stripe";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (userId, courseId, amount, paymentMethod) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: "usd",
    payment_method_types: ["card"],
  });

  const payment = await Payment.create({
    user: userId,
    order: courseId,
    paymentMethod,
    transactionId: paymentIntent.id,
    status: "success",
  });

  await Order.create({ user: userId, course: courseId, amount, status: "completed" });

  return payment;
};
