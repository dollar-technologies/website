// All site text and company details live here. Edit this file, then run `node build.mjs`.
// Empty lists hide their section, so the live site never shows made-up clients, numbers or people.

export const site = {
  name: 'Dollar Technologies',
  tagline: 'Software products and services',
  domain: 'https://dollartechnologies.com',
  email: 'dollartechnologiesindia@gmail.com',
  phone: '+91 80728 06202',
  whatsapp: '',          // optional: number in international format without +, e.g. '918072806202'
  address: 'No 1/273, DRG Complex, 2nd Floor, Navalur, OMR, Chennai 603130',
  city: 'Chennai, India',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('DRG Complex, Navalur, OMR, Chennai 603130'),
  linkedin: '',          // TODO optional: company LinkedIn URL
  founded: '',           // TODO optional: year, shown on About
  responseTime: 'within one business day', // CONFIRM: promise shown on Contact
  freeConsultation: true,                  // CONFIRM: shows "free 30-minute consultation"

  // Shown as a stats bar on Home and About only when filled. Real numbers only.
  stats: [
    // { value: '25+', label: 'Products shipped' },
  ],
  // Client logos (files in assets/logos/) — shown only when filled.
  clients: [
    // { name: 'Client name', logo: '/assets/logos/client.svg' },
  ],
  // Named testimonials — shown only when filled.
  testimonials: [
    // { quote: '…', name: 'Full name', role: 'CEO, Company', photo: '/assets/people/name.jpg' },
  ],
  // Founders and team for the About page — shown only when filled.
  team: [
    // { name: 'Full name', role: 'Founder & CEO', photo: '/assets/people/name.jpg', linkedin: '' },
  ],
  // Open roles for Careers.
  jobs: [
    // { title: 'React developer', type: 'Full-time · Chennai', summary: '…', requirements: ['…'] },
  ],
  // Starting prices per engagement model. Leave null to show "Get a quote".
  prices: { mvp: null, team: null, tm: null, support: null }, // e.g. mvp: 'from ₹6,00,000'

  // TODO optional: Formspree-style endpoint (e.g. 'https://formspree.io/f/xxxxxxx').
  // Empty = the contact form opens the visitor's email app instead.
  formEndpoint: '',
  // TODO optional: review/listing profiles, shown in the footer when filled.
  profiles: { google: '', clutch: '', goodfirms: '' },
};

const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const services = [
  {
    slug: 'web-apps',
    title: 'Web apps & websites',
    icon: svg('<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>'),
    short: 'Company websites, online stores, booking systems and admin portals, designed and built by one team.',
    intro: 'We design and build the websites and web apps your customers and your team use every day: company sites, online stores, booking systems, customer portals and admin consoles. Design is part of the job, not an extra: every screen is planned around how people really use it and checked on small phones. When location matters we add maps, store finders and delivery zones that are checked on the server.',
    deliverables: ['Screen designs and a clickable prototype before building starts', 'Responsive site or app that works from 360px phones to desktops', 'Sign-in with roles (customer, staff, admin) and access rules', 'Admin console to manage users, content and orders', 'Maps, store finders and delivery radius checks when you need them', 'Staging version you can try at any time, then source code and handover docs'],
    whoFor: ['Businesses moving a manual process (WhatsApp, Excel, paper) online', 'Startups that need a first version in front of real users', 'Teams replacing a slow or hard-to-change existing system'],
    timeline: 'A company website takes 2–3 weeks. A focused first version of a web app usually takes 6–12 weeks.',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Google Maps Platform', 'Vercel'],
  },
  {
    slug: 'mobile-apps',
    title: 'Mobile apps',
    icon: svg('<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'),
    short: 'Android and iOS apps from one Flutter codebase, so you launch on both for one budget.',
    intro: 'We build mobile apps in Flutter: one codebase, smooth native performance on Android and iOS, and one team to pay. It is the right choice for almost every new product. When an app leans hard on the device (Bluetooth, heavy background work), we can build natively in Kotlin or Swift instead, and we tell you why before you pay for it.',
    deliverables: ['Android and iOS apps from one Flutter codebase', 'Customer and staff/partner apps from shared code where it helps', 'Push notifications, location, camera and payments handled properly', 'Offline-friendly screens for weak networks', 'Play Store and App Store listings, signing and release builds', 'Testing on emulators and real devices'],
    whoFor: ['Startups launching on Android and iOS on one budget', 'Businesses that need separate apps for customers and for staff or riders', 'Products moving from a website to an app their customers keep on the phone'],
    timeline: 'A first app for Android and iOS usually takes 8–12 weeks.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Google Maps', 'Razorpay'],
  },
  {
    slug: 'backend-cloud',
    title: 'Backend & cloud',
    icon: svg('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
    short: 'Secure APIs, order and payment flows, and hosting on AWS that stays fast and affordable.',
    intro: 'Most bugs that cost money live in the backend: a price taken from the browser, an order placed twice, a user reading someone else’s data. We design data models and server logic where the database itself enforces the rules, test them before real users arrive, and host everything on AWS or Vercel with separate staging and production, automated deploys and a monthly bill you can predict.',
    deliverables: ['Database design and versioned migrations', 'Access rules for every role, enforced on the server', 'Atomic order, stock and payment flows (no double orders, no negative stock)', 'Scheduled jobs (expiry, reminders, reports)', 'Hosting, automated deploys, backups and monitoring on AWS', 'Automated security and regression checks'],
    whoFor: ['Marketplaces, delivery and booking products with several user roles', 'Apps that handle money, stock or personal data', 'Teams whose current backend, hosting or cloud bill is hard to trust'],
    timeline: 'Usually built alongside the web or mobile app; a backend-only engagement takes 4–10 weeks.',
    stack: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Supabase', 'AWS', 'Docker'],
  },
  {
    slug: 'support',
    title: 'Support & maintenance',
    icon: svg('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z"/>'),
    short: 'Monitoring, fixes and new features after launch, so your product keeps working.',
    intro: 'Launch is the start. We watch errors, keep dependencies and security patches current, fix what breaks and keep adding the features your users ask for. We also take over products other teams built.',
    deliverables: ['Error monitoring with privacy-safe reporting', 'Monthly dependency and security updates', 'Bug fixes with an agreed response time', 'Small features and improvements each month', 'Backups and restore checks', 'Takeover audit for apps built by another team'],
    whoFor: ['Products already live with real users', 'Founders whose original developer has moved on', 'Teams that want a reliable partner instead of an in-house hire'],
    timeline: 'Monthly retainer; starts with a one-week audit.',
    stack: ['Sentry', 'GitHub', 'AWS', 'Vercel'],
  },
];

// Technology page: what we recommend by default, and when we choose something else.
export const techStack = [
  {
    area: 'Websites & web apps',
    pick: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    why: 'Next.js renders pages on the server, so sites load fast and rank well on Google, and the same code grows into a full web app. TypeScript catches mistakes before users do.',
    also: 'React with Vite for dashboards and admin panels that sit behind a login and do not need search ranking.',
  },
  {
    area: 'Mobile apps',
    pick: ['Flutter', 'Dart'],
    why: 'Flutter is our default: one codebase, smooth native performance on Android and iOS, and one team to pay instead of two.',
    also: 'Native Kotlin or Swift only when an app leans hard on the device. We do not default to React Native: Flutter gives smoother screens and fewer platform surprises for the same budget.',
  },
  {
    area: 'Backend & APIs',
    pick: ['Node.js', 'Express', 'TypeScript'],
    why: 'Node.js with TypeScript lets one team share code and types across the web app, the API and the admin tools. Express keeps APIs small and easy to understand.',
    also: 'Supabase or Firebase when speed to launch matters more than a custom server: sign-in, database, storage and realtime out of the box.',
  },
  {
    area: 'Databases',
    pick: ['PostgreSQL', 'MongoDB', 'Redis'],
    why: 'PostgreSQL for anything with money, orders, stock or relations between data: it keeps the numbers correct. MongoDB for flexible data such as catalogues, content, events and logs.',
    also: 'Redis for caching, sessions, rate limits and job queues when traffic grows.',
  },
  {
    area: 'Hosting & cloud',
    pick: ['AWS', 'Vercel'],
    why: 'Vercel for Next.js front ends: fast worldwide, preview links for every change and nothing to manage. AWS for servers, databases, files and anything that needs to scale.',
    also: 'Docker for portable services and GitHub Actions for automated deploys.',
  },
  {
    area: 'Payments, maps & messaging',
    pick: ['Razorpay', 'Stripe', 'Google Maps Platform', 'Firebase Cloud Messaging'],
    why: 'Razorpay for UPI, cards and netbanking in India; Stripe for international payments. Google Maps for location, routes and address search. Firebase Cloud Messaging for push notifications on Android and iOS.',
    also: 'WhatsApp Business and SMS gateways for order updates and OTP sign-in.',
  },
  {
    area: 'Quality & monitoring',
    pick: ['Sentry', 'GitHub', 'Automated tests'],
    why: 'Every project gets error monitoring, code review on GitHub and automated checks on the parts that handle money, sign-in and personal data.',
    also: 'AWS CloudWatch for server metrics and alerts.',
  },
];

// Fixed packages. Shown on How we work only when at least one price is filled. CONFIRM prices.
export const packages = [
  { key: 'website', title: 'Launch website', price: null, time: '2–3 weeks', items: ['Up to 6 pages, designed for your brand', 'Works on phones, fast and Google-ready', 'Contact form and WhatsApp/call buttons', 'Hosting setup and your domain connected'] },
  { key: 'mvp', title: 'MVP app', price: null, time: '8–10 weeks', items: ['Web app plus Android and iOS apps (Flutter)', 'Sign-in, roles and an admin console', 'Payments, maps or notifications as needed', 'Store listings and one month of support'] },
  { key: 'care', title: 'Monthly support', price: null, time: 'Monthly', items: ['Error monitoring and fixes', 'Security and dependency updates', 'Backups and restore checks', 'Set hours for small improvements'] },
];

// Questions answered on /engagement/#faq (also added to search results as FAQ data).
export const faqs = [
  { q: 'How much does a project cost?', a: 'It depends on the scope. A company website is a few weeks of work; an app with customer, staff and admin sides is a few months. After a free 30-minute call we send a written estimate with a fixed price or a monthly cost, so you know the number before anything starts.' },
  { q: 'How long does it take?', a: 'A company website takes 2–3 weeks. A first version of an app usually takes 8–12 weeks. You get a staging version to try from the first weeks, not only at the end.' },
  { q: 'Who owns the code?', a: 'You do, from day one. The code lives in your own repository, and the designs, data and accounts (hosting, app stores, payments) are in your company’s name.' },
  { q: 'Will you sign an NDA?', a: 'Yes. If you want one, we sign a non-disclosure agreement before you share the details of your idea. Tick the NDA box on the contact form and we will send it first.' },
  { q: 'Why Flutter and not native apps?', a: 'Flutter gives you Android and iOS apps from one codebase with smooth native performance, so you pay one team instead of two. We build natively in Kotlin or Swift only when an app leans hard on the device, and we explain why before you pay for it.' },
  { q: 'Do you work with clients outside Chennai?', a: 'Yes. Our office is in Navalur on OMR, Chennai, and we work with clients anywhere over video calls, with weekly demos and a shared staging link.' },
  { q: 'What happens after launch?', a: 'We watch for errors, fix what breaks and keep adding features on a monthly support plan. If you would rather take it in-house, we hand over the code and documentation.' },
  // CONFIRM before enabling: { q: 'Do you provide GST invoices?', a: 'Yes, every invoice includes GST.' },
];

export const engagements = [
  { key: 'mvp', title: 'Fixed-scope MVP', fit: 'You have an idea and need a first version in front of real users.', how: 'We agree the scope in a short discovery, then build it for a fixed price and timeline. Changes are added as separate, priced items.', time: '6–12 weeks' },
  { key: 'team', title: 'Dedicated team', fit: 'You have a product and need a steady team to keep building it.', how: 'A small team (developer, designer, lead) works only on your product, with weekly demos and a shared roadmap. Billed monthly.', time: '3 months or more' },
  { key: 'tm', title: 'Time & materials', fit: 'The scope is still changing, or the work is a set of smaller tasks.', how: 'You pay for the hours worked, with a weekly report and a budget cap you set.', time: 'Flexible' },
  { key: 'support', title: 'Support & maintenance', fit: 'Your product is live and needs to stay healthy.', how: 'A monthly retainer covering monitoring, updates, fixes and a set number of improvement hours.', time: 'Monthly' },
];

// CONFIRM: these are promises to clients.
export const guarantees = [
  'You own all source code, designs and data from day one',
  'NDA signed before we see your idea, if you want one',
  'A staging version you can try during the whole project',
  'Weekly progress updates and demos',
  'Handover documentation at the end',
];

export const process = [
  { title: 'Discover', text: 'We learn your business, your users and what success looks like, then write down the scope together.' },
  { title: 'Design', text: 'We plan the screens and the data, and agree the timeline and price before building starts.' },
  { title: 'Build', text: 'We build in one- or two-week steps on a staging version you can try at any time.' },
  { title: 'Launch & support', text: 'We go live carefully, watch for errors, and stay with you to fix, improve and grow.' },
];

export const values = [
  { title: 'We build our own products', text: 'ZOBRA is ours. We know what it costs to run a product, not just to hand one over.' },
  { title: 'Correct before clever', text: 'Money, stock and personal data are handled on the server and tested before launch.' },
  { title: 'Plain communication', text: 'Weekly demos, written decisions and no jargon. You always know where the project stands.' },
  { title: 'Small, senior team', text: 'The people you meet are the people who build your product.' },
];

export const zobra = {
  summary: 'A hyperlocal shopping platform that connects customers with verified neighbourhood stores and local delivery riders.',
  metrics: [
    { value: '3', label: 'apps from one codebase: customer app, partner app, admin console' },
    { value: '78%', label: 'smaller first download after code splitting (1,763 kB → 390 kB)' },
    { value: '234', label: 'automated security and regression checks on the database' },
    { value: '10 min', label: 'store response window, with automatic cancel and stock restore' },
  ],
  challenge: [
    'Neighbourhood stores in Indian cities sell to people within a few kilometres, but most have no online ordering. Large quick-commerce apps run their own dark stores and do not help the local shop.',
    'We set out to build a platform where verified local stores sell online, local riders deliver, and the customer always orders from one store at a time, without mixing items from shops across the city.',
  ],
  built: [
    { title: 'ZOBRA customer app', text: 'Android app and website. Customers find open stores on a map, browse, order with cash on delivery and track their rider.' },
    { title: 'ZOBRA Partner app', text: 'One Android app for sellers and riders. Sellers accept orders, manage stock and outlets; riders pick up and deliver.' },
    { title: 'Seller portal', text: 'Multi-outlet stores with their own hours, delivery radius, staff and stock. Catalogue import from Excel or CSV.' },
    { title: 'Admin console', text: 'Seller verification, orders, cash reports, commission settings and review of customer issue reports.' },
  ],
  highlights: [
    ['One store per cart', 'A cart can only hold items from one outlet; switching asks the customer first. The database enforces it, not just the screen.'],
    ['Prices from the server', 'Checkout reads prices and stock from the database and places the order in one step, so a retry never creates a second order.'],
    ['Store accepts within 10 minutes', 'Every order waits for the store. If no one answers, a scheduled job cancels it and puts the stock back.'],
    ['Two-code handover', 'The store sees a pickup code, the customer a delivery code. Codes are stored hashed and lock after five wrong tries.'],
    ['Delivery radius checked at checkout', 'An order is refused if the customer’s pin is outside the store’s delivery radius.'],
    ['Rider privacy', 'A rider sees the customer’s address only after pickup is verified, and only until delivery.'],
    ['Error monitoring without personal data', 'Crash reports strip names, emails, phone numbers and codes before they leave the phone.'],
  ],
  stack: ['React', 'TypeScript', 'Tailwind CSS', 'Capacitor (Android)', 'Supabase', 'PostgreSQL', 'Google Maps Platform', 'Vercel', 'Sentry'],
  status: 'ZOBRA is being prepared for a pilot with local shops in Chennai.',
  // TODO optional: shown on the case study when filled.
  screenshots: [], // e.g. { src: '/assets/zobra/home.png', alt: 'ZOBRA customer home screen' }
  video: '',       // YouTube embed URL, e.g. 'https://www.youtube-nocookie.com/embed/VIDEO_ID'
  playStore: '',   // Google Play listing URL
};

export const posts = [
  {
    slug: 'building-a-hyperlocal-delivery-app',
    title: '7 lessons from building a hyperlocal delivery app',
    date: '2026-11-20',
    description: 'What we learned building ZOBRA: carts, prices, store response times, handover codes, delivery radius and rider privacy.',
    body: `
<p>ZOBRA lets customers order from verified shops in their neighbourhood, with local riders doing the delivery. It looks like a simple shopping app. Underneath, it is a three-sided marketplace where customers, stores and riders all need to trust the same system. These are the lessons that shaped it.</p>

<h2>1. One store per cart</h2>
<p>Letting a customer mix items from three shops sounds friendly, until one rider has to visit three shops and one of them is out of stock. We allow one outlet per cart. If the customer adds something from another store, the app asks before switching. The rule lives in the database, so no screen or old app version can break it.</p>

<h2>2. Never trust a price from the phone</h2>
<p>The app shows prices, but checkout ignores them. The server reads the current price and stock, locks the stock rows, places the order and clears the cart in a single step. Each checkout has an idempotency key, so a customer tapping “Place order” twice on a slow network gets one order, not two.</p>

<h2>3. Give the store a clock</h2>
<p>A local shop is not a warehouse. The owner might be serving someone at the counter. Every new order waits for the store to accept it, for up to ten minutes. If no one answers, a scheduled job cancels it, puts the stock back and tells the customer why. The customer is never left waiting on an order nobody is preparing.</p>

<h2>4. Two codes for the handover</h2>
<p>At pickup the store reads out a code the rider enters; at the door the customer does the same. The rider never sees either code. Codes are random, stored hashed, expire after ten minutes and lock after five wrong tries. Cash on delivery is only marked collected after the delivery code is confirmed.</p>

<h2>5. Check the distance on the server</h2>
<p>Every store has a delivery radius. The customer drops a pin on a map at checkout, and the server refuses the order if the pin is outside the radius. The map is for convenience; the server check is what keeps riders from being sent across the city.</p>

<h2>6. Riders see addresses only when they need them</h2>
<p>Before pickup, a rider sees only the store. The customer’s address and pin appear after the pickup code is verified, and disappear after delivery. It is a small rule that matters a lot to customers sharing their home address.</p>

<h2>7. Start with cash on delivery</h2>
<p>Online payments bring gateways, webhooks, refunds and reconciliation. For a pilot with local shops, cash on delivery covers most customers. We built the order flow so a payment gateway can be added later without changing how orders work.</p>

<h2>Building something similar?</h2>
<p>If you are planning a delivery, booking or marketplace product, we are happy to share what we learned. <a href="/contact/">Tell us about your project.</a></p>
`,
  },
];
