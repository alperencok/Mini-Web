import { useState } from 'react'
import ProductCard from '../Components/ProductCard'
import Cart from '../Components/Cart'
import { PRODUCTS, CATEGORIES } from '../Interfaces/Product'

export default function HomePage() {
  const [cartItems, setCartItems]           = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery]       = useState('')
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
  const [orderModalData, setOrderModalData] = useState(null)

  function handleAdd(product) {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function handleUpdateQty(id, qty) {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== id))
      return
    }
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        // Enforce stock upper bound
        const clampedQty = Math.min(qty, i.stock)
        return { ...i, quantity: clampedQty }
      }
      return i
    }))
  }

  function handleRemove(id) {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  function handleClear() {
    setCartItems([])
  }

  function handleCheckout() {
    if (cartItems.length === 0) return
    const orderTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const orderId = 'NS-' + Math.floor(100000 + Math.random() * 900000)

    setOrderModalData({
      orderId,
      itemCount,
      orderTotal,
    })
    setCartItems([])
    setIsMobileCartOpen(false)
  }

  // Filter products by category and search query
  const filtered = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const matchesSearch   = searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase().trim())
    return matchesCategory && matchesSearch
  })

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-100">
              N
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">NovaStore</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400">
                Premium E-Commerce
              </span>
            </div>
          </div>

          {/* Search Bar in Header */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Mobile Cart Toggler & Summary */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'} available
            </span>

            <button
              onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
              className="lg:hidden relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>🛒</span>
              {totalCartCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-8 items-start w-full flex-1">
        {/* Product Catalog */}
        <div className="flex-1 min-w-0">
          {/* Category Filter Pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => {
              const count = cat === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeCategory === cat ? 'bg-indigo-500/80 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
              <span className="text-4xl mb-3">🔍</span>
              <h3 className="text-base font-bold text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                We couldn't find any products matching your query "{searchQuery}". Try selecting another category or clearing the search.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(product => {
                const inCart = cartItems.find(i => i.id === product.id)
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartQuantity={inCart ? inCart.quantity : 0}
                    onAdd={handleAdd}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Desktop Sticky Cart Sidebar */}
        <div className="hidden lg:block w-84 shrink-0 sticky top-20">
          <Cart
            items={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
            onClear={handleClear}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Mobile Cart Drawer Overlay */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-4 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-base font-bold text-slate-900">Cart Details</span>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <Cart
              items={cartItems}
              onUpdateQty={handleUpdateQty}
              onRemove={handleRemove}
              onClear={handleClear}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {orderModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setOrderModalData(null)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Order Confirmed!
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Thank you for shopping with NovaStore. Your order has been placed successfully.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left border border-slate-100">
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-slate-800">{orderModalData.orderId}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-400">Items Ordered:</span>
                <span className="font-semibold text-slate-800">{orderModalData.itemCount} items</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-slate-200/60 mt-2 pt-2">
                <span className="text-slate-600 font-bold">Total Paid:</span>
                <span className="font-extrabold text-indigo-600 text-sm">
                  ${orderModalData.orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setOrderModalData(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-100"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NovaStore. Developed by alperencok.</p>
          <p>Built with React 18, Vite & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
