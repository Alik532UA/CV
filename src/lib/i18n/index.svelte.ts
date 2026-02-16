import { z } from 'zod';
import { en } from './locales/en';
import { uk } from './locales/uk';

export type Language = 'en' | 'uk';

class LanguageState {
    current = $state<Language>('en');
    isChanging = $state(false);
    
    set(lang: Language) {
        if (this.current === lang) return;
        
        this.isChanging = true;
        
        setTimeout(() => {
            this.current = lang;
            setTimeout(() => {
                this.isChanging = false;
            }, 50);
        }, 200);
    }
}

export const language = new LanguageState();

const TranslationSchema = z.object({
    lastUpdate: z.string(),
    title: z.array(z.string()),
    title_mobile: z.string(),
    nav: z.object({
        about: z.string(),
        experience: z.string(),
        education: z.string(),
        skills: z.string(),
        projects: z.string(),
        additional: z.string(),
        contact: z.string()
    }),
    hero: z.object({
        greeting: z.string(),
        description: z.string(),
        contactMe: z.string(),
        downloadCV: z.string()
    }),
    about: z.object({
        title: z.string(),
        location: z.string(),
        content: z.string(),
        hobbiesTitle: z.string()
    }),
    experience: z.object({
        title: z.string(),
        showNonIT: z.string(),
        hideNonIT: z.string(),
        present: z.string(),
        it: z.array(z.object({
            date: z.string(),
            company: z.string(),
            role: z.string(),
            desc: z.string()
        })),
        nonIT: z.array(z.object({
            date: z.string(),
            company: z.string(),
            role: z.string(),
            desc: z.string()
        }))
    }),
    education: z.object({
        title: z.string(),
        items: z.array(z.object({
            institution: z.string(),
            date: z.string(),
            desc: z.string()
        }))
    }),
    skills: z.object({
        title: z.string(),
        showMore: z.string(),
        hideMore: z.string(),
        platforms: z.object({
            desktop: z.string(),
            web: z.string(),
            mobile: z.string()
        }),
        categories: z.object({
            it: z.string(),
            design3d: z.string(),
            video: z.string(),
            tools: z.string()
        }),
        items: z.record(z.string(), z.string())
    }),
    other: z.object({
        title: z.string(),
        iq: z.string(),
        olympics: z.string(),
        driver: z.string(),
        languages: z.object({
            title: z.string(),
            uk: z.string(),
            en: z.string(),
            ru: z.string()
        }),
        hobbies: z.array(z.string())
    }),
    projects: z.object({
        slovko: z.object({
            title: z.string(),
            description: z.string(),
            button: z.string()
        }),
        mindstep: z.object({
            title: z.string(),
            description: z.string(),
            button: z.string()
        }),
        cv3d: z.object({
            title: z.string(),
            description: z.string(),
            button: z.string()
        })
    }),
    pdf_modal: z.object({
        title: z.string(),
        dark: z.string(),
        light: z.string()
    })
});

export type Translations = z.infer<typeof TranslationSchema>;

export const translations: Record<Language, Translations> = { en, uk };
