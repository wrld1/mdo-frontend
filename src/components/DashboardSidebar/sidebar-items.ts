import { CompanyWithAccess } from "@/types/interfaces/company";
import { LucideIcon } from "lucide-react";
import {
  AudioWaveform,
  BookOpen,
  CircleGauge,
  Command,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Shield,
} from "lucide-react";

interface SidebarCompany {
  name: string;
  logo: LucideIcon;
  plan: string;
  companyId: string;
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavLink {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarData {
  companies: SidebarCompany[];
  navAdmin: NavItem[];
  navMain: NavItem[];
  navLinks: NavLink[];
}

export const generateSidebarData = (
  companiesWithAccess: CompanyWithAccess[],
  companyId: string
): SidebarData => {
  return {
    companies: companiesWithAccess.map((company) => ({
      name: company.company.name,
      logo: Command,
      plan:
        company.accessLevel === "ADMIN"
          ? "Адміністратор"
          : company.accessLevel === "MANAGER"
          ? "Менеджер"
          : "Мешканець",
      companyId: company.company.id,
    })),

    navAdmin: [
      {
        title: "Модерація",
        url: "#",
        icon: Shield,
        isActive: true,
        items: [
          {
            title: "Список компаній",
            url: "/dashboard/admin/companies-list",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
    ],
    navMain: [
      {
        title: "Лічильники",
        url: "#",
        icon: CircleGauge,
        isActive: true,
        items: [
          {
            title: "Показники лічильників",
            url: "#",
          },
          {
            title: "Індивідуальні лічильники",
            url: "#",
          },
          {
            title: "Загальнобудинкові лічильники",
            url: "#",
          },
          {
            title: "Статті нарахувань",
            url: `/dashboard/${companyId}/services-tariffs`,
          },
        ],
      },
      {
        title: "Звіти",
        url: "#",
        icon: FileText,
        items: [
          {
            title: "Звіт по статтях нарахувань",
            url: "#",
          },
          {
            title: "Фінансовий звіт",
            url: "#",
          },
          {
            title: "Оборотно-сальдова відомість",
            url: "#",
          },
          {
            title: "Акт звірки з власником",
            url: "#",
          },
          {
            title: "Звіт про надходження",
            url: "#",
          },
          {
            title: "Загальна відомість",
            url: "#",
          },
          {
            title: "Звіти до державних органів",
            url: "#",
          },
        ],
      },
      {
        title: "Об'єкти",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Зареєстровані об'єкти",
            url: `/dashboard/${companyId}/objects`,
          },
          {
            title: "Підключення статей нарахувань",
            url: `/dashboard/${companyId}/services-tariffs/create`,
          },
          {
            title: "Показники лічильників",
            url: "#",
          },
        ],
      },
      {
        title: "Налаштування",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    navLinks: [
      {
        name: "Заявки",
        url: `/dashboard/${companyId}/orders`,
        icon: Frame,
      },
      // {
      //   name: "Sales & Marketing",
      //   url: "#",
      //   icon: PieChart,
      // },
      // {
      //   name: "Travel",
      //   url: "#",
      //   icon: Map,
      // },
    ],
  };
};
