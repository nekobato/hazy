// chat以外は権利をいただく
// ref: https://github.com/misskey-dev/misskey/blob/develop/packages/misskey-js/src/consts.ts
export const hazyMisskeyPermissions: string[] = [
  "read:account",
  "write:account",
  "read:blocks",
  "write:blocks",
  "read:drive",
  "write:drive",
  "read:favorites",
  "write:favorites",
  "read:following",
  "write:following",
  // chatは見ないよ
  // 'read:messaging',
  // 'write:messaging',
  "read:mutes",
  "write:mutes",
  "write:notes",
  "read:notifications",
  "write:notifications",
  "read:reactions",
  "write:reactions",
  "write:votes",
  "read:pages",
  "write:pages",
  "write:page-likes",
  "read:page-likes",
  "read:user-groups",
  "write:user-groups",
  "read:channels",
  "write:channels",
  "read:gallery",
  "write:gallery",
  "read:gallery-likes",
  "write:gallery-likes",
  "read:flash",
  "write:flash",
  "read:flash-likes",
  "write:flash-likes",
];

export const hazyMisskeyPermissionString = () => {
  return hazyMisskeyPermissions.join(",");
};
