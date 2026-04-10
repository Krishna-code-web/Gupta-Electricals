import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../../utils/axios.js';
import AdminLayout from './AdminLayout.jsx';

const emptyForm = {
  name: '', description: '', brand: '',
  category: '', price: '', discountPrice: '',
  stock: '', isFeatured: false,
  images: [{ url: '' }],
  specs: [{ key: '', value: '' }]
};

const categories = ['Programmable IC', 'Driver Control Card', 'Mosfet Transistor', 'Integrated Circuits',
      'Thyristor Module', 'Capacitors', 'Leone Relays', 'Electronic Transistors', 'Fuse Holder',
      'Single Phase Transformer', 'Power Capacitor', 'IGBT Module', 'Electrical Relays', 'Spare Parts',
      'Colling Fan', 'Voltage Stabilizer', 'Microtek Inverter', 'Panel Accessories', 'Power Mosfet',
      'Power Transistor', 'General Purpose Relays', 'Ups Battery'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      isFeatured: product.isFeatured,
      images: product.images.length > 0 ? product.images : [{ url: '' }],
      specs: product.specs
        ? Object.entries(product.specs).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }]
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const { data } = await axios.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newImages = data.map(img => ({ url: img.url, public_id: img.public_id }));
      setForm(prev => ({
        ...prev,
        images: [...prev.images.filter(img => img.url), ...newImages]
      }));
      toast.success(`${files.length} image(s) uploaded!`);
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // const handleImageChange = (index, value) => {
  //   const updated = [...form.images];
  //   updated[index].url = value;
  //   setForm({ ...form, images: updated });
  // };

  // const addImage = () => {
  //   setForm({ ...form, images: [...form.images, { url: '' }] });
  // };

  const removeImage = (index) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updated.length > 0 ? updated : [{ url: '' }] });
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...form.specs];
    updated[index][field] = value;
    setForm({ ...form, specs: updated });
  };

  const addSpec = () => {
    setForm({ ...form, specs: [...form.specs, { key: '', value: '' }] });
  };

  const removeSpec = (index) => {
    const updated = form.specs.filter((_, i) => i !== index);
    setForm({ ...form, specs: updated.length > 0 ? updated : [{ key: '', value: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const specsObj = {};
      form.specs.forEach(({ key, value }) => {
        if (key.trim()) specsObj[key.trim()] = value.trim();
      });

      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        images: form.images.filter(img => img.url.trim() !== ''),
        specs: specsObj
      };

      if (editProduct) {
        await axios.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await axios.post('/products', payload);
        toast.success('Product created!');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 text-sm">{products.length} products total</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 rounded h-16 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-semibold mb-2">No products yet</p>
            <p className="text-sm">Click Add Product to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.url || 'https://via.placeholder.com/50'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">₹{product.discountPrice > 0 ? product.discountPrice.toLocaleString() : product.price.toLocaleString()}</p>
                      {product.discountPrice > 0 && (
                        <p className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isFeatured ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Yes</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
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

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X size={22} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} required
                    placeholder="e.g. Samsung Galaxy S24"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Brand *</label>
                  <input
                    type="text" name="brand" value={form.brand}
                    onChange={handleChange} required placeholder="e.g. Samsung"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                  <select
                    name="category" value={form.category}
                    onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹) *</label>
                  <input
                    type="number" name="price" value={form.price}
                    onChange={handleChange} required placeholder="74999"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Discount Price (₹)</label>
                  <input
                    type="number" name="discountPrice" value={form.discountPrice}
                    onChange={handleChange} placeholder="69999 (optional)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Stock *</label>
                  <input
                    type="number" name="stock" value={form.stock}
                    onChange={handleChange} required placeholder="50"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
                  <textarea
                    name="description" value={form.description}
                    onChange={handleChange} rows={3}
                    placeholder="Describe the product..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox" name="isFeatured"
                    checked={form.isFeatured} onChange={handleChange}
                    id="featured" className="w-4 h-4 accent-yellow-400"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Show on Home Page (Featured)
                  </label>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Product Images
                </label>

                {/* Upload Button */}
                <div className="mb-3">
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-yellow-400 rounded-xl p-4 cursor-pointer hover:bg-yellow-50 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <span className="text-sm text-gray-500">Uploading...</span>
                    ) : (
                      <>
                        <span className="text-2xl">📸</span>
                        <span className="text-sm font-medium text-yellow-600">
                          Click to upload images (max 5)
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* Image Previews */}
                {form.images.filter(img => img.url).length > 0 && (
                  <div className="flex gap-3 flex-wrap">
                    {form.images.filter(img => img.url).map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img.url}
                          alt=""
                          className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specs */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Specifications
                </label>
                <div className="space-y-2">
                  {form.specs.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text" value={spec.key}
                        onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                        placeholder="e.g. RAM"
                        className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        type="text" value={spec.value}
                        onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                        placeholder="e.g. 8GB"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <button
                        type="button" onClick={() => removeSpec(i)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button" onClick={addSpec}
                    className="text-sm text-yellow-600 font-medium hover:underline"
                  >
                    + Add specification
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;