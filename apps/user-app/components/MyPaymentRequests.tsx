"use client"
import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"

export const MyPaymentRequests = ({
    myPaymentRequests
}: {
    myPaymentRequests: {
        id: number,
        amount: number,
        status: string,
        receiverId: string
    }[]
}) => {
    if (!myPaymentRequests.length) {
        return <Card title="My Payment Requests">
            <div className="text-center pb-8 pt-8">
                No Payment Requests Made
            </div>
        </Card>
    }
    return <Card title="My Payment Requests">
        <div className="pt-2">
            {myPaymentRequests.map((request,index) => <div className="flex justify-between mb-2" key={index}>
                <div>
                    <div className="text-sm">
                        Your Requests
                    </div>
                    <div className="text-slate-600 text-xs">
                        {request.status}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    Rs {request.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}