"use client";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

type NavItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  onClick?: () => void;
  visible?: string[];
  smallScreen?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const menuItems: NavSection[] = [
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

const otherItems: NavSection[] = [
  {
    title: "Other",
    items: [
      { icon: User, label: "Profile", href: "/profile" }, // ← we'll override this dynamically
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: LogOut, label: "Logout" },
    ],
  },
];

interface MenuProps {
  labelsVisible?: boolean;
}

const Menu: React.FC<MenuProps> = ({ labelsVisible = false }) => {
  const router = useRouter();
  const [studentRollNo, setStudentRollNo] = React.useState<string | null>(null);

  // Read studentRollNo cookie (non-HTTP-only)
  React.useEffect(() => {
    const match = document.cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("studentRollNo="));

    if (match) {
      const val = decodeURIComponent(match.split("=")[1] || "");
      setStudentRollNo(val);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  };

  // Dynamically build "Profile" link
  const resolvedOtherItems = React.useMemo<NavSection[]>(() => {
    return otherItems.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        if (item.label === "Logout") {
          return { ...item, onClick: handleLogout };
        }
        if (item.label === "Profile") {
          const href = studentRollNo ? `/${studentRollNo}/profile` : "/login";
          return { ...item, href };
        }
        return item;
      }),
    }));
  }, [studentRollNo]);

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const common =
      `flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ` +
      (labelsVisible ? "justify-start" : "justify-center lg:justify-start");

    if (item.onClick && !item.href) {
      return (
        <button key={item.label} onClick={item.onClick} className={common}>
          <Icon className="w-5 h-5" />
          <span className={`${labelsVisible ? "ml-3 block" : "hidden ml-3 lg:block"}`}>
            {item.label}
          </span>
        </button>
      );
    }

    return (
      <Link key={item.label} href={item.href ?? "#"} className={common}>
        <Icon className="w-5 h-5" />
        <span className={`${labelsVisible ? "ml-3 block" : "hidden ml-3 lg:block"}`}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="w-full">
      {menuItems.map((section) => (
        <div key={section.title} className="mb-6">
          <h2
            className={`px-3 ${labelsVisible ? "block" : "hidden lg:block"} text-xs font-semibold uppercase tracking-wider mb-3`}
          >
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.items.map((item) => renderItem(item))}
          </div>
        </div>
      ))}

      {resolvedOtherItems.map((section) => (
        <div key={section.title} className="hidden lg:block mb-6">
          <h2
            className={`px-3 ${labelsVisible ? "block" : "hidden lg:block"} text-xs font-semibold uppercase tracking-wider mb-3`}
          >
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.items.map((item) => renderItem(item))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
