
const RESOURCES = [
	{ name: 'api_credential', api: 'api_credentials', model: 'ApiCredential' },
	{ name: 'application_membership', api: 'application_memberships', model: 'ApplicationMembership' },
	{ name: 'membership', api: 'memberships', model: 'Membership' },
	{ name: 'organization', api: 'organizations', model: 'Organization' },
	{ name: 'permission', api: 'permissions', model: 'Permission' },
	{ name: 'role', api: 'roles', model: 'Role' },
	{ name: 'user', api: 'user', model: 'User', singleton: true },
	{ name: 'version', api: 'versions', model: 'Version' },
] as const



export default RESOURCES
