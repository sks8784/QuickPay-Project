// // import { Payment, columns } from "./columns"
// // import { DataTable } from "./data-table"


import {TransactionsTable} from "../../../components/TransactionsTable";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { redirect } from "next/navigation";


async function getAllTransactions() {
    const session = await getServerSession(authOptions);
    
    const transactions = await prisma.transaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    
    return transactions.map((transaction:any)=> ({
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


export default async function () {
    const session = await getServerSession(authOptions);
    if(!session){
        redirect('/api/auth/signin')
    }
    const transactions = await getAllTransactions();

    return <div className="w-full">
        <TransactionsTable tableName={'Transaction History'} transactions={transactions}/>
        
    </div>
}