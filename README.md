# EV Charger Leads - Programmatic SEO Setup Guide

This is a Next.js 14 application for generating 20,000+ programmatic SEO pages for EV charger installation lead generation.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud like Supabase/Neon)
- OpenAI API key (for content generation)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ev_charger_leads"

# OpenAI API
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=""
```

### 3. Download US Cities Data

Download the free SimpleMaps US Cities database:
1. Go to: https://simplemaps.com/data/us-cities
2. Download the free "Basic" CSV version
3. Save it as: `scripts/data/cache/uscities.csv`

### 4. Run Data Collection Scripts

```bash
# Collect all data (cities, electricity rates, incentives)
npm run collect:all

# Or run individually:
npm run collect:cities
npm run collect:rates
npm run collect:incentives
```

### 5. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with collected data
npm run seed
```

### 6. Generate AI Content

```bash
# Generate unique content for all cities (this will take time and cost ~$200 in API fees)
npm run generate:content
```

**Note**: This will generate content for ALL cities. For testing, you can modify `scripts/generate-content.ts` to limit the number of cities.

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## 📊 Project Structure

```
ev-charger-leads/
├── app/
│   ├── [slug]/          # Dynamic city pages
│   │   └── page.tsx
│   ├── api/
│   │   └── leads/       # Lead submission API
│   ├── layout.tsx
│   └── page.tsx         # Homepage
├── components/
│   ├── LeadCaptureForm.tsx
│   ├── CostBreakdownTable.tsx
│   ├── FAQSection.tsx
│   └── IncentivesList.tsx
├── lib/
│   ├── prisma.ts        # Prisma client
│   └── ai-content-generator.ts
├── prisma/
│   └── schema.prisma    # Database schema
└── scripts/
    ├── collect-cities.ts
    ├── collect-electricity-rates.ts
    ├── collect-incentives.ts
    ├── seed-database.ts
    └── generate-content.ts
```

## 🎯 Key Features

### Programmatic SEO
- 20,000+ unique city pages
- AI-generated content (no duplicates)
- Local data augmentation (electricity rates, costs, incentives)
- Schema.org markup for rich snippets

### Lead Generation
- Lead capture forms on every page
- Database storage for lead management
- Ready for integration with lead buyers (Networx, HomeAdvisor)

### SEO Optimization
- Dynamic meta tags per city
- LocalBusiness schema markup
- FAQPage schema markup
- Optimized for "EV charger installation [city]" keywords

## 💰 Monetization Setup

### 1. Lead Generation Networks

Apply to these networks to sell your leads:

- **Networx**: https://www.networx.com/pro
- **HomeAdvisor Pro**: https://pro.homeadvisor.com
- **Angi Leads**: https://www.angi.com/business-center
- **Thumbtack**: https://www.thumbtack.com/pro

### 2. Affiliate Programs

Add affiliate links to your pages:

- **Amazon Associates**: EV chargers (3-4% commission)
- **Wallbox Affiliate**: https://wallbox.com/affiliate
- **ChargePoint**: Contact for partnership

### 3. Display Ads

Once you hit traffic thresholds:

- **Ezoic**: No minimum (good for starting)
- **Mediavine**: 50k sessions/month
- **Raptive**: 100k pageviews/month

## 🔧 Customization

### Modify Content Templates

Edit `lib/ai-content-generator.ts` to change:
- AI prompts for intros and FAQs
- Content structure
- Tone and style

### Add More Data

Edit `scripts/collect-incentives.ts` to add:
- More state incentives
- Utility company programs
- Local rebates

### Change Design

All components use Tailwind CSS. Customize in:
- `components/*.tsx` files
- `app/globals.css` for global styles

## 📈 Scaling to 20,000+ Pages

### Build Strategy

Next.js will generate pages on-demand (ISR). For full static generation:

```bash
# This will take hours and generate all pages
npm run build
```

### Deployment Options

1. **Vercel** (Recommended)
   - Automatic ISR
   - Edge functions
   - Free tier available

2. **Netlify**
   - On-demand builders
   - Good for large sites

3. **Self-hosted**
   - Use PM2 or Docker
   - Requires more setup

### SEO Submission

After deployment:

1. Create XML sitemaps (split by state)
2. Submit to Google Search Console
3. Submit to Bing Webmaster Tools
4. Monitor indexing progress

## 🧪 Testing

### Test a Single City

```bash
# Start dev server
npm run dev

# Visit a city page
# Example: http://localhost:3000/austin-tx
```

### Test Lead Submission

1. Fill out the lead form on any city page
2. Check your database for the new lead:

```bash
npm run db:studio
```

## 📝 Next Steps

1. **Set up PostgreSQL database** (local or cloud)
2. **Download SimpleMaps CSV** and place in `scripts/data/cache/`
3. **Add OpenAI API key** to `.env.local`
4. **Run data collection** scripts
5. **Seed database** with cities and incentives
6. **Generate AI content** (start with 100 cities for testing)
7. **Deploy to Vercel** or your preferred platform
8. **Apply to lead gen networks** and start monetizing

## 💡 Tips for Success

- **Start small**: Generate content for top 1,000 cities first
- **Monitor costs**: OpenAI API costs ~$0.01 per city
- **Test lead flow**: Make sure forms work before scaling
- **Track conversions**: Set up analytics to measure ROI
- **Optimize for mobile**: Most traffic will be mobile

## 🆘 Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Run `npm run db:push` to sync schema

### Prisma Client Errors
- Run `npm run db:generate` to regenerate client
- Restart your dev server

### Content Generation Fails
- Check OpenAI API key is valid
- Verify you have API credits
- Check rate limits (60 requests/minute)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [SimpleMaps Data](https://simplemaps.com/data/us-cities)
- [EIA API](https://www.eia.gov/opendata/)

---

**Need help?** Check the implementation plan in `brain/implementation_plan.md` for detailed architecture and strategy.
