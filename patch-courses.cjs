const fs = require('fs');
const path = require('path');

const coursesPath = path.join(__dirname, 'src', 'content', 'courses.ts');
let src = fs.readFileSync(coursesPath, 'utf8');

// Find the digital marketing course boundaries
const startMarker = '// ===== Course 4: Digital Marketing (existing, kept as-is) =====';
const endMarker = '// ===== Course 5: Customer Experience (existing, kept as-is) =====';

const startIdx = src.indexOf(startMarker);
const endIdx = src.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers!');
  process.exit(1);
}

const replacement = `// ===== Course 4: Digital Marketing (expanded with MCQs) =====
  {
    id: "digital-marketing",
    title: "Digital Marketing for Dealers",
    subtitle: "Modern marketing strategies that drive traffic",
    description:
      "Learn how to use digital marketing to attract more customers to your dealership. Each 5-minute module includes detailed strategies and 5 multiple-choice quiz questions. Covers social media, email campaigns, direct mail, and marketing analytics.",
    levels: "Intermediate",
    duration: "2.5 hours",
    lessons: 4,
    image: "marketing",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    lessonsList: [
      {
        id: "social-media",
        title: "Social Media for Car Dealers",
        description: "Use social platforms to attract and engage customers.",
        duration: "10 min",
        content: ${JSON.stringify(`## Social Media for Car Dealers

Social media has become one of the most powerful tools in a dealership's marketing arsenal. Unlike traditional advertising, social platforms allow you to build relationships, showcase inventory visually, and engage with customers in real time.

### Why Social Media Matters for Dealerships

The average car buyer spends 14+ hours researching online before visiting a dealership. A strong social media presence puts your inventory and your brand in front of them during that critical research phase. Social media also builds trust — customers who follow you see your community involvement, your happy customers, and your team's personality before they ever walk through the door.

### Key Platforms and How to Use Them

**Facebook and Instagram** are ideal for visual inventory showcases. Post high-quality photos and short video walkarounds of new arrivals. Use Instagram Stories for behind-the-scenes content like vehicle deliveries, shop tours, and team spotlights. Facebook Marketplace is now one of the largest used-car shopping platforms — every unit should be listed there.

**YouTube** is the second-largest search engine in the world. Create a channel for your dealership and post regular video walkarounds, customer testimonials, and "how-to" content like maintenance tips. Videos build far more trust than photos alone because customers can see and hear the vehicle.

**TikTok** has exploded as a car-shopping platform, especially for younger buyers. Short, energetic videos showing vehicle features, humor, or "day in the life" content can reach thousands of potential buyers organically. The key is authenticity — polished corporate videos don't perform as well as real, unscripted content.

**LinkedIn** is valuable for B2B connections — fleet sales, commercial vehicle buyers, and recruiting top sales talent.

### Content Strategy That Works

Posting random inventory photos isn't enough. A winning social strategy includes:
- **Inventory Spotlights:** 2-3 vehicle features per week with pricing and a call to action
- **Customer Stories:** Video testimonials and delivery day photos (with permission)
- **Behind the Scenes:** Team introductions, community events, charity work
- **Educational Content:** Maintenance tips, buying guides, financing explainers
- **Engagement Posts:** Polls, questions, and contests that encourage comments

### Best Practices
1. Post consistently — at least once per day on your primary platform
2. Respond to all comments and messages within 1 hour during business hours
3. Use local hashtags like #[YourCity]Cars or #[Brand]Dealer
4. Boost your best-performing posts with small ad budgets (even $5/day works)
5. Track which content types drive the most profile visits and website clicks

### Multiple Choice Quiz

**Q1:** What is the primary advantage of social media over traditional advertising for dealerships?
A) It's always free
B) It builds relationships and trust through ongoing engagement
C) It automatically sells more cars
D) It eliminates the need for a sales team

**Q2:** Which platform is best suited for short, authentic behind-the-scenes content aimed at younger buyers?
A) LinkedIn
B) Email
C) TikTok
D) Direct mail

**Q3:** How often should a dealership post on their primary social platform at minimum?
A) Once per week
B) Once per month
C) Once per day
D) Only when there's a sale event

**Q4:** True or False: Every used vehicle in inventory should also be listed on Facebook Marketplace.
A) True — it's one of the largest used-car shopping platforms
B) False — Marketplace is only for private sellers

**Q5:** What is the recommended response time for social media comments and messages during business hours?
A) Within 24 hours
B) Within 1 hour
C) By end of week
D) No need to respond

**Answers:**
1. B — Social media builds ongoing relationships and trust, not just one-time ad impressions.
2. C — TikTok's short-form, authentic format resonates with younger audiences.
3. C — Daily posting keeps your dealership top of mind in a competitive market.
4. A — Facebook Marketplace is a massive platform and every unit should be listed.
5. B — Responding within 1 hour shows customers you're attentive and professional.`)},
      {
        id: "email-marketing",
        title: "Email Marketing Campaigns",
        description: "Build and nurture leads through targeted email.",
        duration: "10 min",
        content: ${JSON.stringify(`## Email Marketing Campaigns

Email marketing consistently delivers the highest ROI of any marketing channel — returning an average of $36 for every $1 spent. For automotive dealerships, email is the backbone of lead nurturing, service retention, and repeat sales.

### Why Email Works for Dealerships

Unlike social media algorithms that limit your organic reach, email lands directly in your customer's inbox. You own your email list — no platform can take it away. Email also allows for precise segmentation: you can send different messages to service customers, recent buyers, lease-end prospects, and unconverted leads.

### Campaign Types That Drive Results

**New Inventory Alerts** keep your database informed about fresh arrivals. Segment by brand preference, price range, or vehicle type so customers only receive relevant inventory. Include high-quality photos, pricing, and a clear "Schedule a Test Drive" button.

**Service Specials and Maintenance Reminders** are the highest-performing email type for most dealerships. Service customers are already yours — reminding them about oil changes, tire rotations, and seasonal specials keeps them coming back and builds lifetime value. Set up automated triggers based on purchase date or mileage intervals.

**Seasonal Promotions** create urgency. Holiday sales events, end-of-year clearance, and model year changeovers all perform well when promoted via email. Use countdown timers and limited-time offers to drive action.

**Follow-Up Sequences** are automated email series that nurture leads over time. A typical sequence might include: Day 1 — Thank you for visiting, Day 3 — Featured inventory match, Day 7 — Customer testimonial, Day 14 — Special offer, Day 30 — Check-in and invite back.

**Lease-End Campaigns** target customers whose leases are expiring within 3-6 months. These have extremely high conversion rates because the customer has a known, upcoming need.

### Email Best Practices
1. Write compelling subject lines — aim for 40-50 characters
2. Personalize with the customer's name and relevant vehicle interests
3. Include one clear call-to-action per email
4. Optimize for mobile — over 60% of emails are opened on phones
5. Clean your list regularly — remove bounced addresses and inactive subscribers
6. Track opens, clicks, and conversions to measure what's working

### Multiple Choice Quiz

**Q1:** What is the average ROI of email marketing?
A) $10 for every $1 spent
B) $20 for every $1 spent
C) $36 for every $1 spent
D) $50 for every $1 spent

**Q2:** Which email campaign type typically has the highest conversion rate?
A) New inventory alerts
B) Seasonal promotions
C) Lease-end campaigns targeting customers 3-6 months before expiry
D) Holiday greeting cards

**Q3:** What is the recommended length for an email subject line?
A) 10-20 characters
B) 40-50 characters
C) 80-100 characters
D) No more than 200 characters

**Q4:** Approximately what percentage of marketing emails are opened on mobile devices?
A) 20%
B) 40%
C) Over 60%
D) Under 10%

**Q5:** What is the most important element to include in every marketing email?
A) Multiple competing offers
B) A single clear call-to-action
C) A long list of features
D) The dealership's full history

**Answers:**
1. C — Email marketing returns an average of $36 for every $1 spent.
2. C — Lease-end campaigns convert exceptionally well because the customer has a known, time-sensitive need.
3. B — 40-50 character subject lines perform best for open rates.
4. C — Over 60% of marketing emails are opened on mobile devices.
5. B — A single clear call-to-action focuses the reader and drives the desired response.`)},
      {
        id: "direct-mail",
        title: "Direct Mail That Works",
        description: "Create effective direct mail campaigns that drive showroom traffic.",
        duration: "10 min",
        content: ${JSON.stringify(`## Direct Mail That Works

Despite the digital revolution, direct mail remains one of the most effective marketing channels for automotive dealerships. Response rates for direct mail average 4.4% for prospect lists and 9% for house lists — significantly higher than email's average 1% click-through rate.

### Why Direct Mail Still Wins

Direct mail cuts through the digital noise. The average person receives 120+ emails per day but only 2-3 pieces of physical mail. A well-designed mail piece commands attention in a way that digital ads rarely do. Physical mail also has staying power — it sits on the kitchen counter or refrigerator, providing repeated exposure.

### Types of Direct Mail for Dealerships

**Targeted Offers** based on equity position are the highest-converting format. Use data services that identify customers with positive equity in their current vehicle — these owners are in a strong position to trade up. Send them a personalized offer showing their estimated trade value and a specific new vehicle recommendation.

**Service-to-Sales Mailers** target your existing service customers. If a customer's repair bill exceeds their vehicle's value, they're a prime upgrade candidate. Service loyalty mailers offering discounted maintenance also drive repeat visits.

**New Resident Mailers** welcome people who just moved to your area. These new residents likely need a vehicle or will soon, and they haven't yet established loyalty to a competing dealership. Include a welcome offer and an introduction to your brand.

**Conquest Mailers** target owners of competing brands with lease or finance terms nearing expiry. Use data to identify these prospects and send compelling trade-up offers.

### Design Principles That Drive Response
1. **Personalization is critical.** Use the recipient's name and vehicle-specific details. Variable data printing makes this affordable even for smaller campaigns.
2. **One clear offer per piece.** Don't confuse the recipient with multiple deals. Focus on the single most compelling offer.
3. **Include urgency.** Give a specific expiration date, not "limited time only."
4. **Make response easy.** Include a QR code, a dedicated phone number, and a simple URL. Track which channel each response came from.
5. **Professional design matters.** A poorly designed mailer reflects poorly on your dealership. Invest in professional templates.

### Tracking and Optimization

Every mail campaign must be measurable. Use unique phone numbers, QR codes, and landing page URLs for each campaign. Track:
- Delivery rate
- Response rate (calls, scans, visits)
- Appointment rate
- Close rate
- Cost per sale

Test different offers, designs, and audiences. A/B test small batches before rolling out to your full list. The data you collect will make each subsequent campaign more effective.

### Multiple Choice Quiz

**Q1:** What is the average response rate for direct mail sent to an existing customer list?
A) 1%
B) 4.4%
C) 9%
D) 15%

**Q2:** Which type of direct mail campaign typically converts at the highest rate?
A) Holiday greeting cards
B) General brand awareness mailers
C) Targeted offers based on customer equity position
D) Inventory listing catalogs

**Q3:** Why is a QR code important on a direct mail piece?
A) It's required by postal regulations
B) It makes it easy for the recipient to respond immediately from their phone
C) It increases postage costs
D) It replaces the need for a phone number

**Q4:** What should you do before rolling out a direct mail campaign to your full list?
A) Nothing — just send it
B) A/B test small batches first to optimize offers and design
C) Only send to people who have already purchased
D) Wait for another dealership to try it first

**Q5:** How does direct mail compare to email in terms of daily competition for attention?
A) People get more direct mail than email
B) People get roughly equal amounts
C) People get 120+ emails per day but only 2-3 pieces of physical mail
D) Email is always more effective

**Answers:**
1. C — Existing customer lists average a 9% response rate for direct mail.
2. C — Equity-based targeted offers are the highest-converting direct mail format.
3. B — QR codes let recipients respond immediately from their phone with one scan.
4. B — A/B testing small batches optimizes your campaign before full rollout.
5. C — Physical mail stands out because people receive far fewer pieces than digital messages.`)},
      {
        id: "marketing-roi",
        title: "Measuring Marketing ROI",
        description: "Track, analyze, and optimize your marketing spend for maximum return.",
        duration: "10 min",
        content: ${JSON.stringify(`## Measuring Marketing ROI

The most successful dealerships don't just spend money on marketing — they measure exactly what comes back. Without proper tracking, you're gambling with your marketing budget. This module shows you what to measure, how to measure it, and how to use the data to make smarter decisions.

### Why Measurement Matters

The old adage "I know half my marketing is working — I just don't know which half" is unacceptable in today's data-rich environment. With proper tracking, you can:
- Identify which channels and campaigns actually produce sales
- Cut underperforming spend and double down on winners
- Calculate your true customer acquisition cost
- Justify marketing budget to ownership with real numbers
- Forecast future results based on historical data

### The Key Metrics Every Dealer Must Track

**Cost Per Lead (CPL):** Total marketing spend divided by the number of leads generated. This tells you how efficiently each channel is producing potential customers. A lead is someone who has raised their hand — filled out a form, called, walked in, or engaged meaningfully. Track CPL by source: Facebook ads, Google Ads, organic search, referrals, direct mail, etc.

**Cost Per Sale (CPS):** Total marketing spend divided by the number of vehicles sold. This is the metric that ultimately matters. A source might have a high CPL but a low CPS if those leads close at a high rate. Conversely, cheap leads that never convert are actually expensive.

**Return on Ad Spend (ROAS):** Gross profit from sales attributed to a channel divided by the cost of that channel's marketing. For example, if you spent $5,000 on Facebook ads and sold 4 cars with $8,000 total gross profit, your ROAS is 1.6x. A ROAS above 1.0 means you're profitable on that channel — but you should aim for 3-5x to account for fixed costs.

**Customer Acquisition Cost (CAC):** Total sales and marketing expenses divided by the number of new customers acquired. This is a holistic metric that accounts for everything — ads, salaries, CRM costs, events, etc. Knowing your CAC tells you the minimum gross profit you need per sale to be sustainable.

**Lead-to-Sale Conversion Rate:** The percentage of leads that result in a sale. Industry average is 8-12% for automotive. If you're below that, focus on sales process improvement. If you're above, your marketing is finding the right people.

### Setting Up Your Tracking System
1. **Use unique phone numbers** for each marketing channel. Call tracking services provide numbers that forward to your main line while recording the source.
2. **Create dedicated landing pages** for each campaign with unique URLs. Track visits and form submissions separately.
3. **Implement UTM parameters** on all digital ad links. These tags tell Google Analytics exactly which campaign, source, and medium drove each visitor.
4. **Train your team** to ask every customer "How did you hear about us?" and record the answer in your CRM consistently.
5. **Connect your CRM to your marketing platforms.** Most modern CRMs can attribute a sale back to the original lead source automatically.

### Using the Data

Review your metrics weekly as a management team. Look for trends, not one-week blips. When you find a channel with strong ROAS, scale it up incrementally — increase budget by 20-30% and watch if efficiency holds. When a channel consistently underperforms for 4+ weeks, cut it or redesign the campaign.

### Multiple Choice Quiz

**Q1:** What does CPL stand for?
A) Cars Per Lot
B) Cost Per Lead
C) Customer Purchase Level
D) Campaign Performance Log

**Q2:** If you spend $3,000 on a campaign and sell 3 cars with $6,000 total gross profit, what is your ROAS?
A) 0.5x
B) 1.0x
C) 2.0x
D) 3.0x

**Q3:** What is the automotive industry average for lead-to-sale conversion rate?
A) 2-4%
B) 8-12%
C) 20-25%
D) 30-40%

**Q4:** What is the most important question your team should ask every customer?
A) "What's your budget?"
B) "How did you hear about us?"
C) "Do you want the extended warranty?"
D) "What color do you prefer?"

**Q5:** When should you review marketing metrics?
A) Once per year
B) Every 6 months
C) Weekly as a management team
D) Only when sales are down

**Answers:**
1. B — CPL stands for Cost Per Lead, measuring how efficiently you generate potential customers.
2. C — $6,000 gross profit / $3,000 spend = 2.0x ROAS.
3. B — The automotive industry averages 8-12% lead-to-sale conversion.
4. B — "How did you hear about us?" is essential for attributing sales to marketing channels.
5. C — Weekly reviews catch trends early and enable quick optimization.`)},
      },
    ],
  },`;

const newSrc = src.slice(0, startIdx) + replacement + '\n' + src.slice(endIdx);
fs.writeFileSync(coursesPath, newSrc, 'utf8');
console.log('Patch applied successfully!');
console.log('Old length:', src.length);
console.log('New length:', newSrc.length);
