import { config, fields, singleton } from '@keystatic/core';

/*
 * This file defines the editable fields a content editor sees in the
 * admin panel at /keystatic. Nobody editing content needs to read this —
 * it's the map between the friendly forms and the website.
 *
 * storage.kind = 'local'  -> edits save to files on this computer (preview mode).
 * To let a team edit in the cloud later, switch this to Keystatic Cloud
 * or GitHub (see README).
 */
export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'The Human Company' },
  },
  singletons: {
    // Site-wide chrome: the bits that appear on every page. Kept separate from
    // Homepage so an editor renaming a section can also fix the menu that
    // points at it, in one place.
    site: singleton({
      label: 'Site & Navigation',
      path: 'src/content/site/',
      format: { data: 'json' },
      schema: {
        // ---------- SEARCH / SOCIAL ----------
        siteTitle: fields.text({
          label: 'Browser tab title',
          validation: { length: { min: 1 } },
        }),
        metaDescription: fields.text({
          label: 'Search-result description',
          description: 'Shown under the link on Google. Aim for 140–160 characters.',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        socialImage: fields.image({
          label: 'Social share image',
          description: 'Shown when the site is shared on WhatsApp, LinkedIn etc. 1200x630px works best.',
          directory: 'public/images',
          publicPath: '/images/',
        }),

        // ---------- NAVIGATION ----------
        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Menu label' }),
            href: fields.text({ label: 'Link', description: 'e.g. #company' }),
          }),
          { label: 'Menu links', itemLabel: (p) => p.fields.label.value || 'Link' }
        ),
        navCtaLabel: fields.text({ label: 'Menu button label' }),
        navCtaHref: fields.text({ label: 'Menu button link' }),
        scrollLabel: fields.text({ label: 'Scroll hint word' }),

        // ---------- FOOTER ----------
        footerCompanyHeading: fields.text({ label: 'Footer · First column heading' }),
        footerConnectHeading: fields.text({ label: 'Footer · Second column heading' }),
        footerEmailLabel: fields.text({ label: 'Footer · Email link text' }),
        footerConnectLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link' }),
          }),
          { label: 'Footer · Second column links', itemLabel: (p) => p.fields.label.value || 'Link' }
        ),
        footerCopyrightSuffix: fields.text({ label: 'Footer · Text after the © line' }),
        footerTagline: fields.text({ label: 'Footer · Tagline (bottom right)' }),
      },
    }),

    home: singleton({
      label: 'Homepage',
      path: 'src/content/home/',
      format: { data: 'json' },
      schema: {
        // ---------- HERO ----------
        heroEyebrow: fields.text({ label: 'Hero · Eyebrow' }),
        heroHeadline: fields.text({
          label: 'Hero · Headline',
          validation: { length: { min: 1 } },
        }),
        heroHeadlineAccent: fields.text({ label: 'Hero · Headline highlight (shown italic + coloured)' }),
        heroSubtext: fields.text({
          label: 'Hero · Subtext',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        heroPrimaryLabel: fields.text({ label: 'Hero · Primary button label' }),
        heroPrimaryHref: fields.text({ label: 'Hero · Primary button link' }),
        heroSecondaryLabel: fields.text({ label: 'Hero · Secondary button label' }),
        heroSecondaryHref: fields.text({ label: 'Hero · Secondary button link' }),

        // ---------- MARQUEE ----------
        marqueeWords: fields.array(fields.text({ label: 'Word' }), {
          label: 'Scrolling words',
          itemLabel: (p) => p.value,
        }),

        // ---------- COMPANY ----------
        companyEyebrow: fields.text({ label: 'Company · Section label (e.g. 01 — The Company)' }),
        companyHeadline: fields.text({ label: 'Company · Headline' }),
        companyHeadlineAccent: fields.text({ label: 'Company · Headline highlight' }),
        companyLead: fields.text({ label: 'Company · Lead paragraph', multiline: true }),
        companyEssay: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Company · Essay paragraphs',
          itemLabel: (p) => p.value.slice(0, 48) || 'Paragraph',
        }),
        companyFacts: fields.array(
          fields.object({
            text: fields.text({ label: 'Big text' }),
            label: fields.text({ label: 'Small label under it' }),
          }),
          { label: 'Company · Facts', itemLabel: (p) => p.fields.text.value || 'Fact' }
        ),

        // ---------- PHILOSOPHY ----------
        philosophyEyebrow: fields.text({ label: 'Philosophy · Section label' }),
        philosophyStatement: fields.text({ label: 'Philosophy · Statement', multiline: true }),
        philosophyStatementAccent: fields.text({ label: 'Philosophy · Statement highlight' }),
        philosophyStatementTail: fields.text({
          label: 'Philosophy · Statement ending',
          description: 'The clause after the highlighted words. Leave blank to end the sentence at the highlight.',
        }),
        philosophyBody: fields.text({ label: 'Philosophy · Body', multiline: true }),
        philosophyStats: fields.array(
          fields.object({
            k: fields.text({ label: 'Big text' }),
            v: fields.text({ label: 'Small label' }),
          }),
          { label: 'Philosophy · Stats', itemLabel: (p) => p.fields.k.value || 'Stat' }
        ),

        // ---------- WHAT WE BUILD ----------
        buildEyebrow: fields.text({ label: 'What We Build · Section label' }),
        buildHeadline: fields.text({ label: 'What We Build · Headline' }),
        buildHeadlineAccent: fields.text({ label: 'What We Build · Headline highlight' }),
        buildLead: fields.text({ label: 'What We Build · Lead', multiline: true }),
        pillars: fields.array(
          fields.object({
            number: fields.text({ label: 'Number (e.g. 01)' }),
            title: fields.text({ label: 'Title' }),
            body: fields.text({ label: 'Body', multiline: true }),
            image: fields.image({
              label: 'Image (optional)',
              description: 'Replaces the default line icon. Leave empty to keep the icon.',
              directory: 'public/images',
              publicPath: '/images/',
            }),
          }),
          { label: 'What We Build · Pillars', itemLabel: (p) => p.fields.title.value || 'Pillar' }
        ),

        // ---------- BELIEFS ----------
        beliefsEyebrow: fields.text({ label: 'Beliefs · Section label' }),
        beliefsHeadline: fields.text({ label: 'Beliefs · Headline' }),
        beliefsHeadlineAccent: fields.text({ label: 'Beliefs · Headline highlight' }),
        beliefsLead: fields.text({ label: 'Beliefs · Lead', multiline: true }),
        beliefs: fields.array(
          fields.object({
            number: fields.text({ label: 'Number (e.g. 01)' }),
            title: fields.text({ label: 'Belief' }),
            body: fields.text({ label: 'Explanation', multiline: true }),
          }),
          { label: 'Beliefs · List', itemLabel: (p) => p.fields.title.value || 'Belief' }
        ),

        // ---------- APPROACH ----------
        approachEyebrow: fields.text({ label: 'Approach · Section label' }),
        approachHeadline: fields.text({ label: 'Approach · Headline' }),
        approachHeadlineAccent: fields.text({ label: 'Approach · Headline highlight' }),
        approachLead: fields.text({ label: 'Approach · Lead', multiline: true }),
        approachTagline: fields.text({ label: 'Approach · Tagline' }),
        approachTaglineAccent: fields.text({ label: 'Approach · Tagline highlight' }),
        principles: fields.array(
          fields.object({
            idx: fields.text({ label: 'Number (e.g. 01)' }),
            title: fields.text({ label: 'Title' }),
            body: fields.text({ label: 'Body', multiline: true }),
          }),
          { label: 'Approach · Principles', itemLabel: (p) => p.fields.title.value || 'Principle' }
        ),

        // ---------- BANNER ----------
        bannerText: fields.text({ label: 'Banner · Text' }),
        bannerAccent: fields.text({ label: 'Banner · Highlight' }),
        bannerSub: fields.text({ label: 'Banner · Sub-line' }),

        // ---------- LETTER ----------
        letterEyebrow: fields.text({ label: 'Letter · Eyebrow' }),
        letterParagraphs: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Letter · Paragraphs',
          itemLabel: (p) => p.value.slice(0, 48) || 'Paragraph',
        }),
        letterSign: fields.text({ label: 'Letter · Sign-off' }),

        // ---------- CONTACT / CTA ----------
        ctaEyebrow: fields.text({ label: 'Contact · Eyebrow' }),
        ctaHeadline: fields.text({ label: 'Contact · Headline' }),
        ctaHeadlineAccent: fields.text({ label: 'Contact · Headline highlight' }),
        ctaBody: fields.text({ label: 'Contact · Body', multiline: true }),
        ctaButtonLabel: fields.text({
          label: 'Contact · Button label',
          validation: { length: { min: 1 } },
        }),
        ctaButtonHref: fields.text({ label: 'Contact · Button link (e.g. mailto:hello@…)' }),

        // ---------- FOOTER ----------
        footerBlurb: fields.text({ label: 'Footer · Blurb', multiline: true }),
        footerEmail: fields.text({ label: 'Footer · Email address' }),
      },
    }),
  },
});
