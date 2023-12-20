// Onboarding.js
import { Image } from 'antd'
import { motion } from 'framer-motion'

const Onboarding: React.FC = () => {
	const variants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0 },
	}

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={variants}
			transition={{ duration: 1 }}
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<h1>Chào mừng đến với gold coffee</h1>
			<p>Vui lòng quét QR tại bàn để đặt món online nhé.!</p>
			<Image
				width={'40%'}
				height={150}
				alt="logo"
				src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/QR_GIF.gif`}
			/>
		</motion.div>
	)
}

export default Onboarding
