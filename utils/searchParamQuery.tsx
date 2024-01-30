import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
interface InputProps {
	pathUrl: string | undefined
	param: any
	title: string
	pathName: string
}
export default function SearchParam(props: InputProps) {
	const { pathUrl, param, title, pathName } = props
	const searchParams = useSearchParams()

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(name, value)

			return params.toString()
		},
		[searchParams]
	)

	return (
		<>
			<Link href={pathName + '?' + createQueryString(pathUrl, param)}>{title}</Link>
		</>
	)
}
