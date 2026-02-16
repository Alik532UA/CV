import { ExperienceDataSchema, type ExperienceData } from "./schemas";

const rawExperience: ExperienceData = {
    it: [
        {
            id: "intellias",
            date: "12/2021 - Present",
            company: "Intellias (Digitally Inspired Ltd)",
            roleKey: "intellias_role",
            descKey: "intellias_desc"
        },
        {
            id: "absoft",
            date: "06/2021 - 12/2021",
            company: "AB Soft",
            roleKey: "absoft_role",
            descKey: "absoft_desc"
        },
        {
            id: "singree",
            date: "08/2017 – 09/2017",
            company: "Singree (IT Company)",
            roleKey: "singree_role",
            descKey: "singree_desc"
        }
    ],
    nonIT: [
        {
            id: "unicorn",
            date: "07/2019 – 06/2021",
            company: "UNICORN MEDIA",
            roleKey: "unicorn_role",
            descKey: "unicorn_desc"
        },
        {
            id: "nutduet",
            date: "06/2014 – 03/2020",
            company: "LEADERS 'NUT DUET'",
            roleKey: "nutduet_role",
            descKey: "nutduet_desc"
        },
        {
            id: "channel7",
            date: "11/2017 – 07/2019",
            company: "Channel 7 Odesa",
            roleKey: "channel7_role",
            descKey: "channel7_desc"
        },
        {
            id: "krug",
            date: "09/2017 – 11/2017",
            company: "Channel 'KRUG' Odesa",
            roleKey: "krug_role",
            descKey: "krug_desc"
        },
        {
            id: "theater",
            date: "02/2012 – 09/2015",
            company: "CHILDREN'S THEATER SCHOOL",
            roleKey: "theater_role",
            descKey: "theater_desc"
        }
    ]
};

export const experienceData = ExperienceDataSchema.parse(rawExperience);
