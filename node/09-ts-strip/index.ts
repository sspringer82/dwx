type User = {
  id: number;
  name: string;
  active: boolean;
};

function formatUser(user: User): string {
  return `#${user.id} ${user.name} (${user.active ? "active" : "inactive"})`;
}

const users: User[] = [
  { id: 1, name: "Ada", active: true },
  { id: 2, name: "Grace", active: false },
];

console.log("Node type stripping demo");
console.log(users.map(formatUser).join("\n"));

/*
Uncommenting this enum will fail with Node type stripping because enums
require TypeScript transpilation instead of pure type erasure.

enum Role {
  Admin,
  User,
}

console.log(Role.Admin);
*/
