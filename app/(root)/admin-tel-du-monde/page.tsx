import LastOrder from "@/components/Admin/Dashboard/LastOrder";
import { AddLivraisonBtn } from "@/components/Admin/Livraison/AddLivraisonBtn";
import ShowDelivery from "@/components/Admin/Livraison/ShowDelivery";
import AddPromoCodeBtn from "@/components/Admin/PromoCode/AddPromoCode";
import ShowActifPromo from "@/components/Admin/PromoCode/ShowActifPromo";
import ShowAllPromo from "@/components/Admin/PromoCode/ShowAllPromo";
import {
  getNumberSaleItems,
  getOrdersPaid,
  getTotalRevenu,
} from "@/lib/actions/order.actions";

export default async function AdminPage() {
  try {
    const revenuTotal = await getTotalRevenu();
    const totalOrders = await getOrdersPaid();
    const totalPhoneSale = await getNumberSaleItems();

    return (
      <div className="flex flex-col gap-10">
        <section className="wrapper flex flex-col gap-4">
          <h1 className="text-white font-font1 uppercase">Général</h1>
          <div className="w-full h-[1px] bg-gradient-to-r from-white to-transparent" />
          <div className="flex gap-8">
            <div className=" w-full grid grid-cols-3 gap-2">
              <p className="bg-noir-800 p-2 text-white text-center font-font1 rounded-md">
                <span className="text-sm text-white/70">
                  Revenu total (commandes validées)
                </span>{" "}
                : {revenuTotal} €
              </p>
              <p className="bg-noir-800 p-2 text-white text-center font-font1 rounded-md">
                <span className="text-sm text-white/70">
                  Commandes validées :
                </span>{" "}
                {totalOrders}
              </p>
              <p className="bg-noir-800 p-2 text-white text-center font-font1 rounded-md">
                <span className="text-sm text-white/70">
                  {" "}
                  Nombre de téléphone vendu :
                </span>{" "}
                {totalPhoneSale}
              </p>
            </div>
          </div>
        </section>

        <section className="wrapper flex flex-col gap-4">
          <h2 className="text-white font-font1 uppercase">
            Les dernières commandes passées (semaine)
          </h2>
          <LastOrder />
        </section>

        <section className="wrapper flex flex-col gap-4">
          <h2 className="text-white font-font1 uppercase">Livraison</h2>
          <AddLivraisonBtn />
          <ShowDelivery />
        </section>

        <section className="wrapper flex flex-col gap-4">
          <h2 className="text-white font-font1 uppercase">Codes Promo</h2>
          <AddPromoCodeBtn />
          <ShowActifPromo />
          <ShowAllPromo />
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error loading admin page:", error);
    return (
      <div className="flex flex-col gap-10">
        <p className="text-red-500">
          Erreur lors du chargement de la page admin.
        </p>
      </div>
    );
  }
}
