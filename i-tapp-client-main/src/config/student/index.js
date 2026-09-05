import { id } from "date-fns/locale";

export const nav_links = [
  { href: "find-it-space", text: "Find IT space" },
  { href: "my-it-space", text: "My IT space" },
  { href: "my-application", text: "My Application" },
  { href: "saved-application", text: "Saved Application" },
  ,
];
export const filters = {
  duration: [
    { id: 1, time: "3", checked: false },
    { id: 2, time: "6", checked: false },
    { id: 3, time: "12", checked: false },
  ],
  status: [
    { id: 1, status: "open", checked: true },
    { id: 2, status: "closed", checked: false },
  ],
  location: "",
  industry: [
    { id: 1, industry: "engineering", checked: false },
    { id: 2, industry: "science", checked: false },
    { id: 3, industry: "art", checked: false },
    { id: 4, industry: "it/technology", checked: false },
  ],
};
