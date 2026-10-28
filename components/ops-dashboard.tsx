"use client";

import { useMemo, useState, type ElementType, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Clock3,
  CircleDollarSign,
  Download,
  ExternalLink,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  PackageCheck,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
  UserRound,
  Warehouse,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  activitySeed,
  channelData,
  fulfillmentData,
  formatINR,
  inventorySeed,
  ordersSeed,
  revenueData,
  type InventoryItem,
  type Order,
  type OrderStatus,
} from "@/lib/data";

type ViewName = "Overview" | "Orders" | "Inventory" | "Analytics" | "Settings";
type StatusFilter = "All statuses" | OrderStatus;

const navItems = [
  { label: "Overview" as const, icon: LayoutDashboard },
  { label: "Orders" as const, icon: ShoppingBag, count: "18" },
  { label: "Inventory" as const, icon: Package, count: "3" },
  { label: "Analytics" as const, icon: BarChart3 },
];

const statusOptions: StatusFilter[] = ["All statuses", "Processing", "Packed", "Dispatched", "Delivered", "Delayed"];
const nextStatus: Record<OrderStatus, OrderStatus> = {
  Processing: "Packed",
  Packed: "Dispatched",
  Dispatched: "Delivered",
  Delivered: "Delivered",
  Delayed: "Packed",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const icon = status === "Delivered" ? <CheckCircle2 size={13} /> : status === "Delayed" ? <CircleAlert size={13} /> : status === "Dispatched" ? <Truck size={13} /> : status === "Packed" ? <PackageCheck size={13} /> : <Clock3 size={13} />;
  return <span className={`status-badge status-${status.toLowerCase()}`}>{icon}{status}</span>;
}

function Avatar({ initials, tone = "lavender" }: { initials: string; tone?: string }) {
  return <span className={`avatar avatar-${tone}`}>{initials}</span>;
}

function SectionHeading({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="section-description">{description}</p>}
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  );
}

function MetricCard({ label, value, change, trend, icon: Icon, tone, footnote }: {
  label: string; value: string; change: string; trend: "up" | "down" | "neutral"; icon: ElementType; tone: string; footnote: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}`}><Icon size={18} strokeWidth={2.1} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom">
        <span className={`trend trend-${trend}`}>{trend === "down" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change}</span>
        <span className="metric-footnote">{footnote}</span>
      </div>
    </article>
  );
}

function OrderTable({ orders, onSelect, compact = false }: { orders: Order[]; onSelect: (order: Order) => void; compact?: boolean }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Channel</th>
            <th>Status</th>
            <th>{compact ? "Placed" : "City / placed"}</th>
            <th aria-label="Open order" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} onClick={() => onSelect(order)} className="clickable-row" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") onSelect(order); }}>
              <td><span className="order-id">{order.id}</span></td>
              <td>
                <div className="customer-cell"><Avatar initials={order.initials} /><div><span className="customer-name">{order.customer}</span><span className="customer-email">{order.email}</span></div></div>
              </td>
              <td>{order.itemCount} {order.itemCount === 1 ? "item" : "items"}</td>
              <td className="money-cell">{formatINR(order.total)}</td>
              <td><span className={`channel-tag channel-${order.channel.toLowerCase()}`}>{order.channel}</span></td>
              <td><StatusBadge status={order.status} /></td>
              <td><span className="placed-cell">{compact ? order.placed : <><strong>{order.city}</strong><span>{order.placed}</span></>}</span></td>
              <td><button className="icon-button row-open" aria-label={`Open ${order.id}`} onClick={(event) => { event.stopPropagation(); onSelect(order); }}><ChevronRight size={16} /></button></td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={8}><div className="empty-state"><Search size={20} /><strong>No matching orders</strong><span>Try a different search or status filter.</span></div></td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function FilterBar({ query, onQueryChange, status, onStatusChange, onExport, onCreate }: {
  query: string; onQueryChange: (value: string) => void; status: StatusFilter; onStatusChange: (value: StatusFilter) => void; onExport: () => void; onCreate?: () => void;
}) {
  return (
    <div className="table-toolbar">
      <label className="table-search"><Search size={16} /><input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search orders or customers" aria-label="Search orders or customers" /></label>
      <div className="toolbar-right">
        <label className="select-wrap"><Filter size={15} /><select value={status} onChange={(e) => onStatusChange(e.target.value as StatusFilter)} aria-label="Filter orders by status">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
        <button className="secondary-button" onClick={onExport}><Download size={15} /> Export</button>
        {onCreate && <button className="primary-button" onClick={onCreate}><Plus size={16} /> New order</button>}
      </div>
    </div>
  );
}

export default function OpsDashboard() {
  const [activeView, setActiveView] = useState<ViewName>("Overview");
  const [orders, setOrders] = useState<Order[]>(ordersSeed);
  const [inventory, setInventory] = useState<InventoryItem[]>(inventorySeed);
  const [globalSearch, setGlobalSearch] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All statuses");
  const [range, setRange] = useState("Last 7 days");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showAddSku, setShowAddSku] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderTotal, setOrderTotal] = useState("1899");
  const [skuName, setSkuName] = useState("");
  const [skuCategory, setSkuCategory] = useState("T-shirts");
  const [skuStock, setSkuStock] = useState("20");
  const [skuPrice, setSkuPrice] = useState("999");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [settings, setSettings] = useState({ emailAlerts: true, lowStockAlerts: true, weeklyReport: false, compactTables: false });

  const matchingOrders = useMemo(() => {
    const query = `${globalSearch} ${tableSearch}`.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All statuses" || order.status === statusFilter;
      const matchesQuery = !query || [order.id, order.customer, order.email, order.city, order.channel, ...order.items].some((field) => field.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [orders, globalSearch, tableSearch, statusFilter]);

  const matchingInventory = useMemo(() => inventory.filter((item) => {
    const query = globalSearch.toLowerCase();
    const matchesQuery = !query || [item.name, item.sku, item.category, item.warehouse].some((field) => field.toLowerCase().includes(query));
    return matchesQuery && (!lowStockOnly || item.stock <= item.threshold);
  }), [inventory, globalSearch, lowStockOnly]);

  const lowStockCount = inventory.filter((item) => item.stock <= item.threshold).length;
  const processingCount = orders.filter((order) => order.status === "Processing" || order.status === "Packed").length;

  function exportOrders() {
    const headers = ["Order ID", "Customer", "Email", "Items", "Total INR", "Channel", "Status", "City", "Placed"];
    const rows = matchingOrders.map((order) => [order.id, order.customer, order.email, order.itemCount, order.total, order.channel, order.status, order.city, order.placed]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orbitops-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportInventory() {
    const headers = ["SKU", "Product", "Category", "Stock", "Reorder Point", "Warehouse", "Sold Today", "Price INR"];
    const rows = matchingInventory.map((item) => [item.sku, item.name, item.category, item.stock, item.threshold, item.warehouse, item.soldToday, item.price]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orbitops-inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = customerName.trim();
    if (!trimmedName) return;
    const pieces = trimmedName.split(/\s+/);
    const initials = pieces.length > 1 ? `${pieces[0][0]}${pieces[pieces.length - 1][0]}`.toUpperCase() : trimmedName.slice(0, 2).toUpperCase();
    const order: Order = {
      id: `SLK-${58241 + orders.length + 1}`,
      customer: trimmedName,
      initials,
      email: `${trimmedName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      itemCount: 1,
      total: Math.max(1, Number(orderTotal) || 1),
      channel: "App",
      status: "Processing",
      placed: "Just now",
      city: "Mumbai",
      items: ["New sample product"],
    };
    setOrders((current) => [order, ...current]);
    setSelectedOrder(order);
    setShowCreateOrder(false);
    setCustomerName("");
  }

  function addSku(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = skuName.trim();
    if (!name) return;
    const newItem: InventoryItem = {
      sku: `SKU-${String(inventory.length + 1).padStart(3, "0")}`,
      name,
      category: skuCategory,
      stock: Math.max(0, Number(skuStock) || 0),
      threshold: 20,
      warehouse: "Mumbai · WH-01",
      soldToday: 0,
      price: Math.max(0, Number(skuPrice) || 0),
      color: "#dcd8f8",
      initials: name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase(),
    };
    setInventory((current) => [newItem, ...current]);
    setShowAddSku(false);
    setSkuName("");
  }

  function advanceOrderStatus(order: Order) {
    const updatedStatus = nextStatus[order.status];
    const updatedOrder = { ...order, status: updatedStatus };
    setOrders((current) => current.map((item) => item.id === order.id ? updatedOrder : item));
    setSelectedOrder(updatedOrder);
  }

  function navigate(view: ViewName) {
    setActiveView(view);
    setMobileNavOpen(false);
    setGlobalSearch("");
    setTableSearch("");
    setStatusFilter("All statuses");
  }

  const viewTitles: Record<ViewName, { title: string; description: string }> = {
    Overview: { title: "Good morning, Alex", description: "Here’s what’s happening with your store today." },
    Orders: { title: "Orders", description: "Track orders, update fulfilment, and keep every delivery moving." },
    Inventory: { title: "Inventory", description: "Monitor stock levels across your fulfilment network." },
    Analytics: { title: "Analytics", description: "Understand sales, fulfilment performance, and channel mix." },
    Settings: { title: "Workspace settings", description: "Manage dashboard preferences and operational notifications." },
  };

  return (
    <div className="app-shell">
      {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row"><span className="brand-mark"><Activity size={19} strokeWidth={2.7} /></span><span className="brand-name">orbit<span>ops</span></span><span className="brand-badge">BETA</span><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Close sidebar"><X size={18} /></button></div>
        <div className="workspace-switcher"><span className="workspace-logo">M</span><span className="workspace-copy"><strong>Mode Commerce</strong><small>Operations workspace</small></span><ChevronDown size={15} /></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-item ${activeView === label ? "nav-active" : ""}`} onClick={() => navigate(label)}><Icon size={18} strokeWidth={1.9} /><span>{label}</span>{count && <span className={`nav-count ${label === "Inventory" ? "nav-count-alert" : ""}`}>{label === "Orders" ? orders.length : label === "Inventory" ? lowStockCount : count}</span>}</button>)}
        </nav>
        <div className="nav-label nav-label-spaced">PREFERENCES</div>
        <nav className="main-nav" aria-label="Preferences"><button className={`nav-item ${activeView === "Settings" ? "nav-active" : ""}`} onClick={() => navigate("Settings")}><Settings size={18} strokeWidth={1.9} /><span>Settings</span></button><button className="nav-item" onClick={() => setShowNotifications((value) => !value)}><Bell size={18} strokeWidth={1.9} /><span>Notifications</span><span className="notification-dot" /></button></nav>
        <div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><CircleHelp size={18} /></span><strong>Need a hand?</strong><span>Visit our help center for tips and guides.</span><button onClick={() => window.alert("Help center demo: connect this action to your support site.")}>Visit help center <ExternalLink size={12} /></button></div><button className="profile-row" onClick={() => navigate("Settings")}><Avatar initials="AK" tone="mint" /><span className="profile-copy"><strong>Alex Kumar</strong><small>Store administrator</small></span><MoreHorizontal size={18} /></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeView}</strong></div></div>
          <div className="topbar-right"><label className="global-search"><Search size={16} /><input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search anything..." aria-label="Search dashboard" /><kbd>⌘ K</kbd></label><button className={`topbar-icon icon-button ${showNotifications ? "icon-selected" : ""}`} onClick={() => setShowNotifications((value) => !value)} aria-label="Show notifications"><Bell size={18} /><span className="bell-dot" /></button><span className="topbar-divider" /><button className="topbar-user" onClick={() => navigate("Settings")}><Avatar initials="AK" tone="mint" /><ChevronDown size={14} /></button></div>
        </header>

        {showNotifications && <div className="notification-popover"><div className="popover-head"><strong>Notifications</strong><span className="unread-count">3 new</span></div><div className="notification-item"><span className="notice-dot purple" /><div><strong>New orders waiting</strong><p>18 orders need fulfilment attention.</p><small>5 minutes ago</small></div></div><div className="notification-item"><span className="notice-dot amber" /><div><strong>Stock is running low</strong><p>3 products are below their reorder point.</p><small>12 minutes ago</small></div></div><div className="notification-item"><span className="notice-dot green" /><div><strong>Daily report is ready</strong><p>Your sales summary has been prepared.</p><small>1 hour ago</small></div></div><button className="popover-footer" onClick={() => setShowNotifications(false)}>Mark all as read <Check size={14} /></button></div>}

        <div className="page-content">
          <SectionHeading eyebrow={activeView === "Overview" ? "WEDNESDAY, YOUR STORE AT A GLANCE" : "COMMERCE OPERATIONS"} title={viewTitles[activeView].title} description={viewTitles[activeView].description} actions={
            <><label className="range-select"><CalendarDays size={16} /><select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Select reporting range"><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option></select><ChevronDown size={14} /></label>{activeView !== "Settings" && <button className="primary-button" onClick={() => activeView === "Inventory" ? setShowAddSku(true) : activeView === "Orders" ? setShowCreateOrder(true) : exportOrders()}>{activeView === "Inventory" ? <><Plus size={16} /> Add SKU</> : activeView === "Orders" ? <><Plus size={16} /> New order</> : <><Download size={15} /> Export report</>}</button>}</>
          } />

          {activeView === "Overview" && <>
            <div className="metric-grid">
              <MetricCard label="Gross sales" value="₹8,42,650" change="12.8%" trend="up" icon={CircleDollarSign} tone="purple-tone" footnote="vs. previous period" />
              <MetricCard label="Total orders" value="1,284" change="8.2%" trend="up" icon={ShoppingBag} tone="blue-tone" footnote="vs. previous period" />
              <MetricCard label="Fulfilment rate" value="96.4%" change="2.1%" trend="up" icon={PackageCheck} tone="green-tone" footnote="on-time dispatches" />
              <MetricCard label="Avg. dispatch time" value="18 min" change="3 min" trend="down" icon={Clock3} tone="amber-tone" footnote="faster than last week" />
            </div>

            <div className="overview-grid">
              <section className="panel revenue-panel">
                <div className="panel-header"><div><div className="panel-title-row"><h2>Sales overview</h2><span className="live-pill"><span /> Live</span></div><p>Revenue performance over time</p></div><button className="subtle-select" onClick={() => setRange(range === "Last 7 days" ? "Last 30 days" : "Last 7 days")}>{range}<ChevronDown size={14} /></button></div>
                <div className="chart-summary"><strong>₹4,61,400</strong><span className="trend trend-up"><ArrowUpRight size={14} /> 12.8%</span><small>compared to previous period</small></div>
                <div className="revenue-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7669ef" stopOpacity={0.22} /><stop offset="95%" stopColor="#7669ef" stopOpacity={0.015} /></linearGradient></defs><CartesianGrid stroke="#eef0f5" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b91a2", fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b91a2", fontSize: 10 }} tickFormatter={(value: number) => value >= 1000 ? `${value / 1000}k` : value} /><Tooltip formatter={(value) => [formatINR(Number(value)), "Revenue"]} contentStyle={{ border: "1px solid #eef0f6", borderRadius: 12, boxShadow: "0 10px 28px rgba(32, 36, 70, .08)", fontSize: 12 }} /><Area type="monotone" dataKey="revenue" stroke="#7669ef" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff" }} /></AreaChart></ResponsiveContainer></div>
                <div className="chart-legend"><span><i className="legend-dot legend-purple" />Revenue</span><span className="muted-legend">Daily totals · INR</span></div>
              </section>

              <section className="panel inventory-health-panel">
                <div className="panel-header"><div><h2>Inventory health</h2><p>Stock availability across warehouses</p></div><button className="icon-button panel-more" aria-label="More inventory options" onClick={() => navigate("Inventory")}><MoreHorizontal size={18} /></button></div>
                <div className="donut-wrap"><div className="donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: "Healthy", value: 72, color: "#45b9a0" }, { name: "Low stock", value: 20, color: "#f0b45d" }, { name: "Out of stock", value: 8, color: "#f07885" }]} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="92%" paddingAngle={4} stroke="none" startAngle={90} endAngle={-270}>{[{ name: "Healthy", value: 72, color: "#45b9a0" }, { name: "Low stock", value: 20, color: "#f0b45d" }, { name: "Out of stock", value: 8, color: "#f07885" }].map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, "Inventory"]} contentStyle={{ border: "1px solid #eef0f6", borderRadius: 10, fontSize: 12 }} /></PieChart></ResponsiveContainer></div><div className="donut-center"><strong>86%</strong><span>in stock</span></div></div>
                <div className="inventory-legend"><div><span><i className="legend-dot legend-green" />Healthy</span><strong>72%</strong></div><div><span><i className="legend-dot legend-amber" />Low stock</span><strong>20%</strong></div><div><span><i className="legend-dot legend-rose" />Out of stock</span><strong>8%</strong></div></div>
                <button className="text-link" onClick={() => navigate("Inventory")}>View inventory details <ChevronRight size={14} /></button>
              </section>
            </div>

            <section className="panel orders-panel">
              <div className="panel-header"><div><h2>Recent orders</h2><p>Keep track of your latest customer orders</p></div><button className="text-link panel-view-all" onClick={() => navigate("Orders")}>View all orders <ChevronRight size={15} /></button></div>
              <FilterBar query={tableSearch} onQueryChange={setTableSearch} status={statusFilter} onStatusChange={setStatusFilter} onExport={exportOrders} />
              <OrderTable orders={matchingOrders.slice(0, 5)} onSelect={setSelectedOrder} compact />
              <div className="table-footer"><span>Showing <strong>{Math.min(5, matchingOrders.length)}</strong> of <strong>{matchingOrders.length}</strong> matching orders</span><button className="secondary-button small-button" onClick={() => navigate("Orders")}>Open order manager <ChevronRight size={14} /></button></div>
            </section>

            <div className="bottom-grid">
              <section className="panel products-panel"><div className="panel-header"><div><h2>Top moving products</h2><p>Most units sold today</p></div><button className="text-link" onClick={() => navigate("Inventory")}>View inventory <ChevronRight size={14} /></button></div><div className="top-product-list">{inventory.slice().sort((a, b) => b.soldToday - a.soldToday).slice(0, 4).map((item, index) => <div className="top-product-row" key={item.sku}><span className={`product-thumb thumb-${index + 1}`}>{item.initials}</span><span className="top-product-copy"><strong>{item.name}</strong><small>{item.category} · {item.sku}</small></span><span className="product-units"><strong>{item.soldToday}</strong><small>units</small></span><span className="product-change"><ArrowUpRight size={13} />{[18, 12, 9, 7][index]}%</span></div>)}</div></section>
              <section className="panel activity-panel"><div className="panel-header"><div><h2>Recent activity</h2><p>Latest updates from your workspace</p></div><span className="activity-live"><span /> Live</span></div><div className="activity-list">{activitySeed.map((activity, index) => <div className="activity-item" key={activity.title}><span className={`activity-icon activity-${activity.kind}`}>{activity.kind === "package" ? <PackageCheck size={16} /> : activity.kind === "alert" ? <CircleAlert size={16} /> : activity.kind === "truck" ? <Truck size={16} /> : <CheckCircle2 size={16} />}</span><div className="activity-copy"><strong>{activity.title}</strong><span>{activity.description}</span><small>{activity.time}</small></div>{index === 0 && <span className="activity-new">NEW</span>}</div>)}</div></section>
            </div>
          </>}

          {activeView === "Orders" && <section className="panel full-table-panel"><div className="orders-summary-strip"><div><span className="summary-dot purple" /><span><strong>{orders.length}</strong> total orders</span></div><div><span className="summary-dot amber" /><span><strong>{processingCount}</strong> to fulfil</span></div><div><span className="summary-dot rose" /><span><strong>{orders.filter((item) => item.status === "Delayed").length}</strong> delayed</span></div><div><span className="summary-dot green" /><span><strong>{orders.filter((item) => item.status === "Delivered").length}</strong> delivered</span></div></div><FilterBar query={tableSearch} onQueryChange={setTableSearch} status={statusFilter} onStatusChange={setStatusFilter} onExport={exportOrders} onCreate={() => setShowCreateOrder(true)} /><OrderTable orders={matchingOrders} onSelect={setSelectedOrder} /><div className="table-footer"><span>Showing <strong>{matchingOrders.length}</strong> matching orders</span><span className="table-footer-note">Select any row to view or update the order.</span></div></section>}

          {activeView === "Inventory" && <>
            <div className="metric-grid inventory-metrics"><MetricCard label="Active SKUs" value={String(inventory.length).padStart(2, "0")} change="6.4%" trend="up" icon={Package} tone="purple-tone" footnote="vs. previous period" /><MetricCard label="Healthy stock" value={`${Math.round((inventory.filter((i) => i.stock > i.threshold).length / Math.max(inventory.length, 1)) * 100)}%`} change="4.1%" trend="up" icon={CheckCircle2} tone="green-tone" footnote="above reorder point" /><MetricCard label="Low / out of stock" value={String(lowStockCount).padStart(2, "0")} change="2 SKUs" trend="down" icon={CircleAlert} tone="amber-tone" footnote="needs attention" /><MetricCard label="Stock value" value={formatINR(inventory.reduce((total, item) => total + item.stock * item.price, 0))} change="7.8%" trend="up" icon={Warehouse} tone="blue-tone" footnote="current listed value" /></div>
            <section className="panel inventory-table-panel"><div className="panel-header"><div><h2>Product inventory</h2><p>Stock by product and fulfilment location</p></div><label className="checkbox-filter"><input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />Low stock only</label></div><div className="table-toolbar"><label className="table-search"><Search size={16} /><input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search products, SKU, warehouse" aria-label="Search inventory" /></label><button className="secondary-button" onClick={() => setLowStockOnly((value) => !value)}><SlidersHorizontal size={15} />{lowStockOnly ? "Show all stock" : "Filter stock"}</button><button className="secondary-button" onClick={exportInventory}><Download size={15} /> Export inventory</button></div><div className="table-scroll"><table className="data-table inventory-table"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>In stock</th><th>Stock health</th><th>Warehouse</th><th>Sold today</th><th>Price</th></tr></thead><tbody>{matchingInventory.map((item, index) => { const low = item.stock <= item.threshold; const empty = item.stock === 0; return <tr key={item.sku}><td><div className="inventory-product-cell"><span className={`inventory-thumb inventory-thumb-${index % 5}`} style={{ backgroundColor: item.color }}>{item.initials}</span><div><strong>{item.name}</strong><small>{item.sku}</small></div></div></td><td><span className="sku-code">{item.sku}</span></td><td>{item.category}</td><td><strong className={empty ? "stock-zero" : ""}>{item.stock}</strong><span className="stock-unit"> units</span></td><td><span className={`stock-badge ${empty ? "stock-empty" : low ? "stock-low" : "stock-healthy"}`}><span />{empty ? "Out of stock" : low ? "Low stock" : "Healthy"}</span><div className="stock-progress"><span className={empty ? "progress-empty" : low ? "progress-low" : "progress-healthy"} style={{ width: `${Math.min(100, (item.stock / Math.max(item.threshold * 2, 1)) * 100)}%` }} /></div></td><td>{item.warehouse}</td><td>{item.soldToday}</td><td className="money-cell">{formatINR(item.price)}</td></tr>; })}{matchingInventory.length === 0 && <tr><td colSpan={8}><div className="empty-state"><Search size={20} /><strong>No matching products</strong><span>Try a different search or disable the low-stock filter.</span></div></td></tr>}</tbody></table></div><div className="table-footer"><span>Showing <strong>{matchingInventory.length}</strong> of <strong>{inventory.length}</strong> SKUs</span><span className="table-footer-note">Reorder points are sample data for this prototype.</span></div></section>
          </>}

          {activeView === "Analytics" && <>
            <div className="metric-grid"><MetricCard label="Gross sales" value="₹8,42,650" change="12.8%" trend="up" icon={CircleDollarSign} tone="purple-tone" footnote="vs. previous period" /><MetricCard label="Average order value" value="₹1,946" change="4.6%" trend="up" icon={ShoppingBag} tone="blue-tone" footnote="per completed order" /><MetricCard label="On-time fulfilment" value="96.4%" change="2.1%" trend="up" icon={Truck} tone="green-tone" footnote="dispatch SLA met" /><MetricCard label="Cancellation rate" value="1.8%" change="0.4%" trend="down" icon={CircleAlert} tone="amber-tone" footnote="lower is better" /></div>
            <div className="overview-grid analytics-grid"><section className="panel revenue-panel"><div className="panel-header"><div><h2>Revenue trend</h2><p>Daily sales across all channels</p></div><span className="channel-tag channel-web">INR</span></div><div className="revenue-chart analytics-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={revenueData} margin={{ top: 8, right: 10, left: -15, bottom: 0 }}><CartesianGrid stroke="#eef0f5" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b91a2", fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b91a2", fontSize: 10 }} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} /><Tooltip formatter={(value) => [formatINR(Number(value)), "Revenue"]} contentStyle={{ border: "1px solid #eef0f6", borderRadius: 12, fontSize: 12 }} /><Line type="monotone" dataKey="revenue" stroke="#7669ef" strokeWidth={2.8} dot={{ r: 3, fill: "#7669ef", stroke: "white", strokeWidth: 2 }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-dot legend-purple" />Revenue</span><span className="muted-legend">Daily totals · INR</span></div></section><section className="panel channel-panel"><div className="panel-header"><div><h2>Orders by channel</h2><p>Share of orders by sales source</p></div></div><div className="channel-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={channelData} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}><CartesianGrid stroke="#eef0f5" horizontal={false} /><XAxis type="number" domain={[0, 60]} axisLine={false} tickLine={false} tick={{ fill: "#8b91a2", fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#667085", fontSize: 12 }} width={90} /><Tooltip formatter={(value) => [`${value}%`, "Share"]} contentStyle={{ border: "1px solid #eef0f6", borderRadius: 10, fontSize: 12 }} /><Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={21}>{channelData.map((channel) => <Cell key={channel.name} fill={channel.color} />)}</Bar></BarChart></ResponsiveContainer></div><div className="channel-breakdown">{channelData.map((channel) => <div key={channel.name}><span><i className="legend-dot" style={{ background: channel.color }} />{channel.name}</span><strong>{channel.value}%</strong></div>)}</div></section></div>
            <section className="panel fulfilment-panel"><div className="panel-header"><div><h2>On-time dispatch trend</h2><p>Percentage of orders dispatched within SLA</p></div><span className="trend trend-up"><ArrowUpRight size={14} /> +2.1% this week</span></div><div className="fulfillment-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={fulfillmentData} margin={{ top: 8, right: 10, left: -15, bottom: 0 }}><defs><linearGradient id="fulfillmentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#42b99d" stopOpacity={0.23} /><stop offset="100%" stopColor="#42b99d" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#eef0f5" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8b91a2", fontSize: 11 }} dy={9} /><YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={{ fill: "#8b91a2", fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} /><Tooltip formatter={(value) => [`${value}%`, "On-time dispatch"]} contentStyle={{ border: "1px solid #eef0f6", borderRadius: 10, fontSize: 12 }} /><Area type="monotone" dataKey="onTime" stroke="#42b99d" strokeWidth={2.4} fill="url(#fulfillmentFill)" /></AreaChart></ResponsiveContainer></div></section>
          </>}

          {activeView === "Settings" && <div className="settings-layout"><section className="panel settings-panel"><div className="settings-heading"><span className="settings-avatar"><UserRound size={22} /></span><div><h2>Profile & workspace</h2><p>Personalise your operations workspace.</p></div></div><div className="settings-field-grid"><label>Display name<input defaultValue="Alex Kumar" /></label><label>Workspace name<input defaultValue="Mode Commerce" /></label><label>Work email<input defaultValue="alex.kumar@example.com" /></label><label>Default warehouse<select defaultValue="Mumbai · WH-01"><option>Mumbai · WH-01</option><option>Bengaluru · WH-03</option><option>Delhi · WH-02</option><option>Kolkata · WH-05</option></select></label></div><button className="primary-button settings-save" onClick={() => window.alert("Settings saved for this demo session.")}><Check size={15} /> Save changes</button></section><section className="panel settings-panel"><div className="settings-heading"><span className="settings-avatar settings-avatar-green"><Bell size={22} /></span><div><h2>Notifications</h2><p>Choose which operational updates you want to receive.</p></div></div><div className="setting-toggle-row"><div><strong>Email order alerts</strong><span>Receive a summary when new orders arrive.</span></div><button className={`toggle ${settings.emailAlerts ? "toggle-on" : ""}`} onClick={() => setSettings((s) => ({ ...s, emailAlerts: !s.emailAlerts }))} aria-label="Toggle email order alerts"><span /></button></div><div className="setting-toggle-row"><div><strong>Low-stock alerts</strong><span>Get notified when products reach their reorder point.</span></div><button className={`toggle ${settings.lowStockAlerts ? "toggle-on" : ""}`} onClick={() => setSettings((s) => ({ ...s, lowStockAlerts: !s.lowStockAlerts }))} aria-label="Toggle low stock alerts"><span /></button></div><div className="setting-toggle-row"><div><strong>Weekly performance report</strong><span>Send a weekly sales and fulfilment snapshot.</span></div><button className={`toggle ${settings.weeklyReport ? "toggle-on" : ""}`} onClick={() => setSettings((s) => ({ ...s, weeklyReport: !s.weeklyReport }))} aria-label="Toggle weekly report"><span /></button></div><div className="setting-toggle-row"><div><strong>Compact tables</strong><span>Reduce row spacing to show more results at once.</span></div><button className={`toggle ${settings.compactTables ? "toggle-on" : ""}`} onClick={() => setSettings((s) => ({ ...s, compactTables: !s.compactTables }))} aria-label="Toggle compact tables"><span /></button></div></section><section className="panel danger-panel"><div><h2>Session tools</h2><p>Prototype controls for workspace management.</p></div><button className="secondary-button" onClick={() => { setGlobalSearch(""); setRange("Last 7 days"); setSettings({ emailAlerts: true, lowStockAlerts: true, weeklyReport: false, compactTables: false }); }}><LogOut size={15} /> Reset preferences</button></section></div>}

          <footer className="app-footer"><span>© 2026 OrbitOps <i /> Built for modern commerce teams</span><span><span className="footer-status"><span /> All systems operational</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top <ArrowUpRight size={12} /></a></span></footer>
        </div>
      </main>

      {selectedOrder && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}><section className="order-drawer" role="dialog" aria-modal="true" aria-labelledby="order-drawer-title"><div className="drawer-header"><div><p className="eyebrow">ORDER DETAILS</p><h2 id="order-drawer-title">{selectedOrder.id}</h2></div><button className="icon-button" onClick={() => setSelectedOrder(null)} aria-label="Close order details"><X size={19} /></button></div><div className="drawer-status-row"><StatusBadge status={selectedOrder.status} /><span className="placed-cell">Placed {selectedOrder.placed}</span></div><div className="drawer-customer"><Avatar initials={selectedOrder.initials} tone="lavender" /><div><strong>{selectedOrder.customer}</strong><span>{selectedOrder.email}</span><small>{selectedOrder.city} · {selectedOrder.channel} order</small></div></div><div className="drawer-section"><h3>Items in this order</h3>{selectedOrder.items.map((item, i) => <div className="drawer-item" key={`${item}-${i}`}><span className="drawer-item-thumb">{item.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}</span><span>{item}<small>Qty 1</small></span><strong>{i === 0 ? formatINR(selectedOrder.total - Math.max(0, selectedOrder.items.length - 1) * 399) : formatINR(399)}</strong></div>)}</div><div className="drawer-total"><span>Order total</span><strong>{formatINR(selectedOrder.total)}</strong></div><div className="drawer-timeline"><h3>Fulfilment timeline</h3><div className="timeline-step done"><span><Check size={12} /></span><div><strong>Order received</strong><small>Payment confirmed</small></div><time>{selectedOrder.placed}</time></div><div className={`timeline-step ${["Packed", "Dispatched", "Delivered"].includes(selectedOrder.status) ? "done" : "current"}`}><span>{["Packed", "Dispatched", "Delivered"].includes(selectedOrder.status) ? <Check size={12} /> : <Package size={12} />}</span><div><strong>Pack order</strong><small>Pick and pack items</small></div></div><div className={`timeline-step ${["Dispatched", "Delivered"].includes(selectedOrder.status) ? "done" : ""}`}><span>{["Dispatched", "Delivered"].includes(selectedOrder.status) ? <Check size={12} /> : <Truck size={12} />}</span><div><strong>Dispatch</strong><small>Hand over to carrier</small></div></div><div className={`timeline-step ${selectedOrder.status === "Delivered" ? "done" : ""}`}><span>{selectedOrder.status === "Delivered" ? <Check size={12} /> : <CheckCircle2 size={12} />}</span><div><strong>Delivered</strong><small>Complete customer order</small></div></div></div><div className="drawer-actions"><button className="secondary-button" onClick={() => setSelectedOrder(null)}>Close</button>{selectedOrder.status !== "Delivered" && <button className="primary-button" onClick={() => advanceOrderStatus(selectedOrder)}>{selectedOrder.status === "Delayed" ? "Restart fulfilment" : `Mark as ${nextStatus[selectedOrder.status].toLowerCase()}`} <ChevronRight size={15} /></button>}</div></section></div>}

      {showCreateOrder && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreateOrder(false); }}><section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="create-order-title"><div className="drawer-header"><div><p className="eyebrow">QUICK ACTION</p><h2 id="create-order-title">Create sample order</h2></div><button className="icon-button" onClick={() => setShowCreateOrder(false)} aria-label="Close create order form"><X size={19} /></button></div><p className="form-intro">Add a local demo order to test order states and the table interactions.</p><form onSubmit={createOrder} className="modal-form"><label>Customer name<input required autoFocus value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Priya Sharma" /></label><label>Order total (₹)<input required type="number" min="1" value={orderTotal} onChange={(e) => setOrderTotal(e.target.value)} /></label><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowCreateOrder(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={15} /> Create order</button></div></form></section></div>}

      {showAddSku && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddSku(false); }}><section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="add-sku-title"><div className="drawer-header"><div><p className="eyebrow">INVENTORY</p><h2 id="add-sku-title">Add product SKU</h2></div><button className="icon-button" onClick={() => setShowAddSku(false)} aria-label="Close add SKU form"><X size={19} /></button></div><p className="form-intro">Create a sample inventory item. Data stays in the current browser session.</p><form onSubmit={addSku} className="modal-form"><label>Product name<input required autoFocus value={skuName} onChange={(e) => setSkuName(e.target.value)} placeholder="e.g. Everyday cotton shirt" /></label><label>Category<select value={skuCategory} onChange={(e) => setSkuCategory(e.target.value)}><option>T-shirts</option><option>Shirts</option><option>Denim</option><option>Footwear</option><option>Accessories</option><option>Outerwear</option></select></label><div className="form-two-col"><label>Initial stock<input type="number" min="0" value={skuStock} onChange={(e) => setSkuStock(e.target.value)} /></label><label>Price (₹)<input type="number" min="0" value={skuPrice} onChange={(e) => setSkuPrice(e.target.value)} /></label></div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowAddSku(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={15} /> Add SKU</button></div></form></section></div>}
    </div>
  );
}

