// "use client"
// import { Button } from "@repo/ui/button"
// import { Card } from "@repo/ui/card"
// import acceptOrDeclineRequest from "../app/lib/actions/acceptOrDeclineRequest"
// import { useState } from "react"

// export const PaymentRequests = ({
//     paymentRequests
// }: {
//     paymentRequests: {
//         id: number,
//         amount: number,
//         status: string,
//         senderId: string
//     }[]
// }) => {
//     if (!paymentRequests.length) {
//         return <Card title="Payment Requests">
//             <div className="text-center pb-8 pt-8">
//                 No Payment Requests
//             </div>
//         </Card>
//     }

//     const [requests, setRequests] = useState(paymentRequests);

//     const handleAction = async (requestId: number, action: string) => {
//         const result = await acceptOrDeclineRequest(requestId, action);
//         if (result.error) {
//             alert(result.error);
//         } else {
//             setRequests(prevRequests =>
//                 prevRequests.map(request =>
//                     request.id === requestId ? { ...request, status: action === 'accept' ? 'SUCCESS' : 'DECLINED' } : request
//                 )
//             );
//         }
//     };

//     return <Card title="Payment Requests">
//         <div className="pt-2">
//             {paymentRequests.map((request, index) => <div className="flex justify-between" key={index}>
//                 <div>
//                     <div className="text-sm">
//                         Requests
//                     </div>
//                     <div className="text-slate-600 text-xs">
//                         {request.status}
//                     </div>
//                 </div>
//                 <div className="flex flex-col justify-center">
//                     Rs {request.amount / 100}
//                 </div>
//                 {request.status === 'PENDING' ? (
//                     <>
//                         <Button onClick={() => handleAction(request.id, 'accept')}>Accept</Button>
//                         <Button onClick={() => handleAction(request.id, 'decline')}>Decline</Button>
//                     </>
//                 ) : (
//                     <div className="text-slate-600 text-xs">
//                         {request.status}
//                     </div>
//                 )}

//             </div>)}
//         </div>
//     </Card>
// }





"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import acceptOrDeclineRequest from "../app/lib/actions/acceptOrDeclineRequest";
import { useState } from "react";

export const PaymentRequests = ({
    paymentRequests
}: {
    paymentRequests: {
        id: number,
        amount: number,
        status: string,
        senderId: string
    }[]
}) => {
    const [requests, setRequests] = useState(paymentRequests);

    const handleAction = async (requestId: number, action: string) => {
        const result = await acceptOrDeclineRequest(requestId, action);
        if (result.error) {
            alert(result.error);
        } else {
            setRequests(prevRequests =>
                prevRequests.map(request =>
                    request.id === requestId ? { ...request, status: action === 'accept' ? 'SUCCESS' : 'DECLINED' } : request
                )
            );
        }
    };

    if (!requests.length) {
        return (
            <Card title="Payment Requests">
                <div className="text-center pb-8 pt-8">
                    No Payment Requests
                </div>
            </Card>
        );
    }

    return (
        <Card title="Payment Requests">
            <div className="pt-2">
                {requests.map((request, index) => (
                    <div className="flex justify-between" key={index}>
                        <div>
                            <div className="text-sm mt-2">
                                Request
                            </div>
                            <div className="text-slate-600 text-xs">
                                {request.status}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            Rs {request.amount / 100}
                        </div>
                        {request.status === 'PENDING' ? (
                            <>
                                <div className="flex mt-2">
                                <Button onClick={() => handleAction(request.id, 'accept')}>Accept</Button>
                                <Button onClick={() => handleAction(request.id, 'decline')}>Decline</Button>
                                </div>
                            </>
                        ) : (
                            <></>
                            // <div className="text-slate-600 text-xs mt-2">
                            //     {request.status}
                            // </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};
