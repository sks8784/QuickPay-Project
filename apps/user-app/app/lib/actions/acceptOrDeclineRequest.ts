"use server";

import prisma from "@repo/db/client";


export default async function acceptOrDeclineRequest(requestId: number, action: string) {


    const paymentRequest = await prisma.paymentRequest.findUnique({
        where: { id: Number(requestId) },
        include: { sender: true, receiver: true },
    });

    if (!paymentRequest) {
        return { error: 'Payment request not found' };
    }

    if (action === 'accept') {
        try {
            await prisma.$transaction(async (prisma) => {
                const receiverBalance = await prisma.balance.findUnique({
                    where: { userId: paymentRequest?.receiverId },
                });

                if (!receiverBalance || receiverBalance.amount < paymentRequest.amount){
                    throw new Error('Insufficient balance')
                }

                await prisma.balance.update({
                    where: { userId: paymentRequest?.receiverId },
                    data: { amount: { decrement: paymentRequest?.amount } },
                });

                await prisma.balance.update({
                    where: { userId: paymentRequest?.senderId },
                    data: { amount: { increment: paymentRequest?.amount } },
                });

                await prisma.paymentRequest.updateMany({
                    where: { id: paymentRequest?.id },
                    data: { status: 'SUCCESS' },
                });

                await prisma.transaction.updateMany({
                    where: { transactionId: paymentRequest.transactionId },
                    data: { status: 'SUCCEEDED' }
                })
                
            });
            return {
                messages: 'Payment request accepted and balances updated'
            }
        } catch (error: any) {
            return {
                error: error.message
            }
        }
    } else if (action === 'decline') {
        await prisma.paymentRequest.update({
            where: { id: paymentRequest?.id },
            data: { status: 'DECLINED' },
        });

        await prisma.transaction.updateMany({
            where: { transactionId: paymentRequest.transactionId },
            data: { status: 'DECLINED' }
        })

        return {
            message: 'Payment request declined'
        };
    } else {
        return {
            error: 'Invalid action' 
        };
    }
} 

