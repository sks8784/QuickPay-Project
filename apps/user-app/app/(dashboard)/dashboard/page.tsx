
// export default function() {
//     return <div>
//         Dashboard
//     </div>
// }



// import React from 'react'
import DashboardStatsGrid from '../../../components/DashboardStatsGrid'
import TransactionChart from '../../../components/TransactionChart'
import { TransactionsTable } from '../../../components/TransactionsTable'
import { authOptions } from '../../lib/auth';
import { getServerSession } from 'next-auth';
import prisma from '@repo/db/client';
import { redirect } from 'next/navigation';
import TransactionCountChart from '../../../components/TransactionCountChart';


async function getPaymentRequestsReceived() {
    const session = await getServerSession(authOptions);
    const requests = await prisma.paymentRequest.aggregate({
        _sum: {
            amount: true
        },
        _count: true,
        where: {
            receiverId: Number(session?.user?.id),
            status: 'SUCCESS'
        }
    });

    const requestReceivedAmt = requests._sum.amount || 0;
    const requestReceivedCnt = requests._count || 0;
    return { requestReceivedAmt, requestReceivedCnt };
}


async function getP2PSend() {
    const session = await getServerSession(authOptions);
    const transfers = await prisma.p2pTransfer.aggregate({
        _sum: {
            amount: true
        },
        _count: true,
        where: {
            fromUserId: Number(session?.user?.id),
        }
    });

    const p2pSendAmt = transfers._sum.amount || 0;
    const p2pSendCnt = transfers._count || 0;
    return { p2pSendAmt, p2pSendCnt };
}


async function getPaymentRequestsSend() {
    const session = await getServerSession(authOptions);
    const requests = await prisma.paymentRequest.aggregate({
        _sum: {
            amount: true
        },
        _count: true,
        where: {
            senderId: Number(session?.user?.id),
            status: 'SUCCESS'
        }
    });

    const requestSendAmt = requests._sum.amount || 0;
    const requestSendCnt = requests._count || 0;
    return { requestSendAmt, requestSendCnt };
}


async function getP2PReceived() {
    const session = await getServerSession(authOptions);
    const transfers = await prisma.p2pTransfer.aggregate({
        _sum: {
            amount: true
        },
        _count: true,
        where: {
            toUserId: Number(session?.user?.id),
        }
    });

    const p2pReceivedAmt = transfers._sum.amount || 0;
    const p2pReceivedCnt = transfers._count || 0;
    return { p2pReceivedAmt, p2pReceivedCnt };
}

async function getOnRampTransaction() {
    const session = await getServerSession(authOptions);
    const txn = await prisma.onRampTransaction.aggregate({
        _sum: {
            amount: true
        },
        _count: true,
        where: {
            userId: Number(session?.user?.id),
            status: 'Success'
        }
    });
    const onRampTxnAmt = txn._sum.amount || 0;
    const onRampTxnCnt = txn._count || 0;
    return { onRampTxnAmt, onRampTxnCnt };
}


async function getBalanceAmt() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.aggregate({
        _sum: {
            amount: true
        },
        where: {
            userId: Number(session?.user?.id),
        }
    });

    return balance._sum.amount || 0;
}


async function getRecentTransactions() {
    const session = await getServerSession(authOptions);

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!transactions) {
        throw new Error('No transaction Found')
    }

    return transactions.slice(0, 5).map((transaction:any) => ({
        id: transaction.id,
        transactionId: transaction.transactionId,
        sender: transaction.sender,
        receiver: transaction.receiver,
        paymentMethod: transaction.paymentMethod,
        amount: transaction.amount,
        status: transaction.status,
        type: transaction.type
    }))
}

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    if(!session){
        redirect('/api/auth/signin')
    }
    const {requestReceivedAmt, requestReceivedCnt}= await getPaymentRequestsReceived();
    const {p2pSendAmt, p2pSendCnt} = await getP2PSend();

    const {requestSendAmt, requestSendCnt} = await getPaymentRequestsSend();
    const {p2pReceivedAmt, p2pReceivedCnt} = await getP2PReceived();

    const {onRampTxnAmt, onRampTxnCnt} = await getOnRampTransaction();
    const balanceAmt = await getBalanceAmt();

    const transactions = await getRecentTransactions();

    return (
        <div className="w-full flex flex-col gap-4">
            <DashboardStatsGrid balance={balanceAmt} send={requestReceivedAmt+ p2pSendAmt} received={requestSendAmt + p2pReceivedAmt} onRamp={onRampTxnAmt} />
            <div className="flex flex-row gap-4 w-full">
                <TransactionsTable tableName={'Recent Transactions'} transactions={transactions} />
                <TransactionCountChart send={requestReceivedCnt+p2pSendCnt} received={requestSendCnt+p2pReceivedCnt} onRamp={onRampTxnCnt}/>
            </div>
            <div className="flex flex-row gap-4 w-full">

            </div>
        </div>
    )
}