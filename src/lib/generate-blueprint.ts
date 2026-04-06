import type { Answers } from './types';

// Helper to safely read a string answer
function str(answers: Answers, key: string): string {
	const v = answers[key];
	return typeof v === 'string' ? v : '';
}

// Helper to safely read an array answer
function arr(answers: Answers, key: string): string[] {
	const v = answers[key];
	if (Array.isArray(v)) return v;
	if (typeof v === 'string' && v) return [v];
	return [];
}

// Helper to safely read a number answer
function num(answers: Answers, key: string): number {
	const v = answers[key];
	return typeof v === 'number' ? v : 0;
}

function has(answers: Answers, key: string, value: string): boolean {
	return arr(answers, key).includes(value);
}

// Derive appType from the split platform + appCategory questions
function deriveAppType(answers: Answers): string {
	const platform = str(answers, 'platform');
	const category = str(answers, 'appCategory');
	// If they picked a specific web category, use that
	if (category && category !== 'general' && category !== 'other') return category;
	// Otherwise fall back to platform
	return platform || 'web';
}

function techStackForAppType(appType: string): {
	frontend: string;
	backend: string;
	mobile: string;
	hosting: string;
} {
	switch (appType) {
		case 'web':
			return {
				frontend: 'SvelteKit 2 with Svelte 5 (runes mode) + TailwindCSS 4',
				backend: 'SvelteKit server routes (API endpoints) + Supabase Edge Functions',
				mobile: '',
				hosting: 'Vercel (recommended) or Cloudflare Pages'
			};
		case 'mobile':
			return {
				frontend: '',
				backend: 'Supabase (PostgreSQL + Auth + Realtime + Storage)',
				mobile: 'React Native with Expo SDK 52+ (or Flutter if preferred)',
				hosting: 'Supabase for backend; Expo EAS for app builds'
			};
		case 'both':
			return {
				frontend: 'SvelteKit 2 with Svelte 5 (runes mode) + TailwindCSS 4',
				backend: 'SvelteKit server routes + Supabase Edge Functions',
				mobile: 'React Native with Expo SDK 52+ sharing the Supabase backend',
				hosting: 'Vercel for web; Expo EAS for mobile builds; Supabase for backend'
			};
		case 'ecommerce':
			return {
				frontend: 'SvelteKit 2 with Svelte 5 + TailwindCSS 4 + Stripe Elements',
				backend: 'SvelteKit server routes + Supabase + Stripe Webhooks',
				mobile: '',
				hosting: 'Vercel with Edge Functions for Stripe webhook handling'
			};
		case 'blog':
			return {
				frontend: 'SvelteKit 2 with Svelte 5 + TailwindCSS 4 + MDsveX for Markdown',
				backend: 'SvelteKit with prerendered static pages where possible',
				mobile: '',
				hosting: 'Vercel or Cloudflare Pages (static + SSR hybrid)'
			};
		case 'saas':
			return {
				frontend: 'SvelteKit 2 with Svelte 5 + TailwindCSS 4 + shadcn-svelte',
				backend: 'SvelteKit server routes + Supabase + Stripe for billing',
				mobile: '',
				hosting: 'Vercel Pro with Supabase Pro for production SaaS'
			};
		case 'portfolio':
			return {
				frontend: 'SvelteKit 2 with Svelte 5 + TailwindCSS 4 + motion animations',
				backend: 'Minimal — mostly static with optional contact form endpoint',
				mobile: '',
				hosting: 'Vercel or Netlify (fully static or edge-rendered)'
			};
		default:
			return {
				frontend: 'SvelteKit 2 with Svelte 5 + TailwindCSS 4',
				backend: 'SvelteKit server routes + Supabase',
				mobile: '',
				hosting: 'Vercel'
			};
	}
}

function authSection(answers: Answers): string {
	const authMethod = str(answers, 'userAuth');
	const roles = arr(answers, 'userRoles');

	if (authMethod === 'none') {
		return [
			'## Authentication & Authorization',
			'',
			'No authentication is required for this project. The app is publicly accessible.',
			'',
			'If you add auth later, Supabase Auth is recommended for easy integration.',
			''
		].join('\n');
	}

	const lines: string[] = [
		'## Authentication & Authorization',
		'',
		'**Provider:** Supabase Auth (built-in with Supabase, supports all methods below)',
		''
	];

	switch (authMethod) {
		case 'email-password':
			lines.push('**Primary Method:** Email & Password');
			lines.push('- Use `supabase.auth.signUp({ email, password })` and `supabase.auth.signInWithPassword({ email, password })`');
			lines.push('- Implement email confirmation flow (Supabase sends confirmation emails automatically)');
			lines.push('- Add "Forgot Password" flow with `supabase.auth.resetPasswordForEmail()`');
			lines.push('- Store password resets and confirmations via Supabase email templates');
			break;
		case 'social':
			lines.push('**Primary Method:** Social / OAuth Login');
			lines.push('- Configure OAuth providers in Supabase Dashboard > Auth > Providers');
			lines.push('- **Google:** `supabase.auth.signInWithOAuth({ provider: "google" })`');
			lines.push('- **Apple:** `supabase.auth.signInWithOAuth({ provider: "apple" })` (required for iOS)');
			lines.push('- **GitHub:** `supabase.auth.signInWithOAuth({ provider: "github" })`');
			lines.push('- Handle OAuth redirect callbacks in your app (e.g., `/auth/callback` route)');
			lines.push('- Store each provider\'s `client_id` and `client_secret` in Supabase dashboard');
			break;
		case 'magic-link':
			lines.push('**Primary Method:** Magic Link (Passwordless)');
			lines.push('- Use `supabase.auth.signInWithOtp({ email })` to send a magic link');
			lines.push('- User clicks the link in their email to authenticate');
			lines.push('- Handle the auth callback to exchange the token');
			lines.push('- No password storage needed — simpler and more secure for users');
			break;
		case 'phone-sms':
			lines.push('**Primary Method:** Phone / SMS Authentication');
			lines.push('- Use `supabase.auth.signInWithOtp({ phone })` to send an SMS code');
			lines.push('- Verify with `supabase.auth.verifyOtp({ phone, token, type: "sms" })`');
			lines.push('- Configure Twilio in Supabase Dashboard > Auth > Providers > Phone');
			lines.push('- Budget for SMS costs (~$0.0075 per message via Twilio)');
			break;
	}

	lines.push('');

	if (roles.length > 0) {
		lines.push('**User Roles:**');
		lines.push('');
		lines.push('Create a `user_roles` enum type and store the role on the `profiles` table:');
		lines.push('');
		lines.push('```sql');
		lines.push(`CREATE TYPE user_role AS ENUM (${roles.map((r) => `'${r}'`).join(', ')});`);
		lines.push('ALTER TABLE profiles ADD COLUMN role user_role DEFAULT \'regular\';');
		lines.push('```');
		lines.push('');

		for (const role of roles) {
			switch (role) {
				case 'regular':
					lines.push('- **Regular Users:** Can view content, manage their own profile, interact with features');
					break;
				case 'admin':
					lines.push('- **Admin/Moderators:** Full access to admin dashboard, can manage all users and content, configure app settings');
					break;
				case 'premium':
					lines.push('- **Premium Users:** Access to premium features, priority support, extended limits');
					break;
				case 'vendors':
					lines.push('- **Vendors/Sellers:** Can create product listings, manage inventory, view sales analytics, handle orders');
					break;
				case 'creators':
					lines.push('- **Content Creators:** Can publish content, access creator analytics, manage their audience');
					break;
				case 'support':
					lines.push('- **Support Staff:** Can view user reports, respond to tickets, access moderation tools');
					break;
			}
		}

		lines.push('');
		lines.push('**Enforce roles** using Supabase Row Level Security (RLS) policies and a server-side `getRole()` helper that reads `profiles.role` from the authenticated session.');
		lines.push('');
	}

	return lines.join('\n');
}

function databaseSection(answers: Answers): string {
	const features = arr(answers, 'coreFeatures');
	const contentTypes = arr(answers, 'contentType');
	const roles = arr(answers, 'userRoles');
	const authMethod = str(answers, 'userAuth');
	const monetization = str(answers, 'monetization');

	const lines: string[] = [
		'## Database Schema',
		'',
		'**Database:** Supabase (PostgreSQL 15+)',
		'**ORM:** Use Supabase JS client directly with TypeScript types generated via `supabase gen types typescript`',
		'',
		'### Core Tables',
		''
	];

	// Users / profiles table (if auth exists)
	if (authMethod !== 'none') {
		lines.push('#### `profiles`');
		lines.push('Extends Supabase `auth.users` via a trigger on sign-up.');
		lines.push('```sql');
		lines.push('CREATE TABLE profiles (');
		lines.push('  id UUID REFERENCES auth.users(id) PRIMARY KEY,');
		lines.push('  email TEXT NOT NULL,');
		lines.push('  display_name TEXT,');
		lines.push('  avatar_url TEXT,');
		if (roles.includes('admin') || roles.includes('premium') || roles.includes('vendors') || roles.includes('creators') || roles.includes('support')) {
			lines.push("  role user_role DEFAULT 'regular',");
		}
		if (features.includes('profiles')) {
			lines.push('  bio TEXT,');
			lines.push('  website TEXT,');
			lines.push('  location TEXT,');
		}
		if (monetization === 'subscriptions' || monetization === 'freemium') {
			lines.push('  stripe_customer_id TEXT,');
			lines.push('  subscription_status TEXT,');
			lines.push('  subscription_tier TEXT,');
		}
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW(),');
		lines.push('  updated_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('```');
		lines.push('');
	}

	// Content tables
	if (contentTypes.includes('text-posts')) {
		lines.push('#### `posts`');
		lines.push('```sql');
		lines.push('CREATE TABLE posts (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		if (authMethod !== 'none') lines.push('  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push("  title TEXT NOT NULL,");
		lines.push("  slug TEXT UNIQUE NOT NULL,");
		lines.push("  body TEXT NOT NULL,");
		lines.push("  excerpt TEXT,");
		lines.push("  published BOOLEAN DEFAULT FALSE,");
		lines.push("  published_at TIMESTAMPTZ,");
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW(),');
		lines.push('  updated_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('CREATE INDEX idx_posts_slug ON posts(slug);');
		lines.push('CREATE INDEX idx_posts_published ON posts(published, published_at DESC);');
		lines.push('```');
		lines.push('');
	}

	if (contentTypes.includes('products')) {
		lines.push('#### `products`');
		lines.push('```sql');
		lines.push('CREATE TABLE products (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		if (roles.includes('vendors')) lines.push('  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push('  name TEXT NOT NULL,');
		lines.push('  slug TEXT UNIQUE NOT NULL,');
		lines.push('  description TEXT,');
		lines.push('  price_cents INTEGER NOT NULL,');
		lines.push('  currency TEXT DEFAULT \'usd\',');
		lines.push('  image_urls TEXT[],');
		lines.push('  stock_count INTEGER DEFAULT 0,');
		lines.push('  is_active BOOLEAN DEFAULT TRUE,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW(),');
		lines.push('  updated_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('```');
		lines.push('');
	}

	if (contentTypes.includes('images') || contentTypes.includes('videos')) {
		lines.push('#### `media`');
		lines.push('```sql');
		lines.push('CREATE TABLE media (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		if (authMethod !== 'none') lines.push('  uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,');
		lines.push("  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document')),");
		lines.push('  url TEXT NOT NULL,');
		lines.push('  filename TEXT,');
		lines.push('  size_bytes BIGINT,');
		lines.push('  mime_type TEXT,');
		lines.push('  alt_text TEXT,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('```');
		lines.push('');
	}

	if (contentTypes.includes('events') || features.includes('calendar')) {
		lines.push('#### `events`');
		lines.push('```sql');
		lines.push('CREATE TABLE events (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		if (authMethod !== 'none') lines.push('  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push('  title TEXT NOT NULL,');
		lines.push('  description TEXT,');
		lines.push('  location TEXT,');
		lines.push('  starts_at TIMESTAMPTZ NOT NULL,');
		lines.push('  ends_at TIMESTAMPTZ,');
		lines.push('  max_attendees INTEGER,');
		lines.push('  is_public BOOLEAN DEFAULT TRUE,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('```');
		lines.push('');
	}

	if (contentTypes.includes('courses')) {
		lines.push('#### `courses` and `lessons`');
		lines.push('```sql');
		lines.push('CREATE TABLE courses (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		if (authMethod !== 'none') lines.push('  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push('  title TEXT NOT NULL,');
		lines.push('  description TEXT,');
		lines.push('  is_published BOOLEAN DEFAULT FALSE,');
		lines.push('  price_cents INTEGER DEFAULT 0,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('');
		lines.push('CREATE TABLE lessons (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		lines.push('  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,');
		lines.push('  title TEXT NOT NULL,');
		lines.push('  content TEXT,');
		lines.push('  video_url TEXT,');
		lines.push('  sort_order INTEGER DEFAULT 0,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('```');
		lines.push('');
	}

	// Feature-driven tables
	if (features.includes('chat')) {
		lines.push('#### `conversations` and `messages` (Real-time Chat)');
		lines.push('```sql');
		lines.push('CREATE TABLE conversations (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		lines.push('  is_group BOOLEAN DEFAULT FALSE,');
		lines.push('  name TEXT,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('');
		lines.push('CREATE TABLE conversation_members (');
		lines.push('  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,');
		lines.push('  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push('  joined_at TIMESTAMPTZ DEFAULT NOW(),');
		lines.push('  PRIMARY KEY (conversation_id, user_id)');
		lines.push(');');
		lines.push('');
		lines.push('CREATE TABLE messages (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		lines.push('  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,');
		lines.push('  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,');
		lines.push('  body TEXT NOT NULL,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);');
		lines.push('```');
		lines.push('Use **Supabase Realtime** subscriptions on the `messages` table for live updates.');
		lines.push('');
	}

	if (features.includes('comments')) {
		lines.push('#### `comments`');
		lines.push('```sql');
		lines.push('CREATE TABLE comments (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		if (authMethod !== 'none') lines.push('  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push('  target_type TEXT NOT NULL,');
		lines.push('  target_id UUID NOT NULL,');
		lines.push('  body TEXT NOT NULL,');
		lines.push('  rating INTEGER CHECK (rating >= 1 AND rating <= 5),');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('CREATE INDEX idx_comments_target ON comments(target_type, target_id);');
		lines.push('```');
		lines.push('');
	}

	if (features.includes('notifications')) {
		lines.push('#### `notifications`');
		lines.push('```sql');
		lines.push('CREATE TABLE notifications (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		lines.push('  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push("  type TEXT NOT NULL,");
		lines.push('  title TEXT NOT NULL,');
		lines.push('  body TEXT,');
		lines.push('  link TEXT,');
		lines.push('  read BOOLEAN DEFAULT FALSE,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);');
		lines.push('```');
		lines.push('');
	}

	// Monetization tables
	if (monetization === 'subscriptions' || monetization === 'freemium') {
		lines.push('#### `subscriptions` (Stripe integration)');
		lines.push('```sql');
		lines.push('CREATE TABLE subscriptions (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		lines.push('  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,');
		lines.push('  stripe_subscription_id TEXT UNIQUE,');
		lines.push('  stripe_price_id TEXT,');
		lines.push("  status TEXT NOT NULL DEFAULT 'inactive',");
		lines.push('  current_period_start TIMESTAMPTZ,');
		lines.push('  current_period_end TIMESTAMPTZ,');
		lines.push('  cancel_at TIMESTAMPTZ,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('```');
		lines.push('');
	}

	if (monetization === 'marketplace') {
		lines.push('#### `orders` and `order_items`');
		lines.push('```sql');
		lines.push('CREATE TABLE orders (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		lines.push('  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,');
		lines.push('  total_cents INTEGER NOT NULL,');
		lines.push('  platform_fee_cents INTEGER NOT NULL,');
		lines.push("  status TEXT DEFAULT 'pending',");
		lines.push('  stripe_payment_intent_id TEXT,');
		lines.push('  created_at TIMESTAMPTZ DEFAULT NOW()');
		lines.push(');');
		lines.push('');
		lines.push('CREATE TABLE order_items (');
		lines.push('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
		lines.push('  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,');
		lines.push('  product_id UUID REFERENCES products(id),');
		lines.push('  seller_id UUID REFERENCES profiles(id),');
		lines.push('  quantity INTEGER DEFAULT 1,');
		lines.push('  price_cents INTEGER NOT NULL');
		lines.push(');');
		lines.push('```');
		lines.push('');
	}

	lines.push('**Row Level Security (RLS):** Enable RLS on all tables. Write policies so users can only read/write their own data, and admins can access everything.');
	lines.push('');

	return lines.join('\n');
}

function coreFeaturesSection(answers: Answers): string {
	const features = arr(answers, 'coreFeatures');
	if (features.length === 0) {
		return '## Core Features\n\nNo specific features were selected. Define features based on the project description above.\n\n';
	}

	const lines: string[] = ['## Core Features', ''];

	const featureDetails: Record<string, string[]> = {
		profiles: [
			'### User Profiles',
			'- Profile page at `/profile/[username]` or `/profile/[id]`',
			'- Editable fields: display name, avatar (upload to Supabase Storage), bio, website, location',
			'- Profile picture upload with image cropping (use `svelte-easy-crop` or similar)',
			'- Public profile view vs. private edit view',
			'- Activity feed on profile (recent posts, comments, etc.)'
		],
		search: [
			'### Search & Filters',
			'- Full-text search using PostgreSQL `tsvector` and `ts_query`',
			'- Create GIN indexes on searchable columns for performance',
			'- Implement search endpoint: `GET /api/search?q=term&type=posts&sort=recent`',
			'- Client-side debounced search input (300ms delay)',
			'- Faceted filters (by category, date range, status, etc.)',
			'- Consider `pg_trgm` extension for fuzzy matching'
		],
		chat: [
			'### Real-time Chat / Messaging',
			'- Use **Supabase Realtime** to subscribe to new messages',
			'- Direct messages (1:1) and group conversations',
			'- Message list with infinite scroll (load older messages on scroll up)',
			'- Typing indicators via Supabase Realtime Presence',
			'- Unread message count badge in nav',
			'- Optional: file/image attachments in messages (upload to Supabase Storage)'
		],
		notifications: [
			'### Notifications',
			'- In-app notification bell with unread count',
			'- Notification dropdown/panel listing recent notifications',
			'- Mark as read (single and "mark all as read")',
			'- Notification types: system, mention, reply, follow, order update, etc.',
			'- Optional: email notification digests (daily/weekly via cron + email service)',
			'- Store in `notifications` table, query with RLS so users see only their own'
		],
		'file-upload': [
			'### File Upload & Storage',
			'- Use **Supabase Storage** with signed URLs for private files',
			'- Create storage buckets: `avatars`, `uploads`, `documents`',
			'- Client-side: drag-and-drop zone with progress indicator',
			'- Server-side: validate file type and size before upload (max 10MB default)',
			'- Generate thumbnails for images (use Supabase Image Transformations or a Supabase Edge Function)',
			'- Set CORS and bucket policies in Supabase Dashboard'
		],
		comments: [
			'### Comments & Reviews',
			'- Polymorphic comments: `target_type` + `target_id` pattern to attach to any entity',
			'- Nested replies (optional, use `parent_id` column for threading)',
			'- Star ratings (1-5) for review-style comments',
			'- Edit and delete own comments',
			'- Admin moderation: flag, hide, or delete inappropriate comments',
			'- Paginated comment loading with "Load more" button'
		],
		dashboard: [
			'### Dashboard & Analytics',
			'- Summary cards: total users, revenue, content count, active sessions',
			'- Charts using `chart.js` with `svelte-chartjs` or `layerchart`',
			'- Date range picker for filtering analytics data',
			'- Export data as CSV',
			'- Real-time counters for active users (Supabase Realtime Presence)',
			'- Role-gated: only admins and relevant roles can view'
		],
		'social-sharing': [
			'### Social Sharing',
			'- Share buttons for Twitter/X, Facebook, LinkedIn, WhatsApp, email',
			'- Open Graph meta tags on shareable pages (`og:title`, `og:description`, `og:image`)',
			'- Generate dynamic OG images using `@vercel/og` or `satori`',
			'- Copy-to-clipboard share link button',
			'- Track share events in analytics'
		],
		calendar: [
			'### Calendar & Scheduling',
			'- Calendar view component (month/week/day views)',
			'- Event creation with date/time pickers',
			'- RSVP / booking system with attendee limits',
			'- Recurring events support (iCal-compatible)',
			'- Timezone-aware date handling (use `date-fns` with `date-fns-tz`)',
			'- Optional: integrate with Google Calendar API for syncing'
		],
		maps: [
			'### Maps & Location',
			'- Interactive map using **Mapbox GL JS** or **Google Maps JavaScript API**',
			'- Marker clustering for large datasets',
			'- Geocoding: convert addresses to lat/lng (Mapbox Geocoding API)',
			'- Location search with autocomplete',
			'- User location detection via browser Geolocation API (with permission)',
			'- Store coordinates as `POINT` type in PostgreSQL with PostGIS extension'
		]
	};

	for (const f of features) {
		if (featureDetails[f]) {
			lines.push(...featureDetails[f]);
			lines.push('');
		}
	}

	return lines.join('\n');
}

function contentSection(answers: Answers): string {
	const contentTypes = arr(answers, 'contentType');
	if (contentTypes.length === 0) {
		return '## Content Management\n\nNo specific content types selected. Adapt the data model as your content needs emerge.\n\n';
	}

	const lines: string[] = ['## Content Management', ''];

	const contentDetails: Record<string, string[]> = {
		'text-posts': [
			'### Text Posts / Articles',
			'- Rich text editor: use **TipTap** (ProseMirror-based) or **Editor.js** for block-style editing',
			'- Markdown support with live preview as an alternative',
			'- Auto-generate slugs from titles (slugify, ensure uniqueness)',
			'- Draft / Published status workflow',
			'- Tags and categories for organization (many-to-many via junction table)',
			'- SEO fields: meta title, meta description, canonical URL'
		],
		images: [
			'### Images / Photos',
			'- Upload to Supabase Storage bucket `images`',
			'- Auto-generate responsive sizes using Supabase Image Transformations (or Sharp in an Edge Function)',
			'- Lazy loading with blur placeholder (generate base64 thumbs on upload)',
			'- Gallery/grid layout with lightbox viewer',
			'- Alt text field for accessibility',
			'- EXIF data stripping for privacy'
		],
		videos: [
			'### Videos',
			'- For user-uploaded videos: upload to **Cloudinary** or **Mux** for transcoding and streaming',
			'- Alternatively: store in Supabase Storage for small videos, link to YouTube/Vimeo for large ones',
			'- Video player component with playback controls',
			'- Thumbnail generation (either client-side canvas capture or server-side via ffmpeg Edge Function)',
			'- Consider HLS streaming for large files (Mux provides this out of the box)'
		],
		documents: [
			'### Documents / PDFs',
			'- Upload to Supabase Storage bucket `documents` with proper MIME type validation',
			'- PDF viewer component (use `pdfjs-dist` for in-browser rendering)',
			'- Document metadata: title, description, file size, page count',
			'- Access control: private documents visible only to owner or shared users',
			'- Download tracking for analytics'
		],
		products: [
			'### Products / Listings',
			'- Product detail pages at `/products/[slug]`',
			'- Multiple product images (carousel/gallery)',
			'- Variants: size, color, etc. (store as JSONB or a `product_variants` table)',
			'- Inventory tracking with stock count',
			'- Category and tag taxonomies',
			'- Price display with currency formatting (`Intl.NumberFormat`)'
		],
		ugc: [
			'### User-Generated Content',
			'- Content submission form with validation',
			'- Moderation queue: new submissions go to "pending" status',
			'- Admin approval workflow before public visibility',
			'- Content reporting: users can flag inappropriate content',
			'- Rate limiting on submissions to prevent spam',
			'- Content ownership: users can edit/delete their own submissions'
		],
		courses: [
			'### Courses / Lessons',
			'- Course structure: Course > Sections > Lessons',
			'- Lesson types: text, video, quiz, assignment',
			'- Progress tracking per user (store in `user_course_progress` table)',
			'- Completion certificates (generate PDF on completion)',
			'- Drip content: release lessons on a schedule',
			'- Course landing page with curriculum preview'
		],
		events: [
			'### Events',
			'- Event listing page with upcoming/past filters',
			'- Event detail page with RSVP functionality',
			'- Capacity management with waitlist',
			'- Event categories and location-based discovery',
			'- Calendar export (`.ics` file generation)',
			'- Reminder emails before event start (cron job + email service)'
		]
	};

	for (const ct of contentTypes) {
		if (contentDetails[ct]) {
			lines.push(...contentDetails[ct]);
			lines.push('');
		}
	}

	return lines.join('\n');
}

function adminSection(answers: Answers): string {
	const roles = arr(answers, 'userRoles');
	if (!roles.includes('admin')) {
		return '';
	}

	return [
		'## Admin & Moderation',
		'',
		'Build an admin dashboard at `/admin` (protected by role check middleware):',
		'',
		'### Admin Dashboard Features',
		'- **User Management:** List, search, and filter users. Change roles, suspend accounts, reset passwords.',
		'- **Content Moderation:** Review flagged content, approve/reject pending submissions, bulk actions.',
		'- **Analytics Overview:** User growth chart, active users, content volume, revenue (if monetized).',
		'- **System Settings:** App configuration, feature toggles, email templates.',
		'- **Audit Log:** Track admin actions (who did what, when) in an `audit_log` table.',
		'',
		'### Moderation Tools',
		'- Content flagging system: users report content, admins review queue',
		'- Automated content filtering (optional): integrate a profanity filter or AI moderation',
		'- Ban/suspend users with reason tracking',
		'- Bulk actions: select multiple items, approve/reject/delete in batch',
		'',
		'### Implementation Notes',
		'- Use SvelteKit layout groups: `(admin)/+layout.server.ts` to gate all admin routes',
		'- In the layout `load` function, check `profiles.role` and redirect non-admins to `/`',
		'- Build admin UI components with data tables (sortable, filterable, paginated)',
		''
	].join('\n');
}

function integrationsSection(answers: Answers): string {
	const integrations = arr(answers, 'integrations');
	if (integrations.length === 0) {
		return '## Third-Party Integrations\n\nNo third-party integrations were selected. You can add integrations later as needs arise.\n\n';
	}

	const lines: string[] = ['## Third-Party Integrations', ''];

	const integrationDetails: Record<string, string[]> = {
		payments: [
			'### Payment Processing — Stripe',
			'- **Package:** `stripe` (Node SDK) + `@stripe/stripe-js` (client-side)',
			'- Create a `POST /api/stripe/checkout` endpoint to create Checkout Sessions',
			'- Handle webhooks at `POST /api/stripe/webhook` — verify signatures with `stripe.webhooks.constructEvent()`',
			'- Key events to handle: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`',
			'- Store `stripe_customer_id` on user profile for linking',
			'- Use Stripe Customer Portal for self-service subscription management',
			'- **Test mode:** Use `sk_test_...` keys during development'
		],
		email: [
			'### Email Service — Resend (recommended) or SendGrid',
			'- **Package:** `resend` (simpler API) or `@sendgrid/mail`',
			'- Set up transactional emails: welcome, password reset, order confirmation, notifications',
			'- Create email templates using React Email (works with Resend) or HTML templates',
			'- Configure SPF, DKIM, and DMARC records for your sending domain',
			'- Implement email queue for bulk sends to avoid rate limits',
			'- **Resend setup:** `const resend = new Resend(RESEND_API_KEY); await resend.emails.send({...})`'
		],
		storage: [
			'### Cloud Storage — Supabase Storage (primary) + Cloudinary (images)',
			'- **Supabase Storage** is included with your Supabase project — use it for general file storage',
			'- **Cloudinary** (optional): for advanced image transformations, auto-optimization, and CDN delivery',
			'- **Package:** `cloudinary` (Node SDK) if using Cloudinary',
			'- Set up Supabase Storage buckets with appropriate policies (public vs private)',
			'- Use signed URLs for private file access with expiration'
		],
		analytics: [
			'### Analytics — Plausible (privacy-first) or Google Analytics',
			'- **Recommended:** Plausible Analytics (privacy-friendly, no cookie banner needed, GDPR compliant)',
			'- **Alternative:** Google Analytics 4 with `@analytics/google-analytics` package',
			'- Track key events: sign up, purchase, content creation, feature usage',
			'- Server-side analytics for API usage tracking',
			'- Custom dashboards: build internal analytics using your own `events` table in Supabase'
		],
		maps: [
			'### Maps — Mapbox GL JS',
			'- **Package:** `mapbox-gl` + `@types/mapbox-gl`',
			'- Get API token from mapbox.com (free tier: 50K map loads/month)',
			'- Geocoding: `@mapbox/mapbox-sdk` for forward/reverse geocoding',
			'- Alternative: **Google Maps** via `@googlemaps/js-api-loader` (usage-based pricing)',
			'- Store coordinates in PostgreSQL as `DOUBLE PRECISION` lat/lng columns, or use PostGIS for advanced geo queries',
			'- Enable PostGIS: `CREATE EXTENSION IF NOT EXISTS postgis;`'
		],
		'social-apis': [
			'### Social Media APIs',
			'- **Twitter/X API:** Post updates, embed tweets — use `twitter-api-v2` package',
			'- **Facebook/Instagram Graph API:** Share content, pull media — use `facebook-nodejs-business-sdk`',
			'- **LinkedIn API:** Share professional content — use REST API with `fetch`',
			'- Store API tokens securely in environment variables',
			'- Implement OAuth2 flow for users connecting their social accounts',
			'- Rate limit awareness: cache API responses, use webhooks where available'
		],
		'ai-ml': [
			'### AI / ML Features',
			'- **Recommended:** OpenAI API (`openai` package) or Anthropic Claude API (`@anthropic-ai/sdk`)',
			'- Use cases: content recommendations, text summarization, search enhancement, chatbot',
			'- **Vector search:** Use Supabase pgvector extension for similarity search',
			'  - `CREATE EXTENSION IF NOT EXISTS vector;`',
			'  - Store embeddings in a `VECTOR(1536)` column (OpenAI embedding dimension)',
			'- **Cost management:** Cache AI responses, set usage limits per user, use streaming for long responses',
			'- Implement as server-side API routes (never expose API keys to client)'
		],
		crm: [
			'### CRM Integration',
			'- **HubSpot:** Use `@hubspot/api-client` — sync contacts, deals, and activities',
			'- **Alternative:** Salesforce via `jsforce` package',
			'- Sync user sign-ups to CRM as new contacts',
			'- Track key events (purchase, upgrade, churn) as CRM activities',
			'- Bidirectional sync: webhook handlers for CRM-initiated changes',
			'- Use a queue (BullMQ or Supabase Edge Function cron) for reliable sync'
		]
	};

	for (const i of integrations) {
		if (integrationDetails[i]) {
			lines.push(...integrationDetails[i]);
			lines.push('');
		}
	}

	return lines.join('\n');
}

function seoSection(answers: Answers): string {
	const appType = deriveAppType(answers);

	const lines: string[] = [
		'## SEO & Discoverability',
		''
	];

	// Mobile-only apps don't need traditional SEO
	if (appType === 'mobile') {
		lines.push('Since this is a mobile-only app, traditional web SEO is less relevant. Focus on:');
		lines.push('- **App Store Optimization (ASO):** Keyword-rich title and description, compelling screenshots, review solicitation');
		lines.push('- **Deep linking:** Configure universal links (iOS) and app links (Android) for content sharing');
		lines.push('- **Landing page:** Build a simple marketing website with download links, feature highlights, and social proof');
		lines.push('');
		return lines.join('\n');
	}

	lines.push('### Meta Tags (in `+page.svelte` or `+layout.svelte`)');
	lines.push('- Set `<title>` and `<meta name="description">` on every page');
	lines.push('- Use SvelteKit\'s `<svelte:head>` for per-page meta tags');
	lines.push('- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`');
	lines.push('- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`');
	lines.push('');
	lines.push('### Technical SEO');
	lines.push('- Generate `sitemap.xml` at `/sitemap.xml` — use a SvelteKit server route that queries all public pages');
	lines.push('- Generate `robots.txt` at `/robots.txt` — allow all crawlers, reference sitemap');
	lines.push('- Implement canonical URLs to prevent duplicate content');
	lines.push('- Add structured data (JSON-LD) for rich search results:');

	if (appType === 'ecommerce') {
		lines.push('  - `Product` schema for product pages');
		lines.push('  - `BreadcrumbList` for category navigation');
		lines.push('  - `Review` and `AggregateRating` for product reviews');
	} else if (appType === 'blog') {
		lines.push('  - `Article` or `BlogPosting` schema for posts');
		lines.push('  - `BreadcrumbList` for navigation');
		lines.push('  - `Person` schema for author pages');
	} else {
		lines.push('  - `WebApplication` schema for the app');
		lines.push('  - `Organization` schema for the business');
		lines.push('  - `BreadcrumbList` for navigation');
	}

	lines.push('');
	lines.push('### Performance (Core Web Vitals)');
	lines.push('- Use SvelteKit\'s built-in SSR for fast First Contentful Paint');
	lines.push('- Optimize images: use `<img loading="lazy">`, serve WebP/AVIF formats');
	lines.push('- Minimize JavaScript bundle: SvelteKit\'s code splitting handles this, but audit with `vite-bundle-visualizer`');
	lines.push('- Cache static assets with long `Cache-Control` headers (Vercel handles this automatically)');
	lines.push('');

	return lines.join('\n');
}

function testingSection(answers: Answers): string {
	const complexity = num(answers, 'complexity');

	const lines: string[] = ['## Testing Strategy', ''];

	if (complexity <= 2) {
		lines.push('Given the project\'s simpler scope, focus on high-value tests:');
		lines.push('');
		lines.push('- **Unit Tests** with Vitest: test utility functions, data transformations, and form validation logic');
		lines.push('- **Component Tests** with Vitest + `@testing-library/svelte`: test key interactive components');
		lines.push('- **Manual Testing Checklist:** Create a checklist of critical user flows to test before each deploy');
		lines.push('');
		lines.push('```bash');
		lines.push('npm install -D vitest @testing-library/svelte jsdom');
		lines.push('```');
	} else if (complexity <= 3) {
		lines.push('With moderate complexity, implement a balanced testing approach:');
		lines.push('');
		lines.push('- **Unit Tests** (Vitest): Cover business logic, utilities, API handlers, and data validation');
		lines.push('- **Component Tests** (`@testing-library/svelte`): Test form components, interactive elements, conditional rendering');
		lines.push('- **Integration Tests** (Vitest): Test API endpoints with mocked Supabase client');
		lines.push('- **E2E Tests** (Playwright): Cover the 3-5 most critical user flows (sign up, core feature, payment if applicable)');
		lines.push('');
		lines.push('```bash');
		lines.push('npm install -D vitest @testing-library/svelte jsdom playwright @playwright/test');
		lines.push('```');
	} else {
		lines.push('For a complex/enterprise app, invest in comprehensive testing:');
		lines.push('');
		lines.push('- **Unit Tests** (Vitest): Cover all business logic, utilities, data transformations, validation schemas');
		lines.push('- **Component Tests** (`@testing-library/svelte`): Test all interactive components, form flows, error states');
		lines.push('- **Integration Tests** (Vitest + supertest): Test all API endpoints, webhook handlers, auth flows');
		lines.push('- **E2E Tests** (Playwright): Cover all critical paths, role-based access, payment flows, edge cases');
		lines.push('- **Visual Regression Tests** (Playwright screenshots or Chromatic): Catch unintended UI changes');
		lines.push('- **Load Testing** (k6 or Artillery): Test API performance under expected load');
		lines.push('- **CI Pipeline:** Run all tests on every PR via GitHub Actions');
		lines.push('');
		lines.push('```bash');
		lines.push('npm install -D vitest @testing-library/svelte jsdom playwright @playwright/test');
		lines.push('# Load testing (run separately)');
		lines.push('npm install -D k6');
		lines.push('```');
	}

	lines.push('');
	lines.push('**Test file convention:** Place tests adjacent to source files as `*.test.ts` or in a `__tests__` directory.');
	lines.push('');

	return lines.join('\n');
}

function documentationSection(answers: Answers): string {
	const complexity = num(answers, 'complexity');

	const lines: string[] = ['## Documentation', ''];
	lines.push('Write and maintain these docs:');
	lines.push('');
	lines.push('- **README.md:** Project overview, setup instructions, environment variables, dev commands');
	lines.push('- **CONTRIBUTING.md:** Branch naming, commit conventions, PR process');

	if (complexity >= 3) {
		lines.push('- **Architecture Decision Records (ADRs):** Document key technical decisions in `docs/adr/`');
		lines.push('- **API Documentation:** Document all API endpoints (method, path, request/response shapes, auth requirements)');
	}
	if (complexity >= 4) {
		lines.push('- **Deployment Guide:** Step-by-step deployment to production with environment configuration');
		lines.push('- **Runbook:** Common operational tasks, troubleshooting, incident response');
	}

	lines.push('- **Environment Variables:** Document every `env` variable with description and example values in `.env.example`');
	lines.push('');

	return lines.join('\n');
}

function securitySection(answers: Answers): string {
	const authMethod = str(answers, 'userAuth');
	const features = arr(answers, 'coreFeatures');
	const integrations = arr(answers, 'integrations');
	const monetization = str(answers, 'monetization');

	const lines: string[] = ['## Security Considerations', ''];

	if (authMethod !== 'none') {
		lines.push('### Authentication Security');
		lines.push('- Store all secrets in environment variables — never commit `.env` files');
		lines.push('- Use Supabase\'s built-in auth (handles password hashing, token management, session refresh)');
		lines.push('- Set short JWT expiry (1 hour) with refresh tokens (Supabase default behavior)');
		lines.push('- Implement account lockout after 5 failed login attempts');
		lines.push('');
	}

	lines.push('### Data Validation');
	lines.push('- Validate ALL inputs server-side using **Zod** schemas');
	lines.push('- Never trust client-side validation alone');
	lines.push('- Sanitize user-generated HTML to prevent XSS (use `DOMPurify` or `sanitize-html`)');
	lines.push('- Use parameterized queries (Supabase client does this by default — never build raw SQL strings)');
	lines.push('');

	lines.push('### CSRF & Request Security');
	lines.push('- SvelteKit has built-in CSRF protection for form actions (enabled by default)');
	lines.push('- For API routes: validate `Origin` header matches your domain');
	lines.push('- Set security headers in `hooks.server.ts`:');
	lines.push('  - `X-Frame-Options: DENY`');
	lines.push('  - `X-Content-Type-Options: nosniff`');
	lines.push('  - `Referrer-Policy: strict-origin-when-cross-origin`');
	lines.push('  - `Content-Security-Policy` (configure based on your needs)');
	lines.push('');

	lines.push('### Rate Limiting');
	lines.push('- Rate limit API endpoints (especially auth and form submissions)');
	lines.push('- Use in-memory rate limiting for simple cases or `@upstash/ratelimit` with Redis for distributed');
	lines.push('- Recommended limits: 10 login attempts/hour, 100 API calls/minute per IP');
	lines.push('');

	if (features.includes('file-upload')) {
		lines.push('### File Upload Security');
		lines.push('- Validate file MIME types server-side (don\'t rely on extension)');
		lines.push('- Set maximum file size limits (10MB default, adjust as needed)');
		lines.push('- Scan uploaded files for malware if handling sensitive data');
		lines.push('- Store uploads in a separate domain/bucket to prevent cookie-based attacks');
		lines.push('');
	}

	if (integrations.includes('payments') || monetization !== 'free') {
		lines.push('### Payment Security');
		lines.push('- Never handle raw credit card data — use Stripe\'s client-side tokenization');
		lines.push('- Verify Stripe webhook signatures to prevent spoofed events');
		lines.push('- Log all payment events for audit trail');
		lines.push('- Use Stripe\'s test mode during development (`sk_test_` keys)');
		lines.push('');
	}

	lines.push('### Row Level Security (RLS)');
	lines.push('- Enable RLS on EVERY Supabase table');
	lines.push('- Write explicit policies: users should only see/modify their own data');
	lines.push('- Test RLS policies: try accessing data as different roles to verify');
	lines.push('- Admin bypass: create admin-specific policies that check `profiles.role`');
	lines.push('');

	return lines.join('\n');
}

function codeConventionsSection(answers: Answers): string {
	const appType = deriveAppType(answers);
	const hasMobile = appType === 'mobile' || appType === 'both';

	const lines: string[] = [
		'## Code Conventions',
		'',
		'### TypeScript',
		'- Enable `strict: true` in `tsconfig.json`',
		'- Use explicit types for function parameters and return values',
		'- Prefer `interface` over `type` for object shapes',
		'- Use `unknown` instead of `any` — cast explicitly when needed',
		'',
		'### Naming Conventions',
		'- **Files:** `kebab-case.ts` for modules, `PascalCase.svelte` for components',
		'- **Variables/Functions:** `camelCase`',
		'- **Types/Interfaces:** `PascalCase`',
		'- **Constants:** `UPPER_SNAKE_CASE` for true constants, `camelCase` for derived values',
		'- **Database columns:** `snake_case`',
		'- **API routes:** `/api/kebab-case`',
		''
	];

	lines.push('### SvelteKit Project Structure');
	lines.push('```');
	lines.push('src/');
	lines.push('  lib/');
	lines.push('    components/     # Reusable Svelte components');
	lines.push('    server/         # Server-only modules (DB queries, auth helpers)');
	lines.push('    utils/          # Shared utility functions');
	lines.push('    types/          # TypeScript type definitions');
	lines.push('    stores/         # Svelte stores / runes-based state');
	lines.push('  routes/');
	lines.push('    (app)/          # Authenticated app routes (layout group)');
	lines.push('    (auth)/         # Auth pages: login, register, reset');
	lines.push('    (admin)/        # Admin dashboard (layout group)');
	lines.push('    (marketing)/    # Public pages: landing, pricing, about');
	lines.push('    api/            # Server API endpoints');
	lines.push('  hooks.server.ts   # Server hooks (auth, security headers)');
	lines.push('  hooks.client.ts   # Client hooks (error tracking)');
	lines.push('  app.d.ts          # SvelteKit type augmentations');
	lines.push('  app.css           # Global styles (TailwindCSS imports)');
	lines.push('```');
	lines.push('');

	if (hasMobile) {
		lines.push('### Mobile Project Structure (React Native / Expo)');
		lines.push('```');
		lines.push('mobile/');
		lines.push('  app/              # Expo Router file-based routes');
		lines.push('  components/       # Reusable React Native components');
		lines.push('  hooks/            # Custom React hooks');
		lines.push('  lib/              # Utilities, API client, Supabase client');
		lines.push('  constants/        # Colors, config, theme');
		lines.push('  assets/           # Images, fonts');
		lines.push('```');
		lines.push('');
	}

	lines.push('### Svelte 5 Conventions');
	lines.push('- Use **runes** (`$state`, `$derived`, `$effect`) instead of legacy reactive statements');
	lines.push('- Use `$props()` for component props instead of `export let`');
	lines.push('- Use `$bindable()` for two-way binding props');
	lines.push('- Prefer `{#snippet}` blocks over slots for composition');
	lines.push('- Use `.svelte.ts` extension for files that use runes outside components');
	lines.push('');

	return lines.join('\n');
}

function deliverablesSection(answers: Answers): string {
	const appType = deriveAppType(answers);
	const authMethod = str(answers, 'userAuth');
	const features = arr(answers, 'coreFeatures');
	const contentTypes = arr(answers, 'contentType');
	const roles = arr(answers, 'userRoles');
	const integrations = arr(answers, 'integrations');
	const monetization = str(answers, 'monetization');
	const hasMobile = appType === 'mobile' || appType === 'both';
	const hasWeb = appType !== 'mobile';

	const lines: string[] = ['## Deliverables Checklist', ''];

	lines.push('### Setup & Infrastructure');
	if (hasWeb) lines.push('- [ ] SvelteKit project initialized with Svelte 5, TailwindCSS 4, TypeScript strict mode');
	if (hasMobile) lines.push('- [ ] Expo / React Native project initialized with TypeScript');
	lines.push('- [ ] Supabase project created with database, auth, and storage configured');
	lines.push('- [ ] Environment variables configured (`.env.local` + `.env.example`)');
	lines.push('- [ ] Git repository with `.gitignore`, branch protection, and CI/CD pipeline');
	lines.push('- [ ] Deployment pipeline to production (Vercel / Expo EAS)');
	lines.push('');

	if (authMethod !== 'none') {
		lines.push('### Authentication');
		lines.push('- [ ] Sign up flow');
		lines.push('- [ ] Sign in flow');
		lines.push('- [ ] Sign out');
		lines.push('- [ ] Password reset (if applicable)');
		lines.push('- [ ] Protected routes (redirect unauthenticated users)');
		if (roles.length > 0) lines.push('- [ ] Role-based access control middleware');
		lines.push('');
	}

	if (features.length > 0) {
		lines.push('### Core Features');
		if (features.includes('profiles')) lines.push('- [ ] User profile page (view + edit)');
		if (features.includes('profiles')) lines.push('- [ ] Avatar upload');
		if (features.includes('search')) lines.push('- [ ] Search bar with full-text search');
		if (features.includes('search')) lines.push('- [ ] Filter/sort UI');
		if (features.includes('chat')) lines.push('- [ ] Real-time chat (1:1 and group)');
		if (features.includes('chat')) lines.push('- [ ] Message history with pagination');
		if (features.includes('notifications')) lines.push('- [ ] Notification system (in-app)');
		if (features.includes('notifications')) lines.push('- [ ] Notification bell with unread count');
		if (features.includes('file-upload')) lines.push('- [ ] File upload component with drag-and-drop');
		if (features.includes('file-upload')) lines.push('- [ ] File management (list, download, delete)');
		if (features.includes('comments')) lines.push('- [ ] Comments/reviews system');
		if (features.includes('dashboard')) lines.push('- [ ] Analytics dashboard with charts');
		if (features.includes('social-sharing')) lines.push('- [ ] Social share buttons + OG meta tags');
		if (features.includes('calendar')) lines.push('- [ ] Calendar view with event CRUD');
		if (features.includes('maps')) lines.push('- [ ] Interactive map with markers');
		lines.push('');
	}

	if (contentTypes.length > 0) {
		lines.push('### Content');
		if (contentTypes.includes('text-posts')) lines.push('- [ ] Rich text editor for posts/articles');
		if (contentTypes.includes('text-posts')) lines.push('- [ ] Post listing page with pagination');
		if (contentTypes.includes('images')) lines.push('- [ ] Image gallery with lightbox');
		if (contentTypes.includes('videos')) lines.push('- [ ] Video player component');
		if (contentTypes.includes('documents')) lines.push('- [ ] Document upload and viewer');
		if (contentTypes.includes('products')) lines.push('- [ ] Product listing and detail pages');
		if (contentTypes.includes('products')) lines.push('- [ ] Shopping cart (if e-commerce)');
		if (contentTypes.includes('ugc')) lines.push('- [ ] UGC submission form + moderation queue');
		if (contentTypes.includes('courses')) lines.push('- [ ] Course builder + lesson viewer');
		if (contentTypes.includes('courses')) lines.push('- [ ] Progress tracking');
		if (contentTypes.includes('events')) lines.push('- [ ] Event listing and RSVP system');
		lines.push('');
	}

	if (roles.includes('admin')) {
		lines.push('### Admin Dashboard');
		lines.push('- [ ] Admin layout with sidebar navigation');
		lines.push('- [ ] User management table');
		lines.push('- [ ] Content moderation queue');
		lines.push('- [ ] Analytics overview page');
		lines.push('- [ ] System settings page');
		lines.push('');
	}

	if (integrations.length > 0) {
		lines.push('### Integrations');
		if (integrations.includes('payments')) lines.push('- [ ] Stripe checkout integration');
		if (integrations.includes('payments')) lines.push('- [ ] Stripe webhook handler');
		if (integrations.includes('email')) lines.push('- [ ] Transactional email templates');
		if (integrations.includes('email')) lines.push('- [ ] Email sending service integration');
		if (integrations.includes('storage')) lines.push('- [ ] Cloud storage bucket configuration');
		if (integrations.includes('analytics')) lines.push('- [ ] Analytics tracking setup');
		if (integrations.includes('maps')) lines.push('- [ ] Map integration with geocoding');
		if (integrations.includes('social-apis')) lines.push('- [ ] Social media API connections');
		if (integrations.includes('ai-ml')) lines.push('- [ ] AI/ML feature integration');
		if (integrations.includes('crm')) lines.push('- [ ] CRM sync setup');
		lines.push('');
	}

	if (monetization !== 'free' && monetization !== 'not-sure') {
		lines.push('### Monetization');
		if (monetization === 'subscriptions') lines.push('- [ ] Subscription plans and pricing page');
		if (monetization === 'subscriptions') lines.push('- [ ] Stripe billing portal integration');
		if (monetization === 'freemium') lines.push('- [ ] Free vs premium feature gating');
		if (monetization === 'freemium') lines.push('- [ ] Upgrade prompt and checkout flow');
		if (monetization === 'one-time') lines.push('- [ ] One-time purchase checkout');
		if (monetization === 'marketplace') lines.push('- [ ] Marketplace fee calculation and Stripe Connect');
		if (monetization === 'advertising') lines.push('- [ ] Ad placement components and ad provider integration');
		lines.push('');
	}

	lines.push('### Quality & Launch');
	lines.push('- [ ] Responsive design (mobile, tablet, desktop)');
	lines.push('- [ ] Accessibility audit (WCAG 2.1 AA)');
	lines.push('- [ ] SEO meta tags and sitemap');
	lines.push('- [ ] Error handling and user-friendly error pages (404, 500)');
	lines.push('- [ ] Loading states and skeleton screens');
	lines.push('- [ ] Tests (unit + integration + e2e for critical paths)');
	lines.push('- [ ] Performance audit (Lighthouse score > 90)');
	lines.push('- [ ] Security review (RLS policies, input validation, auth flows)');
	lines.push('- [ ] README with setup instructions');
	lines.push('');

	return lines.join('\n');
}

export function generateBlueprint(answers: Answers): string {
	const projectName = str(answers, 'projectName') || 'Untitled Project';
	const appDescription = str(answers, 'appDescription') || '';
	const targetAudience = str(answers, 'targetAudience') || '';
	const appType = deriveAppType(answers) || 'web';
	const timeline = str(answers, 'timeline') || 'standard';
	const complexity = num(answers, 'complexity') || 3;
	const scalability = num(answers, 'scalability') || 2;
	const designStyle = str(answers, 'designStyle') || 'modern-minimal';
	const monetization = str(answers, 'monetization') || 'free';
	const mobilePlatform = str(answers, 'mobilePlatform') || '';
	const mobileFeatures = arr(answers, 'mobileFeatures');
	const additionalNotes = str(answers, 'additionalNotes') || '';
	const hasMobile = appType === 'mobile' || appType === 'both';

	const tech = techStackForAppType(appType);

	const timelineLabels: Record<string, string> = {
		asap: '1-2 weeks (rush)',
		short: '1-2 months',
		standard: '3-6 months',
		flexible: 'Flexible (no rush)'
	};

	const complexityLabels: Record<number, string> = {
		1: 'Simple (MVP)',
		2: 'Basic',
		3: 'Moderate',
		4: 'Complex',
		5: 'Enterprise'
	};

	const scalabilityLabels: Record<number, string> = {
		1: '< 100 users',
		2: '100 - 1,000 users',
		3: '1,000 - 10,000 users',
		4: '10,000 - 100,000 users',
		5: '100,000+ users'
	};

	const designLabels: Record<string, string> = {
		'modern-minimal': 'Modern & Minimal — clean lines, generous whitespace, neutral palette with accent colors',
		'bold-colorful': 'Bold & Colorful — vibrant gradients, strong typography, eye-catching UI elements',
		professional: 'Professional & Corporate — polished, trustworthy, blue/gray tones, structured layouts',
		playful: 'Playful & Fun — rounded shapes, friendly colors, casual typography, micro-animations',
		'dark-sleek': 'Dark & Sleek — dark backgrounds, subtle glows, elegant contrast, premium feel',
		'warm-organic': 'Warm & Organic — earthy tones, soft textures, natural imagery, handcrafted feel'
	};

	const appTypeLabels: Record<string, string> = {
		web: 'Web Application',
		mobile: 'Mobile Application',
		both: 'Web + Mobile Application',
		ecommerce: 'E-commerce Store',
		blog: 'Blog / Content Site',
		saas: 'SaaS Platform',
		portfolio: 'Portfolio / Landing Page',
		other: 'Custom Application'
	};

	const date = new Date().toISOString().split('T')[0];

	const sections: string[] = [];

	// Header
	sections.push(`# ${projectName} — Technical Blueprint`);
	sections.push(`> Generated by Words Not Code | ${date}`);
	sections.push('> Paste this entire document into your AI coding assistant to start building.');
	sections.push('');
	sections.push('---');
	sections.push('');

	// 1. Project Overview
	sections.push('## Project Overview');
	sections.push('');
	sections.push(`**Project Name:** ${projectName}`);
	sections.push(`**Type:** ${appTypeLabels[appType] || appType}`);
	sections.push(`**Description:** ${appDescription}`);
	sections.push(`**Target Audience:** ${targetAudience}`);
	sections.push(`**Timeline:** ${timelineLabels[timeline] || timeline}`);
	sections.push(`**Complexity:** ${complexityLabels[complexity] || complexity}`);
	sections.push(`**Expected Scale:** ${scalabilityLabels[scalability] || scalability}`);
	sections.push(`**Design Style:** ${designLabels[designStyle] || designStyle}`);
	sections.push(`**Monetization:** ${monetization === 'free' ? 'Free (no monetization)' : monetization === 'not-sure' ? 'Not decided yet' : monetization}`);
	if (additionalNotes) {
		sections.push(`**Additional Notes:** ${additionalNotes}`);
	}
	sections.push('');

	// 2. Architecture & Tech Stack
	sections.push('## Architecture & Tech Stack');
	sections.push('');
	if (tech.frontend) sections.push(`**Frontend:** ${tech.frontend}`);
	if (tech.backend) sections.push(`**Backend:** ${tech.backend}`);
	if (tech.mobile) sections.push(`**Mobile:** ${tech.mobile}`);
	sections.push(`**Hosting:** ${tech.hosting}`);
	sections.push('**Database:** Supabase (PostgreSQL 15+ with pgvector, PostGIS as needed)');
	sections.push('**Auth:** Supabase Auth');
	sections.push('**Storage:** Supabase Storage (S3-compatible)');
	sections.push('**Package Manager:** pnpm (recommended) or npm');
	sections.push('');

	if (hasMobile) {
		sections.push('### Mobile Platform Details');
		const platLabels: Record<string, string> = {
			ios: 'iOS only (iPhone & iPad)',
			android: 'Android only',
			'both-mobile': 'iOS and Android',
			'cross-platform': 'Cross-platform via React Native / Expo'
		};
		sections.push(`**Target Platforms:** ${platLabels[mobilePlatform] || mobilePlatform}`);
		sections.push('');

		if (mobileFeatures.length > 0) {
			sections.push('**Mobile-Specific Features:**');
			const mobileFeatureLabels: Record<string, string> = {
				'push-notifications': 'Push Notifications — Use Expo Notifications + Supabase Edge Function triggers',
				camera: 'Camera/Photos — Use `expo-camera` and `expo-image-picker`',
				gps: 'GPS/Location — Use `expo-location` for foreground and background location',
				offline: 'Offline Mode — Use `@react-native-async-storage/async-storage` + sync queue pattern',
				biometric: 'Biometric Auth — Use `expo-local-authentication` for Face ID / fingerprint',
				'in-app-purchases': 'In-App Purchases — Use `react-native-iap` for App Store / Play Store purchases',
				'qr-scanner': 'QR Code Scanner — Use `expo-barcode-scanner`',
				contacts: 'Contacts Access — Use `expo-contacts` with user permission'
			};
			for (const mf of mobileFeatures) {
				sections.push(`- ${mobileFeatureLabels[mf] || mf}`);
			}
			sections.push('');
		}
	}

	if (scalability >= 4) {
		sections.push('### Scalability Architecture');
		sections.push('Given the expected user volume, plan for:');
		sections.push('- **CDN:** Serve static assets via Vercel Edge Network or Cloudflare CDN');
		sections.push('- **Connection Pooling:** Use Supabase\'s built-in PgBouncer (connection pooler) for high-concurrency DB access');
		sections.push('- **Caching:** Implement Redis caching layer (Upstash) for frequently accessed data');
		sections.push('- **Background Jobs:** Use Supabase Edge Functions or a job queue for async tasks');
		if (scalability >= 5) {
			sections.push('- **Database Replicas:** Read replicas for heavy read workloads');
			sections.push('- **Horizontal Scaling:** Stateless server design to allow multiple instances');
			sections.push('- **Monitoring:** Set up Sentry for error tracking, Grafana + Prometheus for metrics');
		}
		sections.push('');
	}

	// 3. Auth
	sections.push(authSection(answers));

	// 4. Database
	sections.push(databaseSection(answers));

	// 5. Core Features
	sections.push(coreFeaturesSection(answers));

	// 6. Content Management
	sections.push(contentSection(answers));

	// 7. Admin (conditional)
	const admin = adminSection(answers);
	if (admin) sections.push(admin);

	// 8. Integrations
	sections.push(integrationsSection(answers));

	// 9. SEO
	sections.push(seoSection(answers));

	// 10. Testing
	sections.push(testingSection(answers));

	// 11. Documentation
	sections.push(documentationSection(answers));

	// 12. Security
	sections.push(securitySection(answers));

	// 13. Code Conventions
	sections.push(codeConventionsSection(answers));

	// 14. Deliverables Checklist
	sections.push(deliverablesSection(answers));

	// Footer
	sections.push('---');
	sections.push(`*This blueprint was generated by Words Not Code on ${date}. Use it as a comprehensive guide for your AI coding assistant. Adjust details as your project evolves.*`);
	sections.push('');

	return sections.join('\n');
}
