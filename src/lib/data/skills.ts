import {
    Bot,
    Zap,
    Coffee,
    Drama,
    Palette,
    Printer,
    Box,
    Gamepad2,
    Film,
    Brush,
    Mic,
    Sparkles,
    BarChart,
    Folder,
    Flame
} from "lucide-svelte";
import { SkillsDataSchema, type SkillsData } from "./schemas";

const rawData = {
    it: [
        { id: "ai", level: 95, icon: Bot },
        { id: "csharp", level: 85, icon: Zap },
        { id: "java", level: 75, icon: Coffee },
        { id: "playwright", level: 80, icon: Drama },
    ],
    design3d: [
        { id: "blender", level: 60, icon: Palette },
        { id: "slicer", level: 85, icon: Printer },
        { id: "printing", level: 90, icon: Box },
        { id: "godot", level: 75, icon: Gamepad2 },
    ],
    video: [
        { id: "premiere", level: 95, icon: Film },
        { id: "photoshop", level: 85, icon: Brush },
        { id: "topaz", level: 80, icon: Sparkles },
        { id: "vmix", level: 85, icon: Mic },
    ],
    tools: [
        { id: "jira", level: 95, icon: BarChart },
        { id: "git", level: 85, icon: Folder },
        { id: "figma", level: 80, icon: Palette },
        { id: "firebase", level: 65, icon: Flame },
    ],
};

/**
 * Validated skills data.
 * Throws an error during development if the structure is invalid.
 */
export const skillsData: SkillsData = SkillsDataSchema.parse(rawData);
