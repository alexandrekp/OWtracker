import type { HeroRole } from "../types/hero";

type RoleFilterProps = {
  activeRole: "All" | HeroRole;
  onChange: (role: "All" | HeroRole) => void;
};

const roles: Array<"All" | HeroRole> = [
  "All",
  "Tank",
  "Damage",
  "Support",
];

function RoleFilter({ activeRole, onChange }: RoleFilterProps) {
  return (
    <div className="role-filters">
      {roles.map((role) => (
        <button
          key={role}
          className={
            activeRole === role
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() => onChange(role)}
        >
          {role}
        </button>
      ))}
    </div>
  );
}

export default RoleFilter;