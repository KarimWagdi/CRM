import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertTriangle, DollarSign, Truck } from 'lucide-react';
import { inventoryService, supplierService } from '../services/api';

const InventoryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    quantity: 0,
    minQuantity: 0,
    unitPrice: 0
  });

  const [purchaseData, setPurchaseData] = useState({
    supplierId: '',
    quantity: 1,
    unitPrice: 0
  });

  useEffect(() => {
    fetchData();
    fetchSuppliers();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, statsRes] = await Promise.all([
        inventoryService.findAll(),
        inventoryService.getStats()
      ]);
      setItems(itemsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await supplierService.findAll();
      setSuppliers(res.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inventoryService.create(formData);
      setIsModalOpen(false);
      setFormData({ name: '', sku: '', description: '', category: '', quantity: 0, minQuantity: 0, unitPrice: 0 });
      fetchData();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;
    try {
      await inventoryService.purchase(currentItem.id, {
        ...purchaseData,
        supplierId: parseInt(purchaseData.supplierId)
      });
      setIsPurchaseModalOpen(false);
      setPurchaseData({ supplierId: '', quantity: 1, unitPrice: 0 });
      fetchData();
    } catch (error) {
      console.error('Error processing purchase:', error);
    }
  };

  const openPurchaseModal = (item: any) => {
    setCurrentItem(item);
    setPurchaseData({
      supplierId: '',
      quantity: Math.max(1, item.minQuantity - item.quantity),
      unitPrice: item.unitPrice
    });
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
          <p className="text-slate-500">Track stock levels and manage company supplies</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Item</span>
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Unique Items</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.totalItems}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Near Empty</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.nearEmptyCount}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Inventory Value</p>
                <h3 className="text-2xl font-bold text-slate-800">${stats.totalValue.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats?.nearEmptyCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900">Stock Alerts</h4>
            <p className="text-sm text-amber-700">
              There are {stats.nearEmptyCount} items with low stock levels. Consider restacking these items soon.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit Cost</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading inventory...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No items in inventory</td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${Number(item.quantity) <= Number(item.minQuantity) ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          <Package size={20} />
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 block">{item.name}</span>
                          <span className="text-xs text-slate-500">{item.category || 'No Category'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 font-mono text-sm">{item.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${Number(item.quantity) <= Number(item.minQuantity) ? 'text-amber-600' : 'text-slate-900'}`}>
                          {item.quantity}
                        </span>
                        <span className="text-slate-400 text-xs">/ min {item.minQuantity}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${Number(item.quantity) <= Number(item.minQuantity) ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(100, (Number(item.quantity) / (Number(item.minQuantity) || 1)) * 50)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      ${parseFloat(item.unitPrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openPurchaseModal(item)}
                        className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ml-auto hover:bg-slate-800 transition-colors"
                      >
                        <Plus size={14} />
                        <span>Purchase</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Add New Inventory Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateItem} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Quantity Alert</label>
                  <input
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <Truck size={20} />
                <h3 className="text-xl font-bold">Purchase: {currentItem?.name}</h3>
              </div>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handlePurchase} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Supplier</label>
                <select
                  required
                  value={purchaseData.supplierId}
                  onChange={(e) => setPurchaseData({ ...purchaseData, supplierId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Choose a supplier...</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={purchaseData.quantity}
                    onChange={(e) => setPurchaseData({ ...purchaseData, quantity: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={purchaseData.unitPrice}
                    onChange={(e) => setPurchaseData({ ...purchaseData, unitPrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Total Purchase Amount:</span>
                  <span className="text-blue-900 font-bold text-lg">
                    ${(purchaseData.quantity * purchaseData.unitPrice).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1 italic">
                  * This will automatically create an accounting bill and update stock.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!purchaseData.supplierId}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
