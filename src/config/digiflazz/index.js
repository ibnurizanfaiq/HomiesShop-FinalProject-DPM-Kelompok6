import {USERNAMED, APIDIGIFLAZZ} from "@env";
import md5 from "js-md5";

export const payload = (sku, noCus) => {
    try {
        const now = new Date();
        const formattedDate = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
        const refid = `${noCus}${formattedDate}`;
        const plain = USERNAMED + APIDIGIFLAZZ + refid;
        const Sign = md5(plain);

        return {
            success: true,
            data:{
                username: USERNAMED,
                buyer_sku_code: sku,
                customer_no: noCus,
                ref_id: refid,
                sign: Sign
            }
        };
    } catch (error) {
        return { success: false, message: "Gagal Membuat Payload" };
    }
};
