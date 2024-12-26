/* eslint-disable react/prop-types */

const ProductsDisplay = ({ data }) => {
    console.log(data);
  
    return (
      <div className="text-gray-500">Products Display</div>

      // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      //   {data.map((product) => (
      //     <div
      //       key={product.id}
      //       className="bg-white rounded-lg shadow-lg overflow-hidden"
      //     >
      //       <img
      //         src={product.image}
      //         alt={product.name}
      //         className="w-full h-48 object-cover"
      //       />
      //       <div className="p-4">
      //         <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      //         <p className="text-sm text-gray-600">Brand: {product.brand}</p>
      //         <div className="flex justify-between items-center mt-4">
      //           <p className="text-lg font-bold text-blue-500">₹{product.price}</p>
      //           <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
      //             Buy Now
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //   ))}
      // </div>
    );
  };
  
  export default ProductsDisplay;
  