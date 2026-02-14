import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

const i18n = createI18n({
    locale: 'es', // set locale
    fallbackLocale: 'es', // set fallback locale
    messages: {
        es,
        en
    }
});

export default i18n;
