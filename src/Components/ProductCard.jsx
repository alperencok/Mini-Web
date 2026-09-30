export default function ProductCard({ product, cartQuantity = 0, onAdd }) {
  const isOutOfStock = product.stock <= 0
  const isMaxInCart = cartQuantity >= product.stock

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[11px] font-semibold text-indigo-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          {product.stock <= 15 ? (
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              In Stock ({product.stock})
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        )}

        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-400 block font-normal">Price</span>
            <span className="text-base font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAdd(product)}
            disabled={isOutOfStock || isMaxInCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isMaxInCart
                ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm shadow-indigo-200'
            }`}
          >
            {isOutOfStock ? (
              'Sold Out'
            ) : isMaxInCart ? (
              'Max in Cart'
            ) : cartQuantity > 0 ? (
              <>Add ({cartQuantity})</>
            ) : (
              '+ Add'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
