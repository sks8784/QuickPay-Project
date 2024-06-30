"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import randomstring from 'randomstring';

export async function createOnRampTransaction(amount: number, provider: string) {

    const session = await getServerSession(authOptions);
    const token = randomstring.generate(14);// this token will be provided by bank api, since we don't have a bank api so we are using a random token

    const userId = session.user.id;
    if (!userId) {
        return {
            messages: "User not logged in"
        }
    }

    const user = await prisma.user.findFirst({
        where: {
          id: Number(userId)
        }
    });

    if (!user) {
        return {
          message: "User not found"
        }
      }

    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId),
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token: token
        }
    })

    await prisma.transaction.create({
        data: {
            transactionId: randomstring.generate(14),
            userId: Number(userId),
            sender: provider,
            receiver: user?.quickpayId,
            type: 'CREDIT',
            status: 'PENDING',
            amount,
            paymentMethod: 'NetBanking'
        }
    })

    return {
        message: "On ramp transaction added"
    }
}