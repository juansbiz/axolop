const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
};

const DEFAULT_LANGUAGE = 'en';

const isLanguageSupported = (lang) => {
  return Object.keys(SUPPORTED_LANGUAGES).includes(lang);
};

export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isLanguageSupported,
};
