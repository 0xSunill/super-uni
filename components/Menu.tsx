import {
  Home,
  Users,
  GraduationCap,
  User,
  BookOpen,
  School,
  BookText,
  FileSpreadsheet,
  ClipboardList,
  BarChart,
  Calendar,
  MessageCircle,
  Megaphone
} from "lucide-react"

const menuItems = [
  {
    title: "Menu",
    items: [
      {
        icon: Home,
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: Users,
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: GraduationCap,
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      // {
      //   icon: User,
      //   label: "Parents",
      //   href: "/list/parents",
      //   visible: ["admin", "teacher"],
      // },
      {
        icon: BookOpen,
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: School,
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      // {
      //   icon: BookText,
      //   label: "Lessons",
      //   href: "/list/lessons",
      //   visible: ["admin", "teacher"],
      // },
      {
        icon: FileSpreadsheet,
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: ClipboardList,
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: BarChart,
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: Users,
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      // {
      //   icon: Calendar,
      //   label: "Events",
      //   href: "/list/events",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: MessageCircle,
      //   label: "Messages",
      //   href: "/list/messages",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      {
        icon: Megaphone,
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ]
  }
]

const Menu = () => {
  return (
    <div>
      {menuItems.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="px-3 hidden lg:block text-xs font-semibold uppercase tracking-wider mb-3">
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium  hover:bg-gray-300 dark:hover:bg-gray-800 rounded-md"
                >
                  <Icon className="w-5 h-5 " />
                  <span className="hidden ml-3 lg:block">{item.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Menu
