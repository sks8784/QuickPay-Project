// import React from 'react'
"use client"
import { IoIosSend } from "react-icons/io";
import { FaWallet } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";

export default function DashboardStatsGrid({
	balance,
	send, 
	received,
	onRamp
}:{
	balance:number,
	send:number,
	received:number,
	onRamp:number
}) {
	return (
		<div className="flex gap-4">
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
					<FaWallet className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Balance</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">₹{balance/100}</strong>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
					<IoIosSend className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Send</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">₹{send/100}</strong>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
					<GiReceiveMoney className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Received</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">₹{received/100}</strong>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
					<BsBank2 className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">OnRamp</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">₹{onRamp/100}</strong>
					</div>
				</div>
			</BoxWrapper>
		</div>
	)
}

function BoxWrapper({ children }:any) {
	return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}