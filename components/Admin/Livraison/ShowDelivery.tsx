import { getDeliveries } from "@/lib/actions/delivery.actions";
import EditShippingMethodBtn from "./EditShippingMethodBtn";
import DeleteShippingMethodBtn from "./DeleteShippingMethodBtn";
// import { ShippingMethod } from "@/types";
// import React, { useState } from "react";

export default async function ShowDelivery() {
  // const [shippingMethod, setShippingMethod] = useState<ShippingMethod[]>([]);
  // const [isLoading, setIsLoading] = useState(false);

  const shippingMethod = await getDeliveries();

  console.log(shippingMethod);

  return (
    <div>
      {shippingMethod.length > 0 ? (
        <ul className="bg-noir-800 text-white font-font1 p-1 text-xs text-center rounded-md flex flex-col gap-1">
          {shippingMethod.map((sm) => (
            <li
              key={sm.id}
              className="bg-noir-700 grid grid-cols-4 p-2 rounded-md"
            >
              <p>{sm.name}</p>
              <p>Prix : {sm.cost} €</p>
              <p>Description: {sm.description}</p>

              <div className="flex gap-2 justify-center">
                <EditShippingMethodBtn
                  shippingMethod={sm}
                  shippingMethodId={sm.id}
                />
                <DeleteShippingMethodBtn shippingMethodId={sm.id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="bg-noir-800 text-white font-font1 p-2 text-xs text-center rounded-md">
          Aucun mode de livraison.
        </p>
      )}
    </div>
  );
}
