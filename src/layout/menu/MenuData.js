const menu = [
  {
    icon: "growth",
    text: "Analytics Dashboard",
    link: "/",
  },
  {
    heading: "Pages",
  },
  {
    icon: "tile-thumb",
    text: "Projects",
    active: false,
    subMenu: [
      {
        text: "Project Cards",
        link: "/project-card",
      },
      {
        text: "Project List",
        link: "/project-list",
      },
    ],
  },
  {
    icon: "users",
    text: "User Manage",
    active: false,
    subMenu: [
      {
        text: "User List",
        link: "/user-list-compact",
      },
    ],
  },
  {
    icon: "home",
    text: "Rooms",
    active: false,
    link: "/rooms",
  },
  {
    icon: "bookmark",
    text: "Categories",
    active: false,
    link: "/categories",
  },
];
export default menu;
