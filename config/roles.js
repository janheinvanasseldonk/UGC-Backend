const permissions = {
  CREATE_REQUESTS: "createRequests",
  GET_REQUESTS: "getRequests",
  UPDATE_REQUESTS: "updateRequests",
  DELETE_REQUESTS: "deleteRequests",
};

const allRoles = {
  admin: [
    permissions.CREATE_REQUESTS,
    permissions.GET_REQUESTS,
    permissions.UPDATE_REQUESTS,
    permissions.DELETE_REQUESTS,
  ],
  user: [
    permissions.CREATE_REQUESTS,
    permissions.GET_REQUESTS,
    permissions.UPDATE_REQUESTS,
  ],
  creator: [
    permissions.CREATE_REQUESTS,
    permissions.GET_REQUESTS,
    permissions.UPDATE_REQUESTS,
  ],
  company: [
    permissions.CREATE_REQUESTS,
    permissions.GET_REQUESTS,
    permissions.UPDATE_REQUESTS,
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
  permissions,
};
