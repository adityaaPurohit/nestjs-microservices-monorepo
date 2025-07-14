export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export const UserRoleHierarchy = {
  [UserRole.ADMIN]: 3,
  [UserRole.EDITOR]: 2,
  [UserRole.VIEWER]: 1,
};

export const UserRolePermissions = {
  [UserRole.ADMIN]: [
    'read',
    'write',
    'delete',
    'manage_users',
    'manage_documents',
    'trigger_ingestion',
  ],
  [UserRole.EDITOR]: ['read', 'write', 'delete', 'manage_documents'],
  [UserRole.VIEWER]: ['read'],
};
