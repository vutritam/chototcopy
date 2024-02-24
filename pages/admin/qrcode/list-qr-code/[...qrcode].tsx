import * as React from 'react'
import ListQrCode from '@/components/list-qr-code'
// import { useRouter } from 'next/router'

//call api => res: responseData  => res.data
// annotation type : bắt buộc gán type cho biến giá trị
// inference type : tự động gán type cho biến đã khai báo giá trị
// number, string, boolean, array, object, null, undefined

// tuple type
// const a : [boolean, string, ...boolean] = ['true', 'a', true, false,...]

// kết hợp
// type TypeA = boolean | string | number | (string | number | boolean)[] //union type

//alias type
// type Obj = {
// 	data: TypeA[]
// 	status: string | number
// }

// const b: Obj = { data: [12], status: 200 }

// const a = (a: TypeA): void => {
// 	if (typeof a === 'string') console.log('string')
// }

// a([1, 'i', true])

export default function ListQrCodePage() {
	const initialData = [
		{
			id: '1',
			level: '1',
			content: 'anh yêu em',
			parentId: null,
			count: 0,
			children: [
				// {
				// 	id: '1-1',
				// 	content: 'anh yêu em 1',
				// 	level: '1-1',
				// 	children: [
				// 		{
				// 			id: '1-1-1',
				// 			content: 'anh yêu em 1-1-1',
				// 			level: '1-1-1',
				// 			children: [
				// 				{
				// 					id: '1-1-1-1',
				// 					level: '1-1-1-1',
				// 					content: 'anh yêu em 1-1-1-1',
				// 					children: [
				// 						{
				// 							id: '1-1-1-1-1',
				// 							level: '1-1-1-1-1',
				// 							content: 'anh yêu em 1-1-1-1-1',
				// 							children: [],
				// 						},
				// 						{
				// 							id: '1-2-1-1-1',
				// 							level: '1-2-1-1-1',
				// 							content: 'em yêu cả nhau 1-2-1-1-1',
				// 							children: [],
				// 						},
				// 					],
				// 				},
				// 				{
				// 					id: '1-2-1-1',
				// 					level: '1-2-1-1',
				// 					content: 'em yêu cả nhau 1-2-1-1',
				// 					children: [],
				// 				},
				// 			],
				// 		},
				// 		{ id: '1-2-1', level: '1-2-1', content: 'em yêu cả nhau 1-2-1', children: [] },
				// 	],
				// },
				// { id: '1-2', level: '1-2', content: 'em yêu cả nhau', children: [] },
			],
		},
	]
	const [data, setData] = React.useState(initialData)
	const [values, setNewValue] = React.useState('')

	const handleCheckCount = (item, renderComment) => {
		console.log(item)

		if (item.children && item.children.length > 0) {
			item.count++
			return (
				<div
					style={
						item.children && item.children.length > 0 ? { marginLeft: '10px' } : { marginLeft: '0' }
					}
				>
					{renderComment(item.children, item)}
				</div>
			)
		}
	}

	const findItemInArrray = (dataChildren, itemSelected, cc) => {
		const findIndexData = dataChildren?.findIndex(
			(item) => item.parentId && item.parentId === itemSelected?.parentId
		)
		if (findIndexData === -1 && itemSelected.children && itemSelected.children.length > 0) {
			// Gọi đệ quy và kiểm tra kết quả trả về
			dataChildren.map((e) => {
				findItemInArrray(e.children, itemSelected, cc)
			})
		} else {
			if (findIndexData !== -1 && dataChildren[findIndexData]) {
				// Kiểm tra xem thuộc tính children có tồn tại hay không trước khi thực hiện phép gán
				dataChildren[findIndexData].children = itemSelected.children
			}
		}
		setData(dataChildren)
	}

	const onReplyComment = (itemSelected, cc) => {
		if (values) {
			const dataChildren = [...data]
			itemSelected.children.push({
				id: `${itemSelected.id}-1`,
				level: `${itemSelected.id}-1`,
				parentId: itemSelected.id,
				content: values,
				count: 0,
				children: [],
			})
			findItemInArrray(dataChildren, itemSelected, cc)
		}

		// console.log(itemSelected, cc)
	}

	const renderComment = (data, parentItem) => {
		console.log(parentItem, 'pa')

		return data?.map((item) => {
			return (
				<>
					<ListQrCode />
					<input value={item.content} style={{ marginBottom: '10px' }} />
					<button
						onClick={() => onReplyComment(item, parentItem)}
						// disabled={parentItem?.children?.length === 4}
					>
						Trả lời
					</button>

					<br />
					{handleCheckCount(item, renderComment)}
				</>
			)
		})
	}
	// const [data, setData] = React.useState<number>(0)
	// const [list, setList] = React.useState<(string | number)[]>([])
	// let a // undefined

	// var a = 6
	// {
	// 	var a = 10
	// 	console.log(a)
	// }
	// var a = 9
	// var a = 100
	// // a = 9
	// console.log(a)
	// React.useEffect(() => {
	// 	const vt = -1
	// 	let a = [1, 2, 3, 4, 5, 6, 6, 5, 1]
	// 	// a.length++
	// 	// for (let index = a.length - 1; index >= vt; index--) {
	// 	// 	a[index] = a[index - 1]
	// 	// 	if (index === vt) {
	// 	// 		a[index] = 7
	// 	// 	}
	// 	// }

	// 	// for (let i = 0; i < a.length; i++) {
	// 	// 	if (i === vt && vt >= 0) {
	// 	// 		a.splice(vt, 1)
	// 	// 	}
	// 	// }

	// 	//chuỗi 'jjkmnll'
	// 	// xóa những phần tử trùng nhau giữ lại 1 cái
	// 	// let str = 'jjkkmnllf'
	// 	// let ad = []

	// 	// // j j, j k, j m, j n,  (2) j l
	// 	// for (let i = 0; i < str.length; i++) {
	// 	// 	if (str[i] !== str[i + 1]) {
	// 	// 		ad.push(str[i])
	// 	// 	}
	// 	// }
	// 	// console.log(ad, 'g')

	// 	// group item  by value of property
	// 	// let ae = [1, 2, 3, 4, 5, 6, 7]
	// 	// output: 12,13,14,15,21,22,...
	// 	// let ak = []
	// 	// for (let i = 0; i < ae.length; i++) {
	// 	// 	for (let j = 0; j < ae.length; j++) {
	// 	// 		let c = [ae[i] + '' + ae[j]].join(',')
	// 	// 		ak.push(c)
	// 	// 	}
	// 	// }
	// 	// console.log(ak, 'ak')
	// 	// tính tổng các phần tử trong mảng
	// 	// let c = a.reduce((crr, current) => {
	// 	// 	return crr + current
	// 	// }, 0)
	// 	// console.log(c, 'aa')
	// 	// let sum = 0
	// 	// for (let i = 0; i < a.length; i++) {
	// 	// 	// const element = array[i];
	// 	// 	sum += a[i]
	// 	// }
	// 	// console.log(sum, 'sum')
	// 	//tìm phần tử lớn nhất
	// 	// let max = a[0]

	// 	// for (let i = 0; i < a.length; i++) {
	// 	// 	// const element = a[i];
	// 	// 	if (a[i] > max) {
	// 	// 		max = a[i]
	// 	// 	}
	// 	// }
	// 	// console.log(max, 'max')
	// 	// let x = []
	// 	// for (let i = a.length - 1; i >= 0; i--) {
	// 	// 	x.push(a[i])
	// 	// }
	// 	// console.log(x, 'x')
	// 	// let c = []
	// 	// for (let i = 0; i < a.length; i++) {
	// 	// 	let f = a[i]
	// 	// 	for (let j = i + 1; j < a.length; j++) {
	// 	// 		console.log(a, 'aaa')

	// 	// 		console.log(a[i] + '--' + a[j])

	// 	// 		if (f === a[j]) {
	// 	// 			c.push(f)
	// 	// 		}
	// 	// 	}
	// 	// }
	// 	// console.log(c, 'ccc')
	// 	// //tìm chuỗi con tăng dần dài nhất
	// 	let cc = [10, 22, 9, 33, 21, 50, 41, 60, 80, 100]
	// 	// let outPut = 5
	// 	// let arr = []

	// 	// for (let i = 0; i < cc.length; i++) {
	// 	// 	if (cc[i + 1] > cc[i]) {
	// 	// 		arr.push(cc[i + 1])
	// 	// 	}
	// 	// }
	// 	// for (let j = 0; j < outPut; j++) {
	// 	// 	console.log('*', arr[j], '*')
	// 	// }
	// 	// console.log(arr, 'oo')
	// 	function findLISLength(arr) {
	// 		const n = arr.length
	// 		// Tạo một mảng dp có chiều dài n và khởi tạo tất cả giá trị là 1
	// 		const dp = new Array(n).fill(1)

	// 		// Bắt đầu tính toán độ dài của chuỗi con tăng dần tại mỗi vị trí i
	// 		for (let i = 1; i < n; i++) {
	// 			for (let j = 0; j < i; j++) {
	// 				console.log(dp)
	// 				// Kiểm tra nếu arr[i] lớn hơn arr[j] và dp[i] < dp[j] + 1
	// 				if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
	// 					// Cập nhật giá trị dp[i]
	// 					dp[i] = dp[j] + 1
	// 				}
	// 			}
	// 		}

	// 		// Tìm giá trị lớn nhất trong mảng dp
	// 		let max = Math.max(...dp)
	// 		// Khởi tạo một mảng result để lưu trữ chuỗi con tăng dần dài nhất
	// 		let result = []

	// 		// Duyệt qua mảng dp để xây dựng chuỗi con tăng dần dài nhất
	// 		for (let i = n - 1; i >= 0; i--) {
	// 			if (dp[i] === max) {
	// 				result.unshift(arr[i])
	// 				max--
	// 			}
	// 		}

	// 		// Trả về chuỗi con tăng dần dài nhất
	// 		return result
	// 	}
	// 	console.log(findLISLength(cc))
	// }, [])
	const handleAddComment = () => {
		console.log(values)
	}
	const handleNewValue = (e) => {
		setNewValue(e?.target?.value)
		console.log(e?.target?.value)
	}

	return (
		<>
			<div>
				<input onChange={handleNewValue} />
				<button onClick={handleAddComment}>Nhập</button>
				{renderComment(data)}
			</div>
		</>
	)
}
