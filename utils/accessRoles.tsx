type Role = 'admin' | 'employee' | 'order'

export const getRole = (pathname: string): Role[] => {
	const roleMappings: Record<string, Role[]> = {
		'/admin': ['admin'],
		'/employee': ['employee'],
		'/order': ['order'],
	}

	for (const [path, roles] of Object.entries(roleMappings)) {
		if (pathname.startsWith(path)) {
			return roles
		}
	}

	return []
}
