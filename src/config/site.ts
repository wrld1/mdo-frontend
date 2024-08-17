export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Система менеджменту", //change later
  description:
    "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.", //change later
  // url: "https://ui.shadcn.com", //change later
  mainNav: [
    {
      title: "Home",
      linkName: "",
      href: "/",
    },
    {
      title: "Про нас",
      linkName: "about",
      href: "/about",
    },
    {
      title: "Для кого",
      linkName: "forWhom",
      href: "/for-whom",
    },
    {
      title: "Тарифи",
      linkName: "rates",
      href: "/rates",
    },
    {
      title: "Блог",
      linkName: "blog",
      href: "/blog",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};
