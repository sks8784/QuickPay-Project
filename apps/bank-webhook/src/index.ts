import express from "express";
import db from "@repo/db/client";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    // TODO: Check if this onRampTxn is processing or not
    
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string;
        transactionid: string;
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount,
        transactionid: req.body.transactionId
    };
    

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            }),
            db.transaction.updateMany({
                where:{
                    transactionId: paymentInformation.transactionid
                },
                data:{
                    status: 'SUCCEEDED'
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);

export default app;