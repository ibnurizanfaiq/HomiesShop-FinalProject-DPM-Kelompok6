import { ENDTOPUP, USERNAMED } from "@env";
import { updateStatus } from "./orderEnd";

// buyProduct function
export const buyProduct = async (payload) => {
    try {
        const result = await fetch(ENDTOPUP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const resultData = await result.json(); 
        const Data = resultData.data;
        if (Data) {
            return {
                success: true,
                data: {
                    ref_id: Data.ref_id,
                    noCus: Data.customer_no,
                    idproduct: Data.buyer_sku_code,
                    Status: Data.status,
                    pesan: Data.message,
                    sn: Data.sn
                },
            };
        } else {
            return { success: false, message: "Transaksi Gagal !!" };
        }
    } catch (error) {
        console.error("Error in buyProduct:", error);
        return { success: false, message: "Transaksi Gagal !!" };
    }
};


// checkTransaction Function
export const checkTransaction = async (Ref_id, idproduct, nocus, Sign) => {
    try {
        const result = await fetch(ENDTOPUP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: USERNAMED,
                buyer_sku_code: idproduct,
                customer_no: nocus,
                ref_id: Ref_id,
                sign: Sign
            }),
        });
        const Data = await result.json();
    if (Data.data.status == "Sukses") {
       await updateStatus(Ref_id, Data.data.status, Data.data.sn, Data.data.message);
       return{succes: true};
    } else {
        await updateStatus(Ref_id, Data.data.status, Data.data.sn, Data.data.message);
     }
    } catch (error) {
        console.error("Error in buyProduct:", data);
        return { success: false, message: "Gagal update !!" };
    }
};