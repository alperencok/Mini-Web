export default function CartItem({ item, onUpdateQty, onRemove }) {
  const isMaxStock = item.quantity >= item.stock

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:border-gray-200 transition-colors">
      {/* Thumbnail */}
      <img
        src={item.image}
        alt={item.name}
        className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0"
      />

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 truncate" title={item.name}>
          {item.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          ${item.price.toFixed(2)} each
        </p>
        <p className="text-xs font-bold text-indigo-600 mt-1">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/80 rounded-lg p-0.5">
        <button
          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
          className="w-6 h-6 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs transition-colors shadow-2xs"
          title="Decrease quantity"
        >
          −
        </button>
        <span className="w-5 text-center text-xs font-bold text-gray-800">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
          disabled={isMaxStock}
          className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold transition-colors shadow-2xs ${
            isMaxStock
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
          title={isMaxStock ? 'Maximum stock reached' : 'Increase quantity'}
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Remove item"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
