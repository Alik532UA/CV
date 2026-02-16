import { EducationItemSchema, type EducationItem } from "./schemas";
import { z } from "zod";

const EducationDataSchema = z.array(EducationItemSchema);

const rawEducation = [
    {
        id: "polytech",
        institutionKey: "polytech_name",
        date: "2012 – 2017",
        descKey: "polytech_desc"
    },
    {
        id: "theater_school",
        institutionKey: "theater_school_name",
        date: "2006 – 2013",
        descKey: "theater_school_desc"
    }
];

export const educationData = EducationDataSchema.parse(rawEducation);
