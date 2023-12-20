import React, { useState } from 'react'
import { Button, Image } from 'antd'
import { UserSwitchOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Onboarding from '@/components/onboardAnimation/onboarding '
const App: React.FC = () => {
	const [navigateRole, setNavigateRole] = useState()
	const [loading, setLoading] = useState(false)
	const [onboardAnimation, setOnboardAnimation] = useState(false)
	const handleClick = () => {
		setOnboardAnimation(!onboardAnimation)
	}
	return (
		<>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
					flexDirection: 'column',
					gap: '10px',
				}}
			>
				{onboardAnimation ? (
					<>
						<Onboarding />{' '}
						<Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => handleClick()}>
							Quay lại
						</Button>
					</>
				) : null}
				{!onboardAnimation ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '10px',
						}}
					>
						<Image
							width={50}
							height={50}
							style={{ borderRadius: '50px', objectFit: 'cover' }}
							alt="logo"
							src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/Logo.png`}
						/>
						<h2>GOLD COFFEE</h2>
						<Button icon={<UserSwitchOutlined />}>
							<Link href={process.env.NEXT_PUBLIC_HOST_CLIENT + '/employee'}>Nhân viên</Link>
						</Button>
						<Button type="default" icon={<UserSwitchOutlined />}>
							<Link href={process.env.NEXT_PUBLIC_HOST_CLIENT + '/admin'}>Admin</Link>
						</Button>
						{/* </>
			)} */}
						<Button type="primary" icon={<UserSwitchOutlined />} onClick={() => handleClick()}>
							Đặt món
						</Button>
					</div>
				) : null}
			</div>
		</>
	)
}

export default App
