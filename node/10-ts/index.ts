// enum not supported in type stripping
enum Role {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

class User {
  // parameter properties not supported in type stripping
  constructor(
    public id: number,
    public name: string,
    public role: Role,
  ) { }

  describe(): string {
    return `#${this.id} ${this.name} (${this.role})`;
  }
}

// namespace not supported in type stripping
namespace Permissions {
  export const byRole: Record<Role, string[]> = {
    [Role.Admin]: ["read", "write", "delete"],
    [Role.Editor]: ["read", "write"],
    [Role.Viewer]: ["read"],
  };

  export function can(role: Role, action: string): boolean {
    return byRole[role].includes(action);
  }
}

const users: User[] = [
  new User(1, "Ada", Role.Admin),
  new User(2, "Grace", Role.Editor),
  new User(3, "Linus", Role.Viewer),
];

console.log("tsx full TypeScript demo");
console.log(users.map((user) => user.describe()).join("\n"));
console.log("Editor can delete:", Permissions.can(Role.Editor, "delete"));
console.log("Admin can delete:", Permissions.can(Role.Admin, "delete"));
