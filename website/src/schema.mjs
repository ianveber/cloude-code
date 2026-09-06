/**
 * Structured data (JSON-LD).
 *
 * This is the core of the GEO work. Answer engines and search crawlers read
 * these graphs to decide what the business *is*, what it sells, who works
 * there and which questions the site can answer. Every node gets a stable
 * `@id` so the graph is properly connected rather than a pile of loose objects.
 */

import { absolute } from './html.mjs';
import site from '../content/site.mjs';
import { services, faq, team, processSteps } from '../content/content.mjs';

const url = (path) => absolute(site.origin, path);

export const IDS = {
  organization: url('/#organization'),
  website: url('/#website'),
  place: url('/#place'),
};

/* ── Reusable nodes ───────────────────────────────────────────────────── */

export function organizationNode() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': IDS.organization,
    name: site.name,
    legalName: site.legalName,
    alternateName: ['AIS', 'Artificial Intelligence Slovenia', 'AI Slovenija'],
    url: url('/'),
    logo: {
      '@type': 'ImageObject',
      url: url(site.brand.logo),
    },
    image: url(site.brand.logo),
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    knowsLanguage: ['sl', 'en'],
    areaServed: {
      '@type': 'Country',
      name: 'Slovenija',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.contact.city,
      addressRegion: site.contact.region,
      addressCountry: site.contact.countryCode,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: site.contact.email,
        telephone: site.contact.phone,
        availableLanguage: ['sl', 'en'],
        areaServed: 'SI',
      },
    ],
    employee: team.members.map((m) => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
      email: m.email,
    })),
    knowsAbout: [
      'avtomatizacija poslovnih procesov',
      'umetna inteligenca za podjetja',
      'AI chatboti',
      'voice AI agenti',
      'CRM integracije',
      'optimizacija procesov',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI sistemi za podjetja',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          '@id': url(`/storitve/${s.slug}/#service`),
          name: s.name,
          description: s.summary,
        },
      })),
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': IDS.website,
    url: url('/'),
    name: site.name,
    description: site.description,
    inLanguage: site.lang,
    publisher: { '@id': IDS.organization },
  };
}

function webPageNode(page) {
  return {
    '@type': 'WebPage',
    '@id': `${url(page.path)}#webpage`,
    url: url(page.path),
    name: page.title,
    headline: page.headline || page.ogTitle || page.title,
    description: page.description,
    inLanguage: site.lang,
    isPartOf: { '@id': IDS.website },
    about: { '@id': IDS.organization },
    ...(page.breadcrumbs?.length ? { breadcrumb: { '@id': `${url(page.path)}#breadcrumb` } } : {}),
  };
}

function breadcrumbNode(page) {
  if (!page.breadcrumbs?.length) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url(page.path)}#breadcrumb`,
    itemListElement: page.breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: url(crumb.href),
    })),
  };
}

export function faqNode(items, pagePath) {
  return {
    '@type': 'FAQPage',
    '@id': `${url(pagePath)}#faq`,
    inLanguage: site.lang,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function serviceNode(service) {
  return {
    '@type': 'Service',
    '@id': url(`/storitve/${service.slug}/#service`),
    name: service.name,
    alternateName: `${service.name} — ${service.role}`,
    serviceType: service.role,
    description: service.answer,
    url: url(`/storitve/${service.slug}/`),
    provider: { '@id': IDS.organization },
    areaServed: { '@type': 'Country', name: 'Slovenija' },
    availableLanguage: ['sl'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Zmožnosti — ${service.name}`,
      itemListElement: service.capabilities.map((c) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: c.title, description: c.body },
      })),
    },
  };
}

export function howToNode(pagePath) {
  return {
    '@type': 'HowTo',
    '@id': `${url(pagePath)}#howto`,
    name: 'Kako poteka uvedba AI sistema za avtomatizacijo',
    description:
      'Osemstopenjski proces, po katerem AIS Slovenia postavi AI sistem za avtomatizacijo poslovnih procesov — od raziskave do nenehne evolucije.',
    inLanguage: site.lang,
    totalTime: 'P10W',
    step: processSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
}

export function teamNodes() {
  return team.members.map((m) => ({
    '@type': 'Person',
    '@id': `${url('/ekipa/')}#${m.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    name: m.name,
    jobTitle: m.role,
    email: m.email,
    ...(m.phone ? { telephone: m.phone } : {}),
    image: url(m.photo),
    worksFor: { '@id': IDS.organization },
  }));
}

export function contactPageNode(pagePath) {
  return {
    '@type': 'ContactPage',
    '@id': `${url(pagePath)}#contactpage`,
    url: url(pagePath),
    name: 'Kontakt — AIS Slovenia',
    inLanguage: site.lang,
    about: { '@id': IDS.organization },
  };
}

/**
 * Assemble the final @graph for a page: always the organisation + website +
 * webpage + breadcrumbs, plus whatever page-specific nodes were supplied.
 */
export function buildGraph(page) {
  const nodes = [
    organizationNode(),
    websiteNode(),
    webPageNode(page),
    breadcrumbNode(page),
    ...(page.schema ?? []),
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
