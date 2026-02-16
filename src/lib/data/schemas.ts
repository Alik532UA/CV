import { z } from 'zod';

/**
 * Schema for a single Skill.
 * Icon is expected to be a Svelte component (Lucide icon).
 */
export const SkillSchema = z.object({
    id: z.string(),
    level: z.number().min(0).max(100),
    icon: z.any() // Icons are components, hard to validate strictly with Zod
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

export type Skill = z.infer<typeof SkillSchema>;
export type SkillsData = z.infer<typeof SkillsDataSchema>;
