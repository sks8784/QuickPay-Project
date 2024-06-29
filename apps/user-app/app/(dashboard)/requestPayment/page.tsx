// import { RequestPaymentCard } from "../../../components/RequestPaymentCard";
// import prisma from "@repo/db/client";
// import { PaymentRequests } from "../../../components/PaymentRequests";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
// import { MyPaymentRequests } from "../../../components/MyPaymentRequests";
// import { useState } from "react";


// async function getPaymentRequests() {
//     const session = await getServerSession(authOptions);
//     const requests = await prisma.paymentRequest.findMany({
//         where: {
//             receiverId: Number(session?.user?.id)
//         }
//     });
//     return requests.map((request:any) => ({
//         id: request.id,
//         amount: request.amount,
//         status: request.status,
//         senderId: request.senderId
//     }))
// }



// async function getMyRequests() {
//     const session = await getServerSession(authOptions);
//     const requests = await prisma.paymentRequest.findMany({
//         where: {
//             senderId: Number(session?.user?.id)
//         }
//     });
//     return requests.map((request:any) => ({
//         id: request.id,
//         amount: request.amount,
//         status: request.status,
//         receiverId: request.receiverId
//     }))
// }

// export default async function () {


//     const paymentRequests = await getPaymentRequests();
//     const myPaymentRequests = await getMyRequests();



//     return <div className="w-screen">
//         <div className="w-full">
//             <RequestPaymentCard/>
//         </div>
//         <div>
//             <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
//                 Payment Requests
//             </div>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
//                 <div>
//                     <div className="pt-4">
//                         <PaymentRequests paymentRequests={paymentRequests} />
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <div>
//             <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
//                 My Payment Requests
//             </div>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
//                 <div>
//                     <div className="pt-4">
//                         <MyPaymentRequests myPaymentRequests={myPaymentRequests} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// }










import { RequestPaymentCard } from "../../../components/RequestPaymentCard";
import prisma from "@repo/db/client";
import { PaymentRequests } from "../../../components/PaymentRequests";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { MyPaymentRequests } from "../../../components/MyPaymentRequests";
import { useState } from "react";
import { redirect } from "next/navigation";


async function getPaymentRequests() {
    const session = await getServerSession(authOptions);
    const requests = await prisma.paymentRequest.findMany({
        where: {
            receiverId: Number(session?.user?.id)
        }
    });
    return requests.map((request: any) => ({
        id: request.id,
        amount: request.amount,
        status: request.status,
        senderId: request.senderId
    }))
}



async function getMyRequests() {
    const session = await getServerSession(authOptions);
    const requests = await prisma.paymentRequest.findMany({
        where: {
            senderId: Number(session?.user?.id)
        }
    });
    return requests.map((request: any) => ({
        id: request.id,
        amount: request.amount,
        status: request.status,
        receiverId: request.receiverId
    }))
}

export default async function () {
    const session = await getServerSession(authOptions);
    if(!session){
        redirect('/api/auth/signin')
    }

    const paymentRequests = await getPaymentRequests();
    const myPaymentRequests = await getMyRequests();



    return <div className="w-screen">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <RequestPaymentCard />
            </div>
            <div className="">
                <div className="pt-4">
                    <PaymentRequests paymentRequests={paymentRequests} />
                </div>
                <div className="pt-4">
                    <MyPaymentRequests myPaymentRequests={myPaymentRequests} />
                </div>
            </div>
        </div>
    </div>
}