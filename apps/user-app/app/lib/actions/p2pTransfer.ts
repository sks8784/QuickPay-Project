"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import randomstring from 'randomstring'

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);

  const from = session?.user?.id;
  if (!from) {
    return {
      message: "Error while sending"
    }
  }


  const fromUser = await prisma.user.findFirst({
    where: {
      id: Number(from)
    }
  });

  if (!fromUser) {
    return {
      message: "User not found"
    }
  }

  const toUser = await prisma.user.findFirst({
    where: {
      number: to
    }
  });

  if (!toUser) {
    return {
      message: "User not found"
    }
  }
  
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; // locking in postgres

    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(from) },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error('Insufficient funds');
    }

    await tx.balance.update({
      where: { userId: Number(from) },
      data: { amount: { decrement: amount } },
    });

    await tx.balance.update({
      where: { userId: toUser.id },
      data: { amount: { increment: amount } },
    });

    await tx.p2pTransfer.create({
      data: {
        fromUserId: Number(from),
        toUserId: toUser.id,
        amount,
        timestamp: new Date()
      }
    })

    // const transactionId = Math.random().toString();
    const transactionId = randomstring.generate(14);

    await tx.transaction.create({
      data: {
        transactionId: transactionId,
        userId: Number(from),
        sender: fromUser?.quickpayId,
        receiver: toUser?.quickpayId,
        amount,
        type: 'DEBIT',
        status: 'SUCCEEDED',
        paymentMethod: 'QuickPay'
      }
    })

    await tx.transaction.create({
      data: {
        transactionId: transactionId,
        userId: toUser.id,
        sender: fromUser.quickpayId,
        receiver: toUser?.quickpayId,
        amount,
        type: 'CREDIT',
        status: 'SUCCEEDED',
        paymentMethod: 'QuickPay'
      }
    })
  });
}