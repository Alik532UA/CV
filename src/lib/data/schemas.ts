import { z } from 'zod';

/**
 * Schema for a single Skill.
 */
export const SkillSchema = z.object({
    id: z.string(),
    level: z.number().min(0).max(100),
    icon: z.any() 
});

/**
 * Schema for a single Experience item.
 */
export const ExperienceItemSchema = z.object({
    id: z.string(),
    date: z.string(),
    company: z.string(),
    roleKey: z.string(), // Key for translations
    descKey: z.string()  // Key for translations
});

/**
 * Schema for a single Education item.
 */
export const EducationItemSchema = z.object({
    id: z.string(),
    institutionKey: z.string(),
    date: z.string(),
    descKey: z.string()
});

/**
 * Schema for the entire Skills Data object.
 */
export const SkillsDataSchema = z.object({
    it: z.array(SkillSchema),
    design3d: z.array(SkillSchema),
    video: z.array(SkillSchema),
    tools: z.array(SkillSchema)
});

/**
 * Schema for the entire Experience Data object.
 */
export const ExperienceDataSchema = z.object({
    it: z.array(ExperienceItemSchema),
    nonIT: z.array(ExperienceItemSchema)
});

export type Skill = z.infer<typeof SkillSchema>;
export type SkillsData = z.infer<typeof SkillsDataSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type ExperienceData = z.infer<typeof ExperienceDataSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
