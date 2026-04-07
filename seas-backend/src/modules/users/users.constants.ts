export const USER_MESSAGES = {
  NOT_FOUND: 'User not found',
  ALREADY_ACTIVE: 'User is already active',
  ALREADY_INACTIVE: 'User is already inactive',
  DELETED: 'User deleted successfully',
  ACTIVATED: 'User activated successfully',
  DEACTIVATED: 'User deactivated successfully',
  UPDATED: 'User updated successfully',
} as const;

export const USER_SEARCH_FIELDS = ['email', 'firstName', 'lastName', 'phone'] as const;

export default { USER_MESSAGES, USER_SEARCH_FIELDS };