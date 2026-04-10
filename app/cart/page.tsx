"use client";

import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { state, dispatch } = useCart();

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (state.items.length === 0) {
    return (
      <section className="pt-24 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FaShoppingCart className="text-gray-200 text-8xl mb-6" />
        <h2 className="text-2xl font-bold text-gray-500 mb-2">Shporta është bosh</h2>
        <p className="text-gray-400 mb-8 text-sm">Shto disa produkte dhe kthehu këtu.</p>
        <Link
          href="/produktet"
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
        >
          <FaArrowLeft className="text-sm" /> Shko te Produktet
        </Link>
      </section>
    );
  }

  return (
    <section className="pt-24 min-h-screen bg-gray-50 px-4 pb-12">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <FaShoppingCart className="text-green-600" />
          Shporta ime
          <span className="text-sm font-normal text-gray-400 ml-1">({state.items.length} produkte)</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Lista e produkteve */}
          <div className="flex-1 space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                    Pa foto
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                  <p className="text-green-600 font-bold text-sm mt-1">{item.price} € / copë</p>
                </div>

                {/* +/- Sasia */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch({ type: "DECREASE_QUANTITY", payload: item.id })}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: item.id })}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Subtotali */}
                <div className="text-right min-w-16">
                  <p className="font-bold text-gray-800">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>

                {/* Fshi */}
                <button
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                  className="text-red-400 hover:text-red-600 transition ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            {/* Kthehu te produktet */}
            <Link
              href="/produktet"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-600 transition mt-2"
            >
              <FaArrowLeft /> Vazhdo blerjen
            </Link>
          </div>

          {/* Permbledhja */}
          <div className="lg:w-72">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Përmbledhja</h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate max-w-36">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Totali</span>
                  <span className="text-green-600">{total.toFixed(2)} €</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition active:scale-95"
              >
                Porosit Tani →
              </Link>

              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="w-full mt-3 text-center text-sm text-red-400 hover:text-red-600 transition"
              >
                Zbraz shportën
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
