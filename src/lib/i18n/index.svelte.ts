import { z } from 'zod';
import { en } from './locales/en';
import { uk } from './locales/uk';
import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';

export type Language = 'en' | 'uk';

class LanguageState {
    current = $state<Language>('en');
    isChanging = $state(false);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const lang = params.get('lang') as Language;
            if (lang === 'en' || lang === 'uk') {
                this.current = lang;
            } else {
                const saved = localStorage.getItem('lang') as Language;
                if (saved === 'en' || saved === 'uk') {
                    this.current = saved;
                }
            }
            
            // Sync HTML lang attribute
            document.documentElement.lang = this.current;

            // Sync to URL reactively using native history API
            $effect.root(() => {
                $effect(() => {
                    const lang = this.current;
                    const url = new URL(window.location.href);
                    
                    // Sync HTML lang attribute reactively
                    document.documentElement.lang = lang;

                    if (url.searchParams.get('lang') !== lang) {
                        url.searchParams.set('lang', lang);
                        replaceState(url.toString(), {});
                    }
                });
            });
        }
    }
    
    set(lang: Language) {
        if (this.current === lang) return;
        
        this.isChanging = true;
        
        setTimeout(() => {
            this.current = lang;
            if (browser) {
                localStorage.setItem('lang', lang);
                document.documentElement.lang = lang;
            }
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
        roles: z.record(z.string(), z.string()),
        descriptions: z.record(z.string(), z.string())
    }),
    education: z.object({
        title: z.string(),
        institutions: z.record(z.string(), z.string()),
        descriptions: z.record(z.string(), z.string())
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

/**
 * Global reactive translations object.
 * Uses getters to maintain reactivity across components.
 */
export const t = {
    get lastUpdate() { return translations[language.current].lastUpdate; },
    get title() { return translations[language.current].title; },
    get title_mobile() { return translations[language.current].title_mobile; },
    get nav() { return translations[language.current].nav; },
    get hero() { return translations[language.current].hero; },
    get about() { return translations[language.current].about; },
    get experience() { return translations[language.current].experience; },
    get education() { return translations[language.current].education; },
    get skills() { return translations[language.current].skills; },
    get other() { return translations[language.current].other; },
    get projects() { return translations[language.current].projects; },
    get pdf_modal() { return translations[language.current].pdf_modal; }
};
