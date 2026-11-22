// Builds the static site into dist/. No dependencies: `node build.mjs`.
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { site, services, engagements, guarantees, process as steps, values, zobra, posts, techStack, packages, faqs } from './content.mjs';

const OUT = 'dist';
const OG = existsSync('assets/og-image.png');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Logo: the manager's design, cut out by brand/prepare-logo.mjs. The link around it carries the accessible name.
const LOGO = '<img class="logo-img" src="/assets/logo-lockup.png" alt="" width="896" height="240">';
const list = (items, cls = 'checks') => `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const nav = [
  ['/services/', 'Services'],
  ['/work/', 'Work'],
  ['/engagement/', 'How we work'],
  ['/about/', 'About'],
  ['/blog/', 'Blog'],
];

const profileLinks = [
  [site.linkedin, 'LinkedIn'], [site.profiles.google, 'Google reviews'], [site.profiles.clutch, 'Clutch'], [site.profiles.goodfirms, 'GoodFirms'],
].filter(([u]) => u).map(([u, l]) => `<a href="${esc(u)}" rel="noopener">${l}</a>`).join('');

function layout({ path, title, description, body, jsonLd }) {
  const fullTitle = path === '/' ? `${site.name} | ${site.tagline}` : `${title} | ${site.name}`;
  const url = site.domain ? site.domain.replace(/\/$/, '') + path : '';
  const navLinks = nav.map(([href, label]) => `<a href="${href}"${path.startsWith(href) ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const contactBits = [
    site.email && `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`,
    site.phone && `<a href="tel:${esc(site.phone.replace(/\s/g, ''))}">${esc(site.phone)}</a>`,
    site.address ? esc(site.address) : esc(site.city),
  ].filter(Boolean).map((x) => `<li>${x}</li>`).join('');
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${url ? `<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
${OG && site.domain ? `<meta property="og:image" content="${site.domain.replace(/\/$/, '')}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">` : ''}
<meta name="twitter:card" content="${OG ? 'summary_large_image' : 'summary'}">
<meta name="theme-color" content="#0B1024">
<link rel="icon" href="/assets/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Instrument+Serif:ital@1&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/styles.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header>
  <div class="wrap nav">
    <a class="logo" href="/" aria-label="${esc(site.name)} home">${LOGO}</a>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">☰</button>
    <nav class="links" id="nav-links" aria-label="Main">${navLinks}<a class="btn btn-primary" href="/contact/">Start a project</a></nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer>
  <div class="wrap footer-grid">
    <div>
      <a class="logo" href="/" aria-label="${esc(site.name)} home">${LOGO}</a>
      <p class="muted">A product and services company. Makers of ZOBRA.</p>
      ${profileLinks ? `<p class="profiles">${profileLinks}</p>` : ''}
    </div>
    <div><h4>Services</h4><ul>${services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.title)}</a></li>`).join('')}</ul></div>
    <div><h4>Company</h4><ul><li><a href="/work/">Work</a></li><li><a href="/technology/">Technology</a></li><li><a href="/engagement/">How we work</a></li><li><a href="/about/">About</a></li><li><a href="/careers/">Careers</a></li><li><a href="/blog/">Blog</a></li><li><a href="/engagement/#faq">FAQ</a></li></ul></div>
    <div><h4>Contact</h4><ul>${contactBits}<li><a href="/contact/">Start a project</a></li></ul></div>
  </div>
  <div class="wrap footer-bottom">
    <span>© ${new Date().getFullYear()} ${esc(site.name)}</span>
    <span class="legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></span>
  </div>
</footer>
${site.whatsapp ? `<a class="wa" href="https://wa.me/${esc(site.whatsapp)}" rel="noopener" aria-label="Chat on WhatsApp">WhatsApp</a>` : ''}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

const pageHead = (eyebrow, title, lead, crumbs = []) => `
<section class="page-head">
  <div class="wrap">
    ${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${crumbs.map(([h, l]) => ` / ${h ? `<a href="${h}">${esc(l)}</a>` : esc(l)}`).join('')}</nav>` : ''}
    <h1>${esc(title)}</h1>
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
  </div>
</section>`;

// Section heading: number + label, title, optional lead on the right.
const secHead = (num, label, title, lead = '') => `
  <div class="sec-head">
    <div><h2>${title}</h2></div>
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
  </div>`;

const ctaBand = (title = 'Have a project in mind?', text = `Tell us what you want to build. We reply ${site.responseTime} with questions, a rough plan and an estimate.`) => `
<section class="cta-band">
  <div class="wrap">
    <div><h2>${esc(title)}</h2><p>${esc(text)}</p></div>
    <a class="btn btn-ink" href="/contact/">${site.freeConsultation ? 'Book a free consultation' : 'Start a project'}</a>
  </div>
</section>`;

const serviceCards = () => `<ol class="svc-list">${services.map((s, i) => `
  <li><a href="/services/${s.slug}/">
    <span class="svc-num">0${i + 1}</span>
    <span class="svc-main"><span class="svc-title">${esc(s.title)}</span><span class="svc-short">${esc(s.short)}</span></span>
    <span class="svc-tags">${s.stack.slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('')}</span>
    <span class="svc-arrow" aria-hidden="true"></span>
  </a></li>`).join('')}</ol>`;

const statsBar = () => site.stats.length ? `<div class="stats">${site.stats.map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('')}</div>` : '';

const metricCards = () => `<div class="metrics">${zobra.metrics.map((m) => `<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join('')}</div>`;

const phone = (shot, cls = '', eager = false) => shot ? `<figure class="phone ${cls}"><img src="${esc(shot.src)}" alt="${esc(shot.alt)}" width="390" height="844"${eager ? '' : ' loading="lazy"'}></figure>` : '';

const testimonials = () => site.testimonials.length ? `
<section><div class="wrap">
  ${secHead('—', 'Clients', 'What our clients say')}
  <div class="grid">${site.testimonials.map((t) => `
    <figure class="card quote"><blockquote>“${esc(t.quote)}”</blockquote>
      <figcaption>${t.photo ? `<img src="${esc(t.photo)}" alt="" width="44" height="44">` : ''}<span><strong>${esc(t.name)}</strong><br>${esc(t.role)}</span></figcaption></figure>`).join('')}</div>
</div></section>` : '';

const logos = () => site.clients.length ? `
<section class="logos-band"><div class="wrap">
  <p class="muted center">Trusted by</p>
  <div class="logos">${site.clients.map((c) => `<img src="${esc(c.logo)}" alt="${esc(c.name)}" height="36">`).join('')}</div>
</div></section>` : '';

const processSteps = () => `<ol class="timeline">${steps.map((s, i) => `<li><span class="t-num">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>`;

const zobraMedia = () => (zobra.screenshots.length || zobra.video || zobra.playStore) ? `
<section><div class="wrap">
  ${secHead('—', 'Screens', 'See it in action', 'Real screens from the ZOBRA staging app, with test stores and test orders.')}
  ${zobra.video ? `<div class="video"><iframe src="${esc(zobra.video)}" title="ZOBRA demo video" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>` : ''}
  ${zobra.screenshots.length ? `<div class="shots">${zobra.screenshots.map((i) => phone(i)).join('')}</div>` : ''}
  ${zobra.playStore ? `<p class="mt"><a class="btn btn-primary" href="${esc(zobra.playStore)}" rel="noopener">Get it on Google Play</a></p>` : ''}
</div></section>` : '';

const priceFor = (key) => site.prices[key] ? esc(site.prices[key]) : 'Get a quote';

const pages = [];
const add = (p) => pages.push(p);

// ---------- Home ----------
add({
  path: '/',
  title: 'Home',
  description: `${site.name} designs and builds websites, web apps, Android and iOS apps, backends and cloud systems for businesses in India and abroad. Makers of ZOBRA. Open for projects.`,
  jsonLd: {
    '@context': 'https://schema.org', '@type': 'Organization', name: site.name,
    ...(site.domain && { url: site.domain }), ...(site.email && { email: site.email }), ...(site.phone && { telephone: site.phone }),
    address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressCountry: 'IN', ...(site.address && { streetAddress: site.address }) },
    ...(site.linkedin && { sameAs: [site.linkedin] }),
  },
  body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1>We build marketplace, delivery and booking apps for Indian businesses.</h1>
      <p class="lead">${esc(site.name)} is a Chennai product studio. We built ZOBRA, our own hyperlocal delivery platform, and we design and build websites, web apps and Android and iOS apps for businesses that want the same quality.</p>
      <div class="cta">
        <a class="btn btn-primary" href="/contact/">${site.freeConsultation ? 'Book a free consultation' : 'Tell us about your project'}</a>
        <a class="btn btn-ghost" href="/work/zobra/">See how we built ZOBRA</a>
      </div>
      <p class="kicker">Open for new projects in Navalur, Chennai</p>
    </div>
    <div class="hero-visual">
      <img class="hero-map" src="/assets/hero-map.svg" alt="" width="600" height="560">
      ${phone(zobra.screenshots[0], 'p-back', true)}
      ${phone(zobra.screenshots[2], 'p-front', true)}
      <span class="chip c1"><b>10 min</b> store accept window</span>
      <span class="chip c2"><b>2 codes</b> at pickup &amp; drop</span>
      <span class="chip c3"><b>Radius</b> checked on the server</span>
    </div>
  </div>
  ${site.stats.length ? `<div class="wrap">${statsBar()}</div>` : ''}
</section>
<div class="proof"><ul class="wrap">
  <li>You own the code from day one</li><li>NDA before you share your idea</li><li>Weekly demos on a live staging link</li><li>Office in Navalur, OMR</li>
</ul></div>
${logos()}
<section id="services"><div class="wrap">
  ${secHead('01', 'Services', 'What we can build for you', 'Our focus is marketplaces, delivery and booking products, but we build any web or mobile product, from the first idea to a live product with real users.')}
  ${serviceCards()}
</div></section>

<section class="product"><div class="wrap product-grid">
  <div>
    <h2>ZOBRA: your neighbourhood shops, delivered.</h2>
    <p class="lead">${esc(zobra.summary)} We designed and built every part of it: customer app, partner app, seller portal, admin console and backend.</p>
    ${metricCards()}
    <div class="cta"><a class="btn btn-gold" href="/work/zobra/">Read the case study</a></div>
  </div>
  <div class="phones" aria-label="ZOBRA screens">
    ${phone(zobra.screenshots[1], 'p1')}${phone(zobra.screenshots[3], 'p2')}
  </div>
</div></section>

<section><div class="wrap">
  ${secHead('03', 'Process', 'A simple process, with you at every step')}
  ${processSteps()}
</div></section>

<section class="soft"><div class="wrap">
  ${secHead('04', 'Ways to work with us', 'Pick the model that fits your stage')}
  <div class="models">${engagements.map((e) => `<div><h3>${esc(e.title)}</h3><p>${esc(e.fit)}</p><span class="small muted">${esc(e.time)}</span></div>`).join('')}</div>
  <p class="mt"><a class="text-link" href="/engagement/">Compare engagement models and FAQ</a></p>
</div></section>
${testimonials()}
<section><div class="wrap">
  ${secHead('05', 'From the blog', 'What we’re learning')}
  <div class="posts">${posts.slice(0, 3).map(postCard).join('')}</div>
</div></section>
${ctaBand()}`,
});

function postCard(p) {
  return `<a class="post" href="/blog/${p.slug}/"><span class="post-date">${fmtDate(p.date)}</span><span class="post-body"><span class="post-title">${esc(p.title)}</span><span class="post-desc">${esc(p.description)}</span></span><span class="svc-arrow" aria-hidden="true"></span></a>`;
}

// ---------- Services ----------
add({
  path: '/services/',
  title: 'Services',
  description: 'Websites and web apps, Android and iOS apps in Flutter, backend and cloud on AWS, and support after launch.',
  body: `${pageHead('Services', 'What we build', 'Four things we do well. Most projects combine several of them.', [[null, 'Services']])}
<section><div class="wrap">${serviceCards()}<p class="mt"><a class="text-link" href="/technology/">See the technology we use and why</a></p></div></section>
<section class="soft"><div class="wrap">${secHead('—', 'Process', 'How every project runs')}${processSteps()}</div></section>
${ctaBand()}`,
});

for (const s of services) {
  const others = services.filter((o) => o.slug !== s.slug).slice(0, 3);
  add({
    path: `/services/${s.slug}/`,
    title: s.title,
    description: s.short,
    body: `${pageHead('Service', s.title, s.short, [['/services/', 'Services'], [null, s.title]])}
<section><div class="wrap two-col">
  <div class="prose">
    <p class="big">${esc(s.intro)}</p>
    <h2>What you get</h2>${list(s.deliverables)}
    <h2>Who it's for</h2>${list(s.whoFor, 'bullets')}
    <h2>Timeline</h2><p>${esc(s.timeline)}</p>
  </div>
  <aside class="side">
    <div class="card">
      <h3>Technology</h3>
      <div class="stack">${s.stack.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    </div>
    <div class="card dark">
      <h3>ZOBRA</h3>
      <p>${esc(zobra.summary)}</p>
      <a class="text-link light" href="/work/zobra/">Read how we built it</a>
    </div>
    <div class="card">
      <h3>Start with a conversation</h3>
      <p>Tell us what you need. We reply ${esc(site.responseTime)}.</p>
      <a class="btn btn-primary full" href="/contact/?service=${encodeURIComponent(s.title)}">Discuss ${esc(s.title.toLowerCase())}</a>
    </div>
  </aside>
</div></section>
<section class="soft"><div class="wrap"><h2>Related services</h2><div class="grid">${others.map((o) => `<a class="card card-link" href="/services/${o.slug}/"><div class="icon">${o.icon}</div><h3>${esc(o.title)}</h3><p>${esc(o.short)}</p></a>`).join('')}</div></div></section>
${ctaBand()}`,
  });
}

// ---------- Technology ----------
add({
  path: '/technology/',
  title: 'Technology',
  description: 'The tech stack we recommend: Next.js and React for the web, Flutter for Android and iOS, Node.js and Express, PostgreSQL and MongoDB, AWS and Vercel.',
  body: `${pageHead('Technology', 'The stack we recommend, and why', 'Proven, widely used technology that is easy to hire for and cheap to run. We explain every choice and change it when your project needs something else.', [[null, 'Technology']])}
<section><div class="wrap tech">${techStack.map((t) => `
  <div class="card tech-row">
    <h2>${esc(t.area)}</h2>
    <div>
      <div class="stack picks">${t.pick.map((p) => `<span>${esc(p)}</span>`).join('')}</div>
      <p>${esc(t.why)}</p>
      <p class="also"><strong>Also:</strong> ${esc(t.also)}</p>
    </div>
  </div>`).join('')}
</div></section>
${ctaBand('Not sure which stack fits your project?', 'Tell us what you are building. We will recommend a stack and explain the trade-offs in plain words.')}`,
});

// ---------- Work ----------
add({
  path: '/work/',
  title: 'Work',
  description: 'Products and projects designed and built by Dollar Technologies, including ZOBRA, our hyperlocal shopping platform.',
  body: `${pageHead('Work', 'What we have built', 'Case studies from our own products and client projects.', [[null, 'Work']])}
<section><div class="wrap">
  <a class="case card-link" href="/work/zobra/">
    <div>
      <h2>ZOBRA</h2>
      <p class="lead">${esc(zobra.summary)}</p>
      <div class="stack">${['Web app', 'Android apps', 'Backend', 'Maps & location', 'UI/UX'].map((t) => `<span>${t}</span>`).join('')}</div>
      <span class="more">Read the case study</span>
    </div>
    <div class="phones small-phones">${phone(zobra.screenshots[0], 'p1')}${phone(zobra.screenshots[2], 'p2')}</div>
  </a>
  <div class="card mt center">
    <h3>Client case studies are on the way</h3>
    <p>We publish client work with permission. Ask us for references and examples relevant to your project.</p>
    <a class="btn btn-primary" href="/contact/">Ask for references</a>
  </div>
</div></section>
${ctaBand()}`,
});

add({
  path: '/work/zobra/',
  title: 'ZOBRA case study',
  description: 'How we designed and built ZOBRA: customer app, partner app for sellers and riders, admin console and a secure backend for hyperlocal delivery.',
  body: `${pageHead('Case study · Our product', 'ZOBRA: neighbourhood shops, delivered', zobra.summary, [['/work/', 'Work'], [null, 'ZOBRA']])}
<section><div class="wrap">${metricCards()}</div></section>
<section class="soft"><div class="wrap two-col">
  <div class="prose">
    <h2>The challenge</h2>${zobra.challenge.map((p) => `<p>${esc(p)}</p>`).join('')}
  </div>
  <aside class="side"><div class="card">
    <h3>At a glance</h3>
    <dl class="facts">
      <dt>Type</dt><dd>Our own product</dd>
      <dt>Industry</dt><dd>Retail &amp; local delivery</dd>
      <dt>Platforms</dt><dd>Web, Android (2 apps)</dd>
      <dt>Status</dt><dd>${esc(zobra.status)}</dd>
    </dl>
  </div></aside>
</div></section>
${zobraMedia()}
<section><div class="wrap">
  <h2>What we built</h2>
  <div class="grid four">${zobra.built.map((b) => `<div class="card"><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div>`).join('')}</div>
</div></section>
<section class="product"><div class="wrap">
  <h2>The details that make it trustworthy</h2>
  <div class="grid four">${zobra.highlights.map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
</div></section>
<section><div class="wrap">
  <h2>Technology</h2>
  <div class="stack">${zobra.stack.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
  <p class="mt"><a class="text-link" href="/blog/building-a-hyperlocal-delivery-app/">Read 7 lessons from building a hyperlocal delivery app</a></p>
</div></section>
${ctaBand('Building a marketplace or delivery product?', 'We have solved these problems for our own product. Let us help with yours.')}`,
});

// ---------- Engagement ----------
add({
  path: '/engagement/',
  title: 'How we work',
  description: 'Engagement models: fixed-scope MVP, dedicated team, time and materials, and support and maintenance. What every project includes, and answers to common questions.',
  jsonLd: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  body: `${pageHead('How we work', 'Ways to work with us', 'Choose the model that fits your stage and budget. You can switch as the product grows.', [[null, 'How we work']])}
<section><div class="wrap">
  <div class="grid two">${engagements.map((e) => `
    <div class="card model">
      <h3>${esc(e.title)}</h3>
      <p class="price">${priceFor(e.key)}</p>
      <dl class="facts"><dt>Best when</dt><dd>${esc(e.fit)}</dd><dt>How it works</dt><dd>${esc(e.how)}</dd><dt>Typical length</dt><dd>${esc(e.time)}</dd></dl>
      <a class="btn btn-ghost full" href="/contact/?model=${encodeURIComponent(e.title)}">Ask about this<span class="sr-only"> model: ${esc(e.title)}</span></a>
    </div>`).join('')}</div>
</div></section>
${packages.some((p) => p.price) ? `<section class="soft"><div class="wrap">
  <h2>Fixed packages with fixed prices</h2>
  <div class="grid">${packages.map((p) => `
    <div class="card package">
      <h3>${esc(p.title)}</h3>
      <p class="price">${p.price ? esc(p.price) : 'Get a quote'}</p>
      <p class="muted small">${esc(p.time)}</p>
      ${list(p.items)}
      <a class="btn btn-primary full" href="/contact/">Ask about ${esc(p.title.toLowerCase())}</a>
    </div>`).join('')}</div>
</div></section>` : ''}
<section class="soft"><div class="wrap two-col">
  <div><h2>What you always get</h2>${list(guarantees)}</div>
  <div><h2>Four steps</h2><ol class="numbered">${steps.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.text)}</li>`).join('')}</ol></div>
</div></section>
<section id="faq"><div class="wrap">
  <h2>Common questions</h2>
  <div class="faq">${faqs.map((f) => `<details class="card"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
</div></section>
${ctaBand()}`,
});

// ---------- About ----------
add({
  path: '/about/',
  title: 'About',
  description: `${site.name} is a product and services company based in ${site.city}. We build our own products and software for other businesses.`,
  body: `${pageHead('About us', 'A product company that also builds for you', `We are a software company based in ${site.city}.`, [[null, 'About']])}
<section><div class="wrap two-col">
  <div class="prose">
    <h2>Our story</h2>
    <p>${esc(site.name)} ${site.founded ? `was founded in ${esc(site.founded)} and ` : ''}started by building our own product. ZOBRA connects neighbourhood shops with customers and local riders, and building it taught us what it really takes to run software that handles orders, money and people's addresses.</p>
    <p>Today we put that experience to work for other businesses as well. We design and build websites, web apps, Android and iOS apps, backends and cloud systems, and we stay to support them after launch.</p>
  </div>
  <aside class="side"><div class="card">
    <h3>Where we are</h3>
    <p>${esc(site.address || site.city)}</p>
    ${site.mapsUrl ? `<a class="text-link" href="${esc(site.mapsUrl)}" rel="noopener">Open in Google Maps</a>` : ''}
  </div></aside>
</div>
${site.stats.length ? `<div class="wrap mt">${statsBar()}</div>` : ''}
</section>
<section class="soft"><div class="wrap">
  <h2>How we think</h2>
  <div class="grid four">${values.map((v) => `<div class="card"><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join('')}</div>
</div></section>
${site.team.length ? `<section><div class="wrap">
  <h2>The people you'll work with</h2>
  <div class="grid four">${site.team.map((m) => `<div class="card person">${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" width="320" height="320" loading="lazy">` : ''}<h3>${esc(m.name)}</h3><p>${esc(m.role)}</p>${m.linkedin ? `<a class="text-link" href="${esc(m.linkedin)}" rel="noopener">LinkedIn</a>` : ''}</div>`).join('')}</div>
</div></section>` : ''}
${testimonials()}
<section><div class="wrap center">
  <h2>Want to join us?</h2>
  <p class="lead center-block">We are always glad to meet good developers and designers.</p>
  <a class="btn btn-ghost" href="/careers/">See careers</a>
</div></section>
${ctaBand()}`,
});

// ---------- Careers ----------
add({
  path: '/careers/',
  title: 'Careers',
  description: `Work at ${site.name}: build real products used by real shops, riders and customers.`,
  body: `${pageHead('Careers', 'Build products people actually use', 'Join a small team that ships its own products and client work.', [[null, 'Careers']])}
<section><div class="wrap two-col">
  <div class="prose">
    <h2>Why work with us</h2>
    ${list(['Work on our own product, ZOBRA, and on client projects', 'Own features end to end: design, database, app and release', 'Small team, real responsibility, direct access to the founders', 'Modern stack: Next.js, React, Node.js, Flutter, PostgreSQL, MongoDB and AWS'])}
    <h2>How we hire</h2>
    <ol class="numbered"><li><strong>Apply.</strong> Send your CV and links to work you are proud of.</li><li><strong>Conversation.</strong> A short call about you and the role.</li><li><strong>Practical task.</strong> A short task close to the real work, sized to respect your time.</li><li><strong>Offer.</strong> We decide quickly and tell you why either way.</li></ol>
  </div>
  <aside class="side"><div class="card">
    <h3>Don't see your role?</h3>
    <p>Send us your CV anyway. We keep good people in mind.</p>
    ${site.email ? `<a class="btn btn-primary full" href="mailto:${esc(site.email)}?subject=${encodeURIComponent('Job application')}">Email your CV</a>` : `<a class="btn btn-primary full" href="/contact/?service=${encodeURIComponent('Job application')}">Get in touch</a>`}
  </div></aside>
</div></section>
<section class="soft"><div class="wrap">
  <h2>Open roles</h2>
  ${site.jobs.length ? `<div class="jobs">${site.jobs.map((j) => `<details class="card job"><summary><span><strong>${esc(j.title)}</strong><br><span class="muted">${esc(j.type)}</span></span><span class="more">Details</span></summary><p>${esc(j.summary)}</p>${j.requirements ? list(j.requirements, 'bullets') : ''}${site.email ? `<a class="btn btn-primary" href="mailto:${esc(site.email)}?subject=${encodeURIComponent('Application: ' + j.title)}">Apply</a>` : ''}</details>`).join('')}</div>`
    : `<div class="card"><p>No open roles right now. You can still send us your CV and we will contact you when a role opens.</p></div>`}
</div></section>`,
});

// ---------- Blog ----------
add({
  path: '/blog/',
  title: 'Blog',
  description: 'Notes from building software products: marketplaces, delivery, mobile apps, backends, cloud and maps.',
  body: `${pageHead('Blog', 'Notes from building products', 'What we learn while building ZOBRA and client projects.', [[null, 'Blog']])}
<section><div class="wrap"><div class="posts">${posts.map(postCard).join('')}</div></div></section>
${ctaBand()}`,
});

for (const p of posts) {
  add({
    path: `/blog/${p.slug}/`,
    title: p.title,
    description: p.description,
    jsonLd: { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, datePublished: p.date, author: { '@type': 'Organization', name: site.name }, description: p.description },
    body: `${pageHead(fmtDate(p.date), p.title, p.description, [['/blog/', 'Blog'], [null, 'Article']])}
<section><div class="wrap"><article class="prose article">${p.body}</article></div></section>
${ctaBand()}`,
  });
}

// ---------- Contact ----------
const opt = (v) => `<option>${esc(v)}</option>`;
add({
  path: '/contact/',
  title: 'Contact',
  description: `Start a project with ${site.name}. ${site.freeConsultation ? 'Book a free 30-minute consultation.' : ''} We reply ${site.responseTime}.`,
  body: `${pageHead('Contact', 'Tell us about your project', `${site.freeConsultation ? 'Book a free 30-minute consultation. ' : ''}We reply ${site.responseTime} with questions, a rough plan and an estimate.`, [[null, 'Contact']])}
<section><div class="wrap two-col">
  <form id="contact-form" class="card" data-email="${esc(site.email)}"${site.formEndpoint ? ` data-endpoint="${esc(site.formEndpoint)}"` : ''} novalidate>
    <label class="hp" aria-hidden="true">Leave this empty<input name="_gotcha" tabindex="-1" autocomplete="off"></label>
    <div class="two">
      <label>Your name *<input name="name" required autocomplete="name"></label>
      <label>Email *<input name="email" type="email" required autocomplete="email"></label>
    </div>
    <div class="two">
      <label>Phone<input name="phone" type="tel" autocomplete="tel" inputmode="tel"></label>
      <label>Company<input name="company" autocomplete="organization"></label>
    </div>
    <label>What do you need? *<select name="service" required>${[...services.map((s) => s.title), 'Several of these', 'Not sure yet', 'Job application'].map(opt).join('')}</select></label>
    <div class="two">
      <label>Budget<select name="budget">${['Not sure yet', 'Under ₹2 lakh', '₹2 to 5 lakh', '₹5 to 15 lakh', '₹15 lakh+'].map(opt).join('')}</select></label>
      <label>When do you want to start?<select name="timeline">${['As soon as possible', 'Within a month', 'In 1 to 3 months', 'Just exploring'].map(opt).join('')}</select></label>
    </div>
    <label>How would you like to work?<select name="model">${['Not sure yet', ...engagements.map((e) => e.title)].map(opt).join('')}</select></label>
    <label>About your project *<textarea name="message" required placeholder="What are you building, who is it for, and what does a good result look like?"></textarea></label>
    <label class="check"><input type="checkbox" name="nda"> I’d like an NDA before sharing details</label>
    <p class="form-error" id="form-error" role="alert" hidden></p>
    <p class="form-ok" role="status" hidden></p>
    <button class="btn btn-primary" type="submit">Send enquiry</button>
    <p class="note">${site.formEndpoint ? 'Your message is sent straight to our team.' : 'This opens your email app with your message filled in.'} By sending, you agree to our <a href="/privacy/">privacy policy</a>.</p>
  </form>
  <aside class="side">
    <div class="card">
      <h3>Contact details</h3>
      <dl class="facts">
        ${site.email ? `<dt>Email</dt><dd><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></dd>` : ''}
        ${site.phone ? `<dt>Phone</dt><dd><a href="tel:${esc(site.phone.replace(/\s/g, ''))}">${esc(site.phone)}</a></dd>` : ''}
        ${site.whatsapp ? `<dt>WhatsApp</dt><dd><a href="https://wa.me/${esc(site.whatsapp)}" rel="noopener">Chat with us</a></dd>` : ''}
        <dt>Office</dt><dd>${esc(site.address || site.city)}${site.mapsUrl ? `<br><a href="${esc(site.mapsUrl)}" rel="noopener">Open in Google Maps</a>` : ''}</dd>
      </dl>
    </div>
    <div class="card">
      <h3>What happens next</h3>
      <ol class="numbered"><li>We read your message and reply ${esc(site.responseTime)}.</li><li>${site.freeConsultation ? 'A free 30-minute call' : 'A short call'} to understand your goals.</li><li>A written plan with scope, timeline and estimate.</li></ol>
    </div>
  </aside>
</div></section>`,
});

// ---------- Legal (drafts) ----------
const legalNote = `<p class="draft">Draft: to be reviewed before the site goes live.</p>`;
add({
  path: '/privacy/',
  title: 'Privacy policy',
  description: `How ${site.name} handles information on this website.`,
  body: `${pageHead('Legal', 'Privacy policy', null, [[null, 'Privacy policy']])}
<section><div class="wrap"><article class="prose article">${legalNote}
<p>This policy explains what information ${esc(site.name)} ("we") collects through this website and how we use it. It covers this website only; our products, such as ZOBRA, have their own policies.</p>
<h2>What we collect</h2>
<p>The website does not use cookies, analytics or tracking. ${site.formEndpoint ? 'When you use the contact form, your message is sent through a form-handling service, which stores it and forwards it to our email.' : 'When you use the contact form, it opens your own email app with your message filled in; nothing is stored by the website itself.'} When you email us, we receive what you choose to send: usually your name, email address, phone number, company and project details.</p>
<h2>How we use it</h2>
<p>We use your details only to reply to you, discuss your project or job application, and keep a record of our conversation. We do not sell your information or use it for unrelated marketing.</p>
<h2>How long we keep it</h2>
<p>We keep enquiry emails for as long as needed to respond and for our business records, and delete them on request unless the law requires us to keep them.</p>
<h2>Service providers</h2>
<p>The website is hosted by a hosting provider and loads fonts from Google Fonts, which receive standard technical information such as your IP address when the page loads. Our email provider${site.formEndpoint ? ' and form-handling service store' : ' stores'} the messages you send us.</p>
<h2>Your rights</h2>
<p>You can ask us to see, correct or delete the information we hold about you${site.email ? ` by writing to <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : ' through the contact page'}. We handle personal data in line with India's Digital Personal Data Protection Act, 2023.</p>
<h2>Changes</h2>
<p>We may update this policy. The current version is always on this page.</p>
</article></div></section>`,
});

add({
  path: '/terms/',
  title: 'Terms of use',
  description: `Terms for using the ${site.name} website.`,
  body: `${pageHead('Legal', 'Terms of use', null, [[null, 'Terms of use']])}
<section><div class="wrap"><article class="prose article">${legalNote}
<p>By using this website you agree to these terms.</p>
<h2>Content</h2>
<p>The text, design and images on this website belong to ${esc(site.name)} unless stated otherwise. You may share links to it but may not copy its content for commercial use without permission.</p>
<h2>No offer</h2>
<p>Descriptions of services, timelines and prices on this website are general information, not a binding offer. The terms of any project are set out in a separate written agreement.</p>
<h2>Accuracy</h2>
<p>We try to keep the website accurate and up to date but do not guarantee it. We are not liable for losses from relying on it.</p>
<h2>Links</h2>
<p>Links to other websites are for convenience. We are not responsible for their content.</p>
<h2>Law</h2>
<p>These terms are governed by the laws of India, and the courts of Chennai have jurisdiction.</p>
</article></div></section>`,
});

add({
  path: '/404.html',
  title: 'Page not found',
  description: 'This page does not exist.',
  body: `${pageHead('404', 'Page not found', 'The page you are looking for has moved or does not exist.')}
<section><div class="wrap center"><a class="btn btn-primary" href="/">Go to the home page</a> <a class="btn btn-ghost" href="/contact/">Contact us</a></div></section>`,
});

// ---------- Write ----------
// Empty dist/ rather than delete it: on Windows a server running inside it locks the folder.
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) rmSync(join(OUT, f), { recursive: true, force: true });
for (const p of pages) {
  const file = p.path.endsWith('.html') ? join(OUT, p.path) : join(OUT, p.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, layout(p));
}
cpSync('assets', join(OUT, 'assets'), { recursive: true });

const indexable = pages.filter((p) => p.path !== '/404.html');
if (site.domain) {
  const base = site.domain.replace(/\/$/, '');
  writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((p) => `  <url><loc>${base}${p.path}</loc></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
} else {
  writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
}

// ---------- Self-check: every internal link points to a built file ----------
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); } })(OUT);
const broken = [];
for (const f of files.filter((f) => f.endsWith('.html'))) {
  for (const [, href] of readFileSync(f, 'utf8').matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = join(OUT, href.endsWith('/') ? href + 'index.html' : href);
    if (!existsSync(target)) broken.push(`${f} → ${href}`);
  }
}
if (broken.length) { console.error('Broken internal links:\n' + broken.join('\n')); process.exit(1); }

const todo = ['domain', 'email', 'phone', 'address'].filter((k) => !site[k]);
console.log(`Built ${pages.length} pages into ${OUT}/, all internal links OK.`);
if (todo.length) console.log(`Still to fill in content.mjs: ${todo.join(', ')} (and stats, clients, testimonials, team, jobs, prices when ready).`);
