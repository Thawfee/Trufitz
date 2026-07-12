"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice, ORDER_STATUSES } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string; email: string };
    items: { quantity: number }[];
  }[];
  lowStock: { id: string; name: string; stock: number }[];
  categories: { id: string; name: string; _count: { products: number } }[];
  coupons: { id: string; code: string; discount: number; type: string; active: boolean }[];
  salesByMonth: Record<string, number>;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  stock: number;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "customers" | "coupons">("overview");
  const [customers, setCustomers] = useState<{ id: string; name: string; email: string; phone: string | null; createdAt: string; _count: { orders: number } }[]>([]);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", type: "percentage" });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    stock: "100",
    categoryId: "",
    section: "new-arrivals",
  });

  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !isAdmin) router.push("/account");
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
      fetch("/api/products").then((r) => r.json()).then(setProducts);
      fetch("/api/categories").then((r) => r.json()).then(setCategories);
      fetch("/api/admin/customers").then((r) => r.json()).then(setCustomers);
    }
  }, [isAdmin]);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newCoupon.code, discount: parseFloat(newCoupon.discount), type: newCoupon.type }),
    });
    setNewCoupon({ code: "", discount: "", type: "percentage" });
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProduct,
        slug,
        price: parseFloat(newProduct.price),
        discount: parseFloat(newProduct.discount),
        stock: parseInt(newProduct.stock),
        images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80"],
        sizes: ["S", "M", "L", "XL", "XXL"],
      }),
    });

    setShowAddProduct(false);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      discount: "0",
      stock: "100",
      categoryId: "",
      section: "new-arrivals",
    });
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  };

  if (status === "loading" || !isAdmin) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/50">Loading...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Products", value: stats?.totalProducts || 0, icon: Package },
    { label: "Orders", value: stats?.totalOrders || 0, icon: ShoppingCart },
    { label: "Revenue", value: formatPrice(stats?.totalRevenue || 0), icon: TrendingUp },
    { label: "Customers", value: stats?.totalCustomers || 0, icon: AlertTriangle },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-sm text-white/40">Manage your TRUFITZ store</p>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white border border-white/20 px-4 py-2"
          >
            View Store
          </Link>
        </div>

        <div className="flex gap-4 mb-8 border-b border-white/5 overflow-x-auto scrollbar-hide">
          {(["overview", "products", "orders", "customers", "coupons"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs uppercase tracking-[0.15em] transition-colors ${
                activeTab === tab
                  ? "text-white border-b-2 border-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div key={card.label} className="card-premium p-6">
                  <card.icon size={20} className="text-white/50 mb-3" />
                  <p className="text-2xl font-bold mb-1">{card.value}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

            {stats.lowStock.length > 0 && (
              <div className="border border-yellow-500/30 p-6">
                <h3 className="text-xs uppercase tracking-[0.15em] font-semibold mb-4 text-yellow-500">
                  Low Stock Alert
                </h3>
                <div className="space-y-2">
                  {stats.lowStock.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm">
                      <span>{p.name}</span>
                      <span className="text-yellow-500">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.categories && (
              <div className="card-premium p-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4 text-white/40">Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stats.categories.map((cat) => (
                    <div key={cat.id} className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-sm font-semibold">{cat.name}</p>
                      <p className="text-xs text-white/40 mt-1">{cat._count.products} products</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card-premium p-6">
              <h3 className="text-xs uppercase tracking-[0.15em] font-semibold mb-4">
                Recent Orders
              </h3>
              {stats.recentOrders.length === 0 ? (
                <p className="text-white/50 text-sm">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center text-sm border-b border-white/5 pb-3"
                    >
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-white/50">
                          {order.user.name} &middot;{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-xs capitalize text-white/50">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-white/50">{products.length} products</p>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 text-xs uppercase tracking-[0.15em] font-semibold"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>

            {showAddProduct && (
              <form
                onSubmit={handleAddProduct}
                className="border border-white/10 p-6 mb-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Product Name"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="bg-white/5 border border-white/20 px-4 py-2 text-sm focus:outline-none"
                  />
                  <select
                    required
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, categoryId: e.target.value })
                    }
                    className="bg-white/5 border border-white/20 px-4 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Price"
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="bg-white/5 border border-white/20 px-4 py-2 text-sm focus:outline-none"
                  />
                  <input
                    placeholder="Discount %"
                    type="number"
                    value={newProduct.discount}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, discount: e.target.value })
                    }
                    className="bg-white/5 border border-white/20 px-4 py-2 text-sm focus:outline-none"
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="bg-white/5 border border-white/20 px-4 py-2 text-sm focus:outline-none"
                  />
                  <textarea
                    placeholder="Description"
                    required
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    className="bg-white/5 border border-white/20 px-4 py-2 text-sm focus:outline-none sm:col-span-2"
                    rows={2}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 text-xs uppercase tracking-[0.15em] font-semibold"
                >
                  Create Product
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/50">
                    <th className="pb-3 pr-4">Product</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Price</th>
                    <th className="pb-3 pr-4">Stock</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5">
                      <td className="py-3 pr-4">{product.name}</td>
                      <td className="py-3 pr-4 text-white/50">
                        {product.category?.name}
                      </td>
                      <td className="py-3 pr-4">{formatPrice(product.price)}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            product.stock <= 10 ? "text-yellow-500" : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 text-white/50 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && stats && (
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-white/50 text-center py-12">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="border border-white/10 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-white/50">
                        {order.user.name} ({order.user.email})
                      </p>
                      <p className="text-xs text-white/50">
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order.id, e.target.value)
                      }
                      className="bg-white/5 border border-white/20 px-3 py-1.5 text-xs focus:outline-none"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-3">
            {customers.length === 0 ? (
              <p className="text-white/40 text-center py-12">No customers yet</p>
            ) : (
              customers.map((c) => (
                <div key={c.id} className="card-premium p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-white/40">{c.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">{c._count.orders} orders</p>
                    <p className="text-[10px] text-white/30 mt-1">
                      Joined {new Date(c.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "coupons" && stats && (
          <div>
            <form onSubmit={handleAddCoupon} className="card-premium p-6 mb-6 flex flex-wrap gap-3">
              <input placeholder="Coupon Code" required value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none flex-1 min-w-30" />
              <input placeholder="Discount" type="number" required value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none w-28" />
              <select value={newCoupon.type} onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none">
                <option value="percentage" className="bg-ink">Percentage</option>
                <option value="flat" className="bg-ink">Flat ₹</option>
              </select>
              <button type="submit" className="bg-white text-black px-6 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-full">Create</button>
            </form>
            <div className="space-y-3">
              {stats.coupons?.map((coupon) => (
                <div key={coupon.id} className="card-premium p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold font-mono">{coupon.code}</p>
                    <p className="text-xs text-white/40">{coupon.type === "percentage" ? `${coupon.discount}% off` : `₹${coupon.discount} off`}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${coupon.active ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>
                    {coupon.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
