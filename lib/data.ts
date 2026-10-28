export type OrderStatus = "Processing" | "Packed" | "Dispatched" | "Delivered" | "Delayed";
export type OrderChannel = "Web" | "App" | "Marketplace";

export type Order = {
  id: string;
  customer: string;
  initials: string;
  email: string;
  itemCount: number;
  total: number;
  channel: OrderChannel;
  status: OrderStatus;
  placed: string;
  city: string;
  items: string[];
};

export type InventoryItem = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  warehouse: string;
  soldToday: number;
  price: number;
  color: string;
  initials: string;
};

export const revenueData = [
  { day: "Mon", revenue: 42000, orders: 98 },
  { day: "Tue", revenue: 51000, orders: 124 },
  { day: "Wed", revenue: 46500, orders: 111 },
  { day: "Thu", revenue: 63500, orders: 148 },
  { day: "Fri", revenue: 58900, orders: 139 },
  { day: "Sat", revenue: 78200, orders: 182 },
  { day: "Sun", revenue: 71300, orders: 167 },
];

export const ordersSeed: Order[] = [
  { id: "SLK-58241", customer: "Aarav Mehta", initials: "AM", email: "aarav.mehta@example.com", itemCount: 2, total: 2498, channel: "App", status: "Processing", placed: "10:42 AM", city: "Mumbai", items: ["Relaxed fit denim", "Classic white tee"] },
  { id: "SLK-58240", customer: "Ananya Shah", initials: "AS", email: "ananya.shah@example.com", itemCount: 1, total: 1899, channel: "Web", status: "Packed", placed: "10:34 AM", city: "Bengaluru", items: ["Everyday tote bag"] },
  { id: "SLK-58239", customer: "Rohan Kapoor", initials: "RK", email: "rohan.kapoor@example.com", itemCount: 3, total: 4297, channel: "App", status: "Dispatched", placed: "10:21 AM", city: "Delhi", items: ["Oversized shirt", "Straight fit chinos", "Ribbed tank"] },
  { id: "SLK-58238", customer: "Isha Banerjee", initials: "IB", email: "isha.banerjee@example.com", itemCount: 2, total: 3198, channel: "Marketplace", status: "Delivered", placed: "10:07 AM", city: "Kolkata", items: ["Minimal leather sneakers", "Crew socks set"] },
  { id: "SLK-58237", customer: "Kabir Nair", initials: "KN", email: "kabir.nair@example.com", itemCount: 1, total: 2599, channel: "Web", status: "Delayed", placed: "09:58 AM", city: "Pune", items: ["Utility jacket"] },
  { id: "SLK-58236", customer: "Diya Rao", initials: "DR", email: "diya.rao@example.com", itemCount: 2, total: 2198, channel: "App", status: "Packed", placed: "09:41 AM", city: "Hyderabad", items: ["Linen blend shirt", "Canvas belt"] },
  { id: "SLK-58235", customer: "Vihaan Joshi", initials: "VJ", email: "vihaan.joshi@example.com", itemCount: 1, total: 1499, channel: "Web", status: "Processing", placed: "09:30 AM", city: "Jaipur", items: ["Everyday polo"] },
  { id: "SLK-58234", customer: "Sara Dutta", initials: "SD", email: "sara.dutta@example.com", itemCount: 4, total: 5196, channel: "Marketplace", status: "Dispatched", placed: "09:15 AM", city: "Chennai", items: ["Pleated trousers", "Graphic tee", "Ribbed tank", "Crew socks set"] },
  { id: "SLK-58233", customer: "Arjun Sen", initials: "AS", email: "arjun.sen@example.com", itemCount: 2, total: 2898, channel: "App", status: "Delivered", placed: "09:02 AM", city: "Kolkata", items: ["Relaxed fit denim", "Classic white tee"] },
];

export const inventorySeed: InventoryItem[] = [
  { sku: "TS-014-BLK-M", name: "Essential oversized tee", category: "T-shirts", stock: 18, threshold: 24, warehouse: "Mumbai · WH-01", soldToday: 42, price: 899, color: "#d7d4e8", initials: "TS" },
  { sku: "DN-028-BLU-32", name: "Relaxed fit denim", category: "Denim", stock: 73, threshold: 30, warehouse: "Bengaluru · WH-03", soldToday: 31, price: 1899, color: "#c9dcea", initials: "DN" },
  { sku: "SH-102-CRM-L", name: "Linen blend shirt", category: "Shirts", stock: 9, threshold: 20, warehouse: "Delhi · WH-02", soldToday: 28, price: 1599, color: "#f1dfc2", initials: "SH" },
  { sku: "SN-007-WHT-9", name: "Minimal leather sneakers", category: "Footwear", stock: 0, threshold: 12, warehouse: "Mumbai · WH-01", soldToday: 24, price: 2599, color: "#dfdfdf", initials: "SN" },
  { sku: "TR-046-OLV-30", name: "Straight fit chinos", category: "Trousers", stock: 46, threshold: 18, warehouse: "Pune · WH-04", soldToday: 19, price: 1699, color: "#d6dfcc", initials: "TR" },
  { sku: "BG-021-TAN-OS", name: "Everyday tote bag", category: "Accessories", stock: 14, threshold: 16, warehouse: "Kolkata · WH-05", soldToday: 17, price: 1299, color: "#e9d2bd", initials: "BG" },
  { sku: "JK-065-GRY-XL", name: "Lightweight utility jacket", category: "Outerwear", stock: 61, threshold: 15, warehouse: "Bengaluru · WH-03", soldToday: 11, price: 3299, color: "#d3d7db", initials: "JK" },
];

export const channelData = [
  { name: "App", value: 54, color: "#6e63e8" },
  { name: "Web", value: 32, color: "#49b8a3" },
  { name: "Marketplace", value: 14, color: "#f3b45f" },
];

export const fulfillmentData = [
  { name: "Mon", onTime: 94, delayed: 6 },
  { name: "Tue", onTime: 96, delayed: 4 },
  { name: "Wed", onTime: 95, delayed: 5 },
  { name: "Thu", onTime: 97, delayed: 3 },
  { name: "Fri", onTime: 93, delayed: 7 },
  { name: "Sat", onTime: 98, delayed: 2 },
  { name: "Sun", onTime: 96, delayed: 4 },
];

export const activitySeed = [
  { title: "Batch #BT-208 packed", description: "24 orders are ready for dispatch", time: "4 min ago", kind: "package" },
  { title: "Low-stock alert triggered", description: "Essential oversized tee · Mumbai WH-01", time: "12 min ago", kind: "alert" },
  { title: "New carrier connected", description: "Delhivery integration is active", time: "28 min ago", kind: "truck" },
  { title: "Refund completed", description: "Order #SLK-58194 · ₹1,899", time: "42 min ago", kind: "check" },
];

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
