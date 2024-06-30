"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const RADIAN = Math.PI / 180
const COLORS = ['#FF8042', '#FFBB28', '#00C49F']

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }:any) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	)
}

export default function TransactionCountChart({
	send, 
	received,
	onRamp
}:{
	send:number,
	received:number,
	onRamp:number
}) {
	
	console.log(send);
	console.log(received);
	console.log(onRamp);
	
	const data = [
		{ name: 'Send', value: send },
		{ name: 'Received', value: received },
		{ name: 'OnRamp', value: onRamp }
	]
	return (
		<div className="w-[20rem] h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
			<strong className="text-gray-700 font-medium">Payment Analytics</strong>
			<div className="mt-3 w-full flex-1 text-xs">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart width={400} height={300}>
						<Pie
							data={data}
							cx="50%"
							cy="45%"
							labelLine={false}
							label={renderCustomizedLabel}
							outerRadius={105}
							fill="#8884d8"
							dataKey="value"
						>
							{data.map((_, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}