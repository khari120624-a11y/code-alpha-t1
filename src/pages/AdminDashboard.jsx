import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, ClipboardList, Plus, Edit2, Trash2, Check, RefreshCw, X, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorOrders, setErrorOrders] = useState(null);

  // Form Editor Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // If null, we are ADDING. If holds object, we are EDITING.

  // Form Fields State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [countInStock, setCountInStock] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoadingProducts(false);
    } catch (err) {
      setLoadingProducts(false);
      setErrorProducts(err.response?.data?.message || err.message);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
      setLoadingOrders(false);
    } catch (err) {
      setLoadingOrders(false);
      setErrorOrders(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const openAddModal = () => {
    setEditProduct(null);
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setCategory('Audio');
    setCountInStock('');
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setFormError('');
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleDeliverOrder = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/deliver`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !price || !description || !image || !category || countInStock === '') {
      setFormError('Please populate all fields.');
      return;
    }

    setSubmitting(true);
    const body = {
      name,
      price: Number(price),
      description,
      image,
      category,
      countInStock: Number(countInStock),
    };

    try {
      if (editProduct) {
        // Edit existing product
        await axios.put(`/api/products/${editProduct._id}`, body);
      } else {
        // Create new product
        await axios.post('/api/products', body);
      }
      setShowModal(false);
      setSubmitting(false);
      fetchProducts();
    } catch (err) {
      setSubmitting(false);
      setFormError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-8">
        Admin Dashboard
      </h1>

      {/* Tabs headers */}
      <div className="flex border-b border-slate-900 mb-8 space-x-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3.5 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-primary-500 text-white'
              : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <Package size={16} /> <span>Manage Products</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-primary-500 text-white'
              : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <ClipboardList size={16} /> <span>Customer Orders</span>
        </button>
      </div>

      {/* TABS CONTENT */}

      {activeTab === 'products' ? (
        <div>
          {/* Action Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider">Product Inventory</h2>
            <button
              onClick={openAddModal}
              className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 bg-gradient-to-r from-violet-600 to-primary-600 hover:from-violet-500 hover:to-primary-550 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-500/10 transition-colors"
            >
              <Plus size={14} /> <span>Add New Product</span>
            </button>
          </div>

          {loadingProducts ? (
            <LoadingSpinner />
          ) : errorProducts ? (
            <p className="text-red-405 text-sm">{errorProducts}</p>
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-850 text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/60 uppercase font-semibold tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-center">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-900/20">
                      <td className="px-6 py-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-9 w-14 object-cover rounded bg-slate-950 border border-slate-800"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-200 max-w-[200px] truncate">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-100">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-400">{product.category}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          product.countInStock === 0
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {product.countInStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-slate-800/40 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider mb-6">Customer Purchase Orders</h2>

          {loadingOrders ? (
            <LoadingSpinner />
          ) : errorOrders ? (
            <p className="text-red-405 text-sm">{errorOrders}</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-450 text-sm">No customer orders found in the database.</p>
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-850 text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/60 uppercase font-semibold tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Paid</th>
                    <th className="px-6 py-4">Delivered</th>
                    <th className="px-6 py-4 text-right">Deliver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-350">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-900/20">
                      <td className="px-6 py-4 font-mono text-slate-300 font-semibold">{order._id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 font-semibold text-slate-200">{order.user?.name || 'Deleted Account'}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-100">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.isPaid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {order.isPaid ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.isDelivered ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {order.isDelivered ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleDeliverOrder(order._id)}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-violet-650 hover:bg-violet-600 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <Check size={11} /> <span>Ship</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FORM MODAL (ADD / EDIT PRODUCT) */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white">
                {editProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-450 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="bg-red-955/40 border border-red-500/20 text-red-300 text-xs rounded-xl p-3.5 mb-5">
                {formError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM4 Wireless"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    className="block w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Quantity In Stock
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    className="block w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    className="block w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-primary-500 cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Audio">Audio</option>
                    <option value="Keyboards">Keyboards</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://unsplash.com/..."
                    className="block w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Summarize product features..."
                  className="block w-full bg-slate-955 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-600/10 active:scale-[0.99] transition-all"
              >
                {submitting ? 'Submitting Form...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
