
const RESOURCES = [
	{ name: 'api_credential', type: 'api_credentials', api: 'api_credentials', model: 'ApiCredential' },
	{ name: 'application_membership', type: 'application_memberships', api: 'application_memberships', model: 'ApplicationMembership' },
	{ name: 'identity_provider', type: 'identity_providers', api: 'identity_providers', model: 'IdentityProvider' },
	{ name: 'membership', type: 'memberships', api: 'memberships', model: 'Membership' },
	{ name: 'membership_profile', type: 'membership_profiles', api: 'membership_profiles', model: 'MembershipProfile' },
	{ name: 'organization', type: 'organizations', api: 'organizations', model: 'Organization' },
	{ name: 'permission', type: 'permissions', api: 'permissions', model: 'Permission' },
	{ name: 'role', type: 'roles', api: 'roles', model: 'Role' },
	{ name: 'user', type: 'users', api: 'user', model: 'User', singleton: true },
	{ name: 'version', type: 'versions', api: 'versions', model: 'Version' },
] as const



export default RESOURCES
