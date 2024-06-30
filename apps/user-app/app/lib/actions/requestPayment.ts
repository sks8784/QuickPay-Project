"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import randomstring from 'randomstring';

export async function requestPayment(receiverPhoneNumber: string, amount: number) {
    try {
        const session = await getServerSession(authOptions);
        const senderId = session?.user?.id;
        if (!senderId) {
            return {
                message: "Error while sending"
            }
        }

        const sender = await prisma.user.findUnique({
            where: {
                id: Number(senderId),
            },
        })

        if (!sender) {
            throw new Error('Sender not found')
        }

        // Find the receiver by phone number
        const receiver = await prisma.user.findUnique({
            where: {
                number: receiverPhoneNumber,
            },
        })

        if (!receiver) {
            throw new Error('Receiver not found')
        }

        //Create transaction
        const transactionId = randomstring.generate(14);

        await prisma.transaction.create({
            data: {
                transactionId: transactionId,
                userId: Number(senderId),
                sender: receiver?.quickpayId,
                receiver: sender?.quickpayId,
                type: 'CREDIT',
                status: 'PENDING',
                amount,
                paymentMethod: 'QuickPay'
            }
        })

        await prisma.transaction.create({
            data:{
                transactionId: transactionId,
                userId: receiver.id,
                sender: receiver?.quickpayId,
                receiver: sender?.quickpayId,
                type: 'DEBIT',
                status: 'PENDING',
                amount,
                paymentMethod: 'QuickPay'
            }  
        })

        // Create the payment request
        const paymentRequest = await prisma.paymentRequest.create({
            data: {
                amount,
                status: 'PENDING',
                senderId: Number(senderId),
                receiverId: receiver.id,
                transactionId: transactionId,
            },
        })

        return paymentRequest
    } catch (error) {
        console.error(error)
        throw new Error('Failed to create payment request')
    } finally {
        await prisma.$disconnect()
    }
}