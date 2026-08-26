export const SITE = {
  website: "https://www.darrelltw.com/", // replace this with your deployed domain
  author: "Darrell",
  profile: "https://www.darrelltw.com/",
  desc: "MarTech 自動化 & n8n 教學",
  title: "Darrell TW",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 20,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/Darrellwan/darrelltw-blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-TW", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Taipei", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
