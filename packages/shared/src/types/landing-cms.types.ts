export interface LandingThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string; // 'rounded-xl', 'rounded-2xl', 'rounded-3xl'
  enableAnimations: boolean;
}

export interface LandingSeoConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface LandingNavbarLink {
  label: string;
  href: string;
  isExternal?: boolean;
  order: number;
  isVisible: boolean;
}

export interface LandingNavbarConfig {
  brandName: string;
  logoUrl?: string;
  links: LandingNavbarLink[];
  ctaButtonText: string;
  ctaButtonLink: string;
  showCtaButton: boolean;
}

export interface LandingFooterColumn {
  title: string;
  links: Array<{ label: string; href: string; isExternal?: boolean }>;
}

export interface LandingFooterConfig {
  brandName: string;
  tagline: string;
  copyrightText: string;
  columns: LandingFooterColumn[];
  socialLinks: Array<{ platform: string; url: string; icon: string }>;
}

export interface HeroBackgroundConfig {
  type: 'image' | 'gradient' | 'color';
  url: string;
  opacity: number; // 0 to 1
  overlayGradient: string;
}

export interface HeroCtaButton {
  text: string;
  action: 'modal_application' | 'modal_quiz' | 'modal_video' | 'link';
  targetUrl?: string;
  variant: 'primary' | 'secondary' | 'outline';
  isVisible: boolean;
}

export interface HeroSectionConfig {
  badgeText: string;
  headlineMain: string;
  headlineGradient: string;
  ppoDefinition: string;
  description: string;
  background: HeroBackgroundConfig;
  featureBadges: Array<{ title: string; subtitle: string; icon: string }>;
  ctaButtons: HeroCtaButton[];
  showcases: Array<{
    id: string;
    trackName: string;
    curriculum: string;
    badgeInitial: string;
    badgeColor: string;
    progress: number;
    activeStep?: number;
    currentStage: string;
    currentStageDesc: string;
    modules: string;
    projects: string;
    tests: string;
    stipend: string;
    ppoTarget: string;
  }>;
}

export interface JourneyStepItem {
  stepNumber: string;
  title: string;
  description: string;
  badgeColor: string;
  icon: string;
}

export interface JourneySectionConfig {
  tag: string;
  title: string;
  subtitle: string;
  linkText: string;
  linkUrl: string;
  steps: JourneyStepItem[];
  featurePills: Array<{ icon: string; title: string; desc: string }>;
}

export interface WhyUsCardItem {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

export interface WhyUsSectionConfig {
  tag: string;
  title: string;
  subtitle: string;
  cards: WhyUsCardItem[];
  storyLinkText: string;
  storyLinkUrl: string;
}

export interface FeatureCardItem {
  icon: string;
  title: string;
  description: string;
  linkUrl: string;
  iconBg: string;
  iconColor: string;
}

export interface FeaturesSectionConfig {
  tag: string;
  headlineMain: string;
  headlineGradient: string;
  cards: FeatureCardItem[];
  cursiveText: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  linkText?: string;
  linkUrl?: string;
}

export interface FaqSectionConfig {
  tag: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
  helpLinkText: string;
  helpLinkUrl: string;
}

export interface NewsletterSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
}

export interface EqualOpportunitySectionConfig {
  title: string;
  description: string;
  buttonText: string;
}

export interface DualTargetSectionConfig {
  studentCard: {
    tag: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    sublinkText: string;
    sublinkUrl: string;
  };
  companyCard: {
    tag: string;
    title: string;
    description: string;
    buttonText: string;
    sublinkText: string;
    sublinkUrl: string;
  };
}

export interface StickyCtaConfig {
  title: string;
  badge: string;
  subtitle: string;
  buttonText: string;
  isVisible: boolean;
}

export interface SectionMeta {
  id: string;
  name: string;
  order: number;
  isVisible: boolean;
}

export interface LandingPageConfig {
  _id?: string;
  version: number;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: string;
  lastEditedBy?: string;
  updatedAt?: string;
  theme: LandingThemeConfig;
  seo: LandingSeoConfig;
  navbar: LandingNavbarConfig;
  footer: LandingFooterConfig;
  sectionsMeta: SectionMeta[];
  hero: HeroSectionConfig;
  journey: JourneySectionConfig;
  whyUs: WhyUsSectionConfig;
  features: FeaturesSectionConfig;
  equalOpportunity: EqualOpportunitySectionConfig;
  dualTarget: DualTargetSectionConfig;
  faq: FaqSectionConfig;
  newsletter: NewsletterSectionConfig;
  stickyCta: StickyCtaConfig;
}

export interface MediaAssetItem {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string;
  uploadedBy?: string;
  createdAt: string;
}

export interface LandingRevisionItem {
  _id: string;
  version: number;
  notes?: string;
  publishedBy?: string;
  publishedAt: string;
  config: LandingPageConfig;
}
