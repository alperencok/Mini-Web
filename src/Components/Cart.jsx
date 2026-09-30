import CartItem from './CartItem'

export default function Cart({ items, onUpdateQty, onRemove, onClear, onCheckout }) {
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)
  const total    = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 flex flex-col gap-3 min-h-[460px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-900 text-base">Shopping Cart</h2>
          {totalQty > 0 && (
            <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {totalQty}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Body */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400 gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-2xl text-gray-300">
            🛒
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Your cart is empty</p>
            <p className="text-xs text-gray-400 mt-1">Explore our products and find great items to add.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />
            ))}
          </div>

          {/* Footer Summary */}
          <div className="border-t border-gray-100 pt-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Subtotal ({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
              <span className="font-medium text-gray-700">${total.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Standard Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-200">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-indigo-600 text-lg">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
