// components/Menu.tsx
import { role } from "@/data";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  School,
  FileSpreadsheet,
  ClipboardList,
  BarChart,
  Megaphone,
  Wallet,
  User,
  Settings,
  LogOut,
} from "lucide-react";

type Item = {
  icon: any;
  label: string;
  href: string;
  visible?: string[];
  smallScreen?: boolean;
};

const menuItems = [
  {
    title: "Menu",
    items: [
      { icon: Home, label: "Home", href: "/", visible: ["admin", "teacher", "student", "parent"], smallScreen: false },
      { icon: Users, label: "Teachers", href: "/list/teachers", visible: ["admin", "teacher"] },
      { icon: GraduationCap, label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: BookOpen, label: "Subjects", href: "/list/subjects", visible: ["admin"] },
      { icon: School, label: "Classes", href: "/list/classes", visible: ["admin", "teacher"] },
      { icon: FileSpreadsheet, label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student", "parent"] },
      { icon: ClipboardList, label: "Assignments", href: "/list/assignments", visible: ["admin", "teacher", "student", "parent"] },
      { icon: BarChart, label: "Results", href: "/list/results", visible: ["admin", "teacher", "student", "parent"] },
      { icon: Users, label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher", "student", "parent"] },
      { icon: Megaphone, label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
      { icon: Wallet, label: "Wallet", href: "/list/wallet", visible: ["admin", "student"], smallScreen: false },
    ],
  },
];

const otherItems = [
  {
    title: "Other",
    items: [
      { icon: User, label: "Profile", href: "/profile" },
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: LogOut, label: "Logout", href: "/logout" },
    ],
  },
];

interface MenuProps {
  labelsVisible?: boolean; // when true, show labels (useful inside mobile drawer)
}

const Menu: React.FC<MenuProps> = ({ labelsVisible = false }) => {
  return (
    <div className="w-full">
      {menuItems.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className={`px-3 ${labelsVisible ? "block" : "hidden lg:block"} text-xs font-semibold uppercase tracking-wider mb-3`}>
            {section.title}
          </h2>

          <div className="space-y-1">
            {section.items.map((item: any) => {
              const visible = !item.visible || item.visible.includes(role);
              if (!visible) return null;
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ${labelsVisible ? "justify-start" : "justify-center lg:justify-start"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {/* label shown either when labelsVisible=true (drawer) OR on lg screens */}
                  <span className={`${labelsVisible ? "ml-3 block" : "hidden ml-3 lg:block"}`}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}

      {otherItems.map((section) => (
        <div key={section.title} className=" hidden lg:block mb-6">
          <h2 className={`px-3 ${labelsVisible ? "block" : "hidden lg:block"} text-xs font-semibold uppercase tracking-wider mb-3`}>
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ${labelsVisible ? "justify-start" : "justify-center lg:justify-start"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className={`${labelsVisible ? "ml-3 block" : "hidden ml-3 lg:block"}`}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
