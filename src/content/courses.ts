export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  levels: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  image: string;
  icon: string;
  lessonsList: Lesson[];
  requiredTier?: "basic" | "plus" | "premium";
}

export const courses: Course[] = [
  // ===== Course 1: 10 Steps to the Sale (Part 1 - Descriptions) =====
  {
    id: "10-steps-part-1",
    title: "10 Steps to the Sale",
    subtitle: "Master every step of the automotive sales process",
    description:
      "An in-depth exploration of the complete 10-step automotive sales process. Each lesson includes detailed explanations, key principles, common mistakes, and pro tips. Perfect for new and experienced salespeople alike. Read through each step and mark it complete as you go.",
    levels: "Beginner",
    duration: "3 hours",
    lessons: 10,
    image: "foundations",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    lessonsList: [
      {
        id: "step-1-greeting",
        title: "Step 1: Greeting & Building Rapport",
        description: "Master the art of the first impression and build trust from the moment the customer arrives.",
        duration: "15 min",
        content: `## Step 1: Greeting & Building Rapport

**Goal:** Make a warm, professional first impression and build trust within the first 10 seconds.

### The 10-Second Rule

Customers form their first impression within 10 seconds. A rushed, transactional greeting triggers defensive walls that are difficult to break down. The goal is not to sell — it's to connect. Customers buy from people they like and trust, and that trust begins with how you make them feel in the first moment of contact.

### Why It Matters

Research shows that customers decide within 30 seconds whether they trust a salesperson. A poor first impression is nearly impossible to reverse. The greeting is your only chance to make a positive first impression, and it directly impacts every subsequent step of the process.

### How to Execute

Approach the customer warmly but not aggressively. Smile genuinely, make eye contact, and use their name as soon as you learn it. Start with an open-ended question like "What brings you in today?" rather than a closed question like "Can I help you?" Find common ground — notice something about their vehicle, their clothing, or their family. Make them feel welcomed, not hunted.

### Key Principles

- Be warm, not pushy — a genuine smile creates trust
- Use open-ended questions to start conversations
- Find common ground within the first 30 seconds
- Listen more than you talk — let them speak 80% of the time
- Make the customer feel welcomed, not hunted
- Use their name once you've learned it

### Common Mistakes

- Rushing to qualify the customer before building rapport — this signals that you care more about the sale than the person
- Using closed questions like "Can I help you?" which invites a "no" and ends the conversation before it starts

### Pro Tips

- Keep a bottle of water in your hand — it makes you appear approachable and gives you a natural prop
- If the customer is on their phone, wait 30 seconds before approaching. It shows respect for their time`,
      },
      {
        id: "step-2-needs-assessment",
        title: "Step 2: Needs Assessment",
        description: "Ask targeted questions to uncover the customer's needs, budget, and lifestyle requirements.",
        duration: "15 min",
        content: `## Step 2: Needs Assessment

**Goal:** Ask targeted questions to uncover the customer's needs, budget, and lifestyle.

### The NEED System

- **N**eeds — What problems are they solving?
- **E**xpectations — What does their ideal experience look like?
- **E**xperience — What's their buying history?
- **D**ecision — Who's involved?

### The BANT Framework

- **B**udget — What range are they comfortable with?
- **A**uthority — Are they the decision maker?
- **N**eed — What's the primary need?
- **T**imeline — When do they need it?

### Why It Matters

80% of sales are lost because the salesperson didn't understand the customer's needs. Without a thorough needs assessment, you're guessing. With one, you're solving problems. Customers can tell when you genuinely understand them, and that understanding builds trust and makes the rest of the sales process smoother.

### How to Execute

Use the NEED system and BANT framework. Ask open-ended questions and take detailed notes. Let them talk 80% of the time. After they answer, summarize what you heard: "So if I understand correctly, you're looking for a reliable SUV with good fuel economy under $40,000. Did I get that right?"

### Key Principles

- Listen more than you talk — let them speak 80% of the time
- Identify budget range and monthly payment targets
- Understand primary use — commute, family, work, pleasure
- Determine who else is involved in the decision
- Take detailed notes — it shows you value their words
- Summarize what you heard to confirm understanding

### Common Mistakes

- Jumping straight to vehicle features before understanding needs — this makes the customer feel unheard
- Asking only yes/no questions that don't reveal the real motivations behind the purchase

### Pro Tips

- Use a physical notebook for notes — it's more personal than a tablet and signals that you're paying attention
- Ask "What do you love about your current vehicle?" before asking what they want to change — it reveals their priorities`,
      },
      {
        id: "step-3-vehicle-presentation",
        title: "Step 3: Vehicle Presentation",
        description: "Present the vehicle features that match the customer's needs using the FAB method.",
        duration: "15 min",
        content: `## Step 3: Vehicle Presentation

**Goal:** Present the vehicle that fits their needs and highlight key features using the FAB method.

### The FAB Method

- **Feature** — What the vehicle has
- **Advantage** — What that feature does
- **Benefit** — How it helps the customer

### The 3-Feature Rule

Present only 3 key features that directly address their stated needs. Every feature you highlight should connect back to something they told you during the needs assessment.

### Walk-Around Sequence

1. **Front** — Grille, headlights, stance
2. **Side** — Lines, wheels, profile
3. **Interior** — Seats, technology, space
4. **Back** — Cargo, trunk, accessibility
5. **Under the hood** — Engine, performance

### Why It Matters

Customers who see 3+ vehicles experience decision fatigue and are less likely to buy. Presenting the right vehicle — not everything you have — positions you as a trusted advisor who has their best interests at heart.

### Key Principles

- Present only 2-3 vehicles max to avoid decision paralysis
- Use the Feature-Advantage-Benefit (FAB) method for every feature
- Connect every feature back to something they told you
- Let them touch, sit in, and explore the vehicle
- Limit information to 3 key features at a time
- Ask engagement questions throughout the presentation

### Common Mistakes

- Showing too many vehicles — this overwhelms the customer and leads to indecision
- Talking about features without connecting them to benefits — features alone don't sell, benefits do

### Pro Tips

- Pre-load the vehicle with their preferred radio station and temperature setting before the walk-around
- Use the "3-Feature Rule" — present only 3 features that directly address their stated needs, then stop`,
      },
      {
        id: "step-4-test-drive",
        title: "Step 4: Test Drive",
        description: "Guide the customer through an effective test drive experience.",
        duration: "15 min",
        content: `## Step 4: Test Drive

**Goal:** Let the customer experience the vehicle's performance and comfort firsthand.

### Before the Test Drive

- Pre-set the seat, mirrors, and radio
- Plan your route (highway, hills, smooth roads)
- Have the customer drive first when possible

### During the Test Drive

- **Stay quiet at first** — Let them experience the vehicle
- **Highlight benefits** — "Notice how smooth the ride is"
- **Reinforce their needs** — Connect features to what they want

### Why It Matters

Customers who take a test drive are 70% more likely to buy. The test drive isn't about the car's specifications — it's about how the car makes them feel. When customers start saying "I'd park it in the garage," they've already bought emotionally.

### Key Principles

- Pre-set seat, mirrors, and radio before the drive
- Plan a route that highlights different driving conditions
- Let the customer drive first — you drive back
- Stay quiet during the first few minutes of the drive
- Highlight benefits that connect to their stated needs
- Ask "How did that feel?" after the drive, not "What do you think?"

### Common Mistakes

- Talking too much during the test drive — this prevents the customer from forming their own emotional connection
- Taking a boring route that doesn't showcase the vehicle's strengths

### Pro Tips

- Point out a specific landmark or feature on the route that they'll remember — it creates a lasting positive association
- If they smile or laugh during the drive, note what caused it and reinforce it later during the numbers presentation`,
      },
      {
        id: "step-5-trade-in",
        title: "Step 5: Trade-In Appraisal",
        description: "Assess the value of the customer's current vehicle transparently and fairly.",
        duration: "15 min",
        content: `## Step 5: Trade-In Appraisal

**Goal:** Assess the value of the customer's current vehicle transparently.

### The Trade-In Process

1. **Ask early** — "Do you have a vehicle to trade in?"
2. **Inspect thoroughly** — Walk around, note condition, mileage
3. **Be transparent** — Explain how you determine value
4. **Present the offer** — Give a fair number and explain reasoning

### Why It Matters

An unfair trade-in offer can destroy all the trust you've built. Customers talk to friends and family, and they'll quickly learn if they got a fair deal. A transparent trade-in process that's backed by data creates trust and reduces friction later in the deal.

### Key Principles

- Ask about trade-in early in the process, not at the end
- Inspect thoroughly — walk around, note condition, mileage
- Use third-party data to justify your offer
- Be transparent about how you determined the value
- Separate the trade-in from the new car deal
- Offer a fair value — trust builds deals

### Common Mistakes

- Waiting until the end of the deal to bring up the trade-in — this feels like a bait-and-switch
- Lowballing the trade-in to make up profit — this destroys trust and can kill the entire deal

### Pro Tips

- If the trade-in has noticeable issues, take photos during the walk-around and show the customer — it makes the justification more transparent
- Offer to let them get a competing offer — the confidence that you'll match or beat it builds trust`,
      },
      {
        id: "step-6-price-negotiation",
        title: "Step 6: Price Negotiation",
        description: "Navigate pricing discussions while maintaining value and protecting gross profit.",
        duration: "15 min",
        content: `## Step 6: Price Negotiation

**Goal:** Navigate pricing discussions while maintaining value.

### The Value Stack

Before you discuss numbers, remind the customer of everything they loved about the vehicle. List all the features, benefits, warranty, and service that are included. When you present the price, do it with confidence.

### Key Script

"Here's the picture. The vehicle is [price], trade-in [value], and your monthly payment would be [amount]."

### Why It Matters

Every dollar you give away in negotiation comes directly from your commission and the dealership's profit. But more importantly, customers who pay full price for a fair value are happier than customers who get a discount but feel the process was adversarial.

### Key Principles

- Know your walk-away number before you start negotiating
- Focus on value, not just price
- Use silence as your most powerful negotiation tool
- Trade concessions, don't give them away
- Use the "If I... will you..." technique
- Be willing to walk away — and mean it

### Common Mistakes

- Dropping price immediately without understanding the objection — this devalues the vehicle and trains the customer to push harder
- Talking too much after presenting the number — silence is uncomfortable, but the person who breaks it first typically concedes

### Pro Tips

- Write the numbers on paper — it makes them feel more real and harder to dispute than numbers on a screen
- Use the "Feel, Felt, Found" pattern: "I understand how you feel. Many customers have felt the same way. But what they found was..."`,
      },
      {
        id: "step-7-closing",
        title: "Step 7: Closing the Sale",
        description: "Use proven closing techniques to finalize the deal with confidence.",
        duration: "15 min",
        content: `## Step 7: Closing the Sale

**Goal:** Ask for the commitment naturally and with confidence.

### The 4 Best Closes

1. **Assumptive Close** — "Let's start the paperwork"
2. **Summary Close** — Recap what they loved
3. **Question Close** — "Is there any reason we can't move forward?"
4. **Benefit Close** — Remind them of the key benefit

### Why It Matters

60% of sales are lost because the salesperson never asked for the commitment. Customers expect you to guide them through the decision. If you don't ask, they'll leave and buy from someone who will.

### Key Principles

- Assume the sale — act as if the decision has already been made
- Use trial closes throughout the process
- Create legitimate urgency without being pushy
- Ask for the commitment directly
- Use the assumptive, alternative, and summary closes
- Stay silent after asking for the close

### Common Mistakes

- Not asking for the sale — fear of rejection prevents more deals than any other factor
- Talking after asking for the close — this gives the customer reasons to say no

### Pro Tips

- Use the "Benjamin Franklin" close: list pros and cons on paper. The pros will always outweigh the cons, and they'll see it visually
- If they say "I need to think about it," isolate the objection: "What specifically do you need to think through?"`,
      },
      {
        id: "step-8-fni",
        title: "Step 8: Finance & Insurance (F&I)",
        description: "Present finance and insurance options to maximize value for the customer.",
        duration: "15 min",
        content: `## Step 8: Finance & Insurance (F&I)

**Goal:** Present protection products as solutions to real problems.

### Protection Products

- Extended warranty / service contract
- Gap insurance
- Tire & wheel protection
- Paint & fabric protection

### Why It Matters

F&I products protect the customer from unexpected expenses and generate significant profit for the dealership. A well-presented F&I menu can add $1,000-$2,000 per deal. But more importantly, customers who buy protection products are more satisfied because they feel protected.

### Key Principles

- Present F&I products as solutions, not add-ons
- Explain benefits clearly and simply
- Use third-party data to demonstrate value
- Present products one at a time, starting with the most valuable
- Address objections by reframing the value
- Complete paperwork accurately and efficiently

### Common Mistakes

- Rushing through the F&I presentation — this signals that the products aren't valuable
- Using jargon that confuses the customer — if they don't understand it, they won't buy it

### Pro Tips

- Use the "If you buy one thing, buy this" approach — it creates urgency and prioritization
- Share a real customer story where a protection product saved them money — stories are more persuasive than statistics`,
      },
      {
        id: "step-9-delivery",
        title: "Step 9: Delivery & Handover",
        description: "Ensure a smooth vehicle delivery that delights the customer.",
        duration: "15 min",
        content: `## Step 9: Delivery & Handover

**Goal:** Deliver the vehicle and create a memorable experience.

### The Delivery Checklist

- [ ] Vehicle is detailed and clean
- [ ] Full tank of gas
- [ ] Floor mats installed
- [ ] Keys and owner's manual ready
- [ ] License plates / temporary tags installed

### The Delivery Walkthrough

1. **Key features tour** — Show them how to use features
2. **Safety features** — Point out safety systems
3. **Maintenance schedule** — When to come back for service

### Why It Matters

The delivery experience determines whether the customer becomes a repeat buyer and referral source. A poor delivery can undo all the goodwill you've built. A great delivery creates a customer for life. Studies show that customers who have a positive delivery experience are 3x more likely to refer others.

### Key Principles

- Vehicle must be spotless and full of gas
- Walk through key features one at a time
- Set up phone and technology integration
- Take a photo together for a shareable moment
- Send a thank-you note within 24 hours
- Set expectations for follow-up and service

### Common Mistakes

- Rushing the delivery because the customer is eager to leave — this leads to confusion and frustration later
- Not setting up the phone integration — this is the #1 cause of post-delivery calls to the salesperson

### Pro Tips

- Have a small gift (keychain, hat, or branded item) waiting in the vehicle — it's a small touch that creates a big impression
- Record a short video walkthrough of the key features and text it to them — they'll refer back to it later`,
      },
      {
        id: "step-10-follow-up",
        title: "Step 10: Follow-Up & Referrals",
        description: "Maintain the relationship and generate repeat business.",
        duration: "15 min",
        content: `## Step 10: Follow-Up & Referrals

**Goal:** Maintain the relationship and generate repeat business.

### Post-Delivery Follow-Up Sequence

1. **Day 1** — Thank you call
2. **Week 1** — Check-in
3. **Month 1** — Satisfaction survey
4. **Month 3** — Service reminder
5. **Month 6** — Referral request

### Why It Matters

80% of sales are made between the 5th and 12th contact. Yet most salespeople stop after one or two follow-ups. A single customer who refers 3 people is worth more than 10 cold leads. Repeat customers spend 67% more than new customers. The follow-up is the highest-ROI activity a salesperson can do.

### Key Principles

- Send a thank-you note within 24 hours of delivery
- Make a follow-up call within the first week
- Schedule a 30-day check-in with the customer
- Ask for referrals at the right time — when they're happiest
- Track every interaction in a CRM
- Every contact must add value — never "just checking in"

### Common Mistakes

- Never following up after the sale — this leaves money on the table and loses future business
- Only contacting customers when you want something — this feels transactional and damages the relationship

### Pro Tips

- Set a recurring reminder in your calendar to reach out to past customers — treat it as seriously as a customer appointment
- Use a handwritten note for the first follow-up — it's rare and memorable in a digital world`,
      },
    ],
  },

  // ===== Course 2: 10 Steps of the Sale Part 2 (Quiz) =====
  {
    id: "10-steps-part-2",
    title: "10 Steps of the Sale Part 2",
    subtitle: "Test your knowledge with scenario-based quiz questions",
    description:
      "Put your knowledge to the test with 40 scenario-based quiz questions covering every step of the 10-step automotive sales process. Each lesson contains 4 multiple-choice questions with instant feedback and detailed explanations. No reading required — just jump in and test yourself.",
    levels: "Beginner",
    duration: "1.5 hours",
    lessons: 10,
    image: "drills",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    lessonsList: [
      {
        id: "quiz-step-1",
        title: "Step 1 Quiz: Greeting & Building Rapport",
        description: "4 questions on building trust and making a great first impression.",
        duration: "10 min",
        content: `## Step 1: Greeting & Building Rapport — Quiz

Test your knowledge of the greeting and rapport-building process.

### Quick Quiz

**Q1:** What is the most important goal of the greeting?
A) To qualify the customer's budget immediately
B) To build trust and make a positive first impression
C) To show the customer every vehicle on the lot
D) To get the customer's contact information
*Answer: B — The greeting is about building trust and making a positive first impression. Qualifying, showing vehicles, and gathering contact info come later in the process.*

**Q2:** What type of question should you open with?
A) A closed question like "Can I help you?"
B) An open-ended question like "What brings you in today?"
C) A leading question about budget
D) A direct question about their timeline
*Answer: B — Open-ended questions invite conversation. "Can I help you?" is a closed question that invites a "no" response and ends the conversation.*

**Q3:** How quickly do customers form their first impression?
A) Within the first minute
B) Within the first 10 seconds
C) After the first 5 minutes of conversation
D) After the test drive
*Answer: B — Customers form their first impression within 10 seconds. This makes the opening moments of the greeting critical to the entire sales process.*

**Q4:** What is the best way to make a customer feel welcomed?
A) Immediately start asking qualifying questions
B) Give them a tour of the dealership
C) Smile genuinely, make eye contact, and find common ground
D) Hand them a brochure and let them browse alone
*Answer: C — A genuine smile, eye contact, and finding common ground makes customers feel welcomed. Rushing to qualify or leaving them alone both miss the opportunity to build rapport.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-2",
        title: "Step 2 Quiz: Needs Assessment",
        description: "4 questions on qualifying customers and uncovering their needs.",
        duration: "10 min",
        content: `## Step 2: Needs Assessment — Quiz

Test your knowledge of the needs assessment and qualification process.

### Quick Quiz

**Q1:** What does the BANT framework stand for?
A) Budget, Authority, Need, Timeline
B) Benefits, Approach, Negotiation, Terms
C) Buyer, Action, Numbers, Test
D) Budget, Ask, Negotiate, Trade
*Answer: A — BANT stands for Budget, Authority, Need, Timeline. It's a framework for qualifying customers by understanding their financial range, decision-making power, requirements, and timing.*

**Q2:** What percentage of the conversation should the customer speak during needs assessment?
A) About 50%
B) About 80%
C) About 20%
D) About 60%
*Answer: B — The customer should speak about 80% of the time. Your job is to listen and ask targeted questions, not to talk about vehicles.*

**Q3:** Why is it important to summarize what the customer told you?
A) To fill silence in the conversation
B) To confirm you understood their needs correctly
C) To show off your listening skills
D) To transition to the vehicle presentation
*Answer: B — Summarizing confirms you understood their needs correctly and shows the customer you were listening. It's a trust-building technique that prevents miscommunication.*

**Q4:** What should you do if a customer says "I'm just looking"?
A) Walk away and let them browse
B) Say "Great! What kind of vehicle interests you?"
C) Follow them silently around the lot
D) Hand them a business card and leave
*Answer: B — Acknowledge their statement and keep the conversation going with a gentle, open-ended question. "I'm just looking" is often a defense mechanism, not a rejection.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-3",
        title: "Step 3 Quiz: Vehicle Presentation",
        description: "4 questions on presenting vehicles using the FAB method.",
        duration: "10 min",
        content: `## Step 3: Vehicle Presentation — Quiz

Test your knowledge of the vehicle presentation and walk-around process.

### Quick Quiz

**Q1:** What does the FAB method stand for?
A) Feature, Advantage, Benefit
B) Find, Assess, Buy
C) Feature, Ask, Bargain
D) Facts, Advantages, Benefits
*Answer: A — FAB stands for Feature, Advantage, Benefit. It's a method for presenting vehicle features by connecting each one to a specific customer advantage and benefit.*

**Q2:** How many vehicles should you present to a customer?
A) As many as possible to show options
B) 2-3 vehicles max
C) Only 1 vehicle
D) 4-5 vehicles to compare
*Answer: B — Presenting 2-3 vehicles max prevents decision paralysis. Too many options overwhelm customers and make it harder for them to commit.*

**Q3:** What is the correct walk-around sequence?
A) Interior, trunk, hood, wheels
B) Front, side, interior, back, under the hood
C) Back, front, interior, tires, engine
D) Driver side, passenger side, trunk, hood
*Answer: B — The proper walk-around sequence is: Front (grille, headlights), Side (lines, wheels), Interior (seats, technology), Back (cargo, trunk), Under the hood (engine, performance).*

**Q4:** What is the most important rule during vehicle presentation?
A) Show every available feature
B) Connect features to the customer's stated needs
C) Let the customer drive the vehicle
D) Mention the price early
*Answer: B — Every feature you highlight should connect directly back to something the customer told you during the needs assessment. This shows you were listening and that the vehicle is the right fit.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-4",
        title: "Step 4 Quiz: Test Drive",
        description: "4 questions on guiding customers through an effective test drive.",
        duration: "10 min",
        content: `## Step 4: Test Drive — Quiz

Test your knowledge of the test drive process.

### Quick Quiz

**Q1:** What percentage of customers who take a test drive are more likely to buy?
A) 50%
B) 70%
C) 90%
D) 30%
*Answer: B — Customers who take a test drive are 70% more likely to buy. The test drive creates an emotional connection that's essential for closing the deal.*

**Q2:** Who should drive first during the test drive?
A) The salesperson
B) The customer
C) Whoever is more comfortable driving
D) It doesn't matter
*Answer: B — Let the customer drive first. They need to experience the vehicle themselves to form an emotional connection. You drive back to the dealership.*

**Q3:** What should you do during the first few minutes of the test drive?
A) Point out every feature of the vehicle
B) Stay quiet and let them experience the vehicle
C) Discuss pricing and payment options
D) Ask about their trade-in vehicle
*Answer: B — Stay quiet during the first few minutes to let the customer experience the vehicle. Talking too much prevents them from forming their own emotional connection.*

**Q4:** What is the best question to ask after the test drive?
A) "What do you think?"
B) "How did that feel?"
C) "Are you ready to buy?"
D) "Did you like the acceleration?"
*Answer: B — Ask "How did that feel?" This focuses on the emotional experience rather than a logical evaluation. "What do you think?" invites criticism, while "How did that feel?" reinforces the positive experience.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-5",
        title: "Step 5 Quiz: Trade-In Appraisal",
        description: "4 questions on handling trade-in appraisals transparently.",
        duration: "10 min",
        content: `## Step 5: Trade-In Appraisal — Quiz

Test your knowledge of the trade-in appraisal process.

### Quick Quiz

**Q1:** When should you ask about a trade-in?
A) At the very end of the process
B) Early in the process
C) After the test drive
D) During the F&I presentation
*Answer: B — Ask about the trade-in early in the process. Waiting until the end can feel like a bait-and-switch and makes the customer suspicious.*

**Q2:** What should you use to justify your trade-in offer?
A) Your gut feeling about the vehicle's condition
B) Third-party data like Kelley Blue Book or NADA
C) What other customers have been offered
D) The dealership's standard trade-in formula
*Answer: B — Use third-party data sources like Kelley Blue Book or NADA to justify your offer. This provides an objective, trustworthy basis for the valuation.*

**Q3:** How should you handle the trade-in appraisal?
A) Quickly and without much discussion
B) Transparently, explaining how you determined the value
C) As a separate negotiation from the new car deal
D) Both B and C
*Answer: D — Be transparent about how you determined the value AND separate the trade-in from the new car deal. Both practices build trust and keep the numbers clear.*

**Q4:** What should you do if the customer disagrees with your trade-in offer?
A) Refuse to negotiate on the trade-in value
B) Immediately increase the offer to keep them happy
C) Offer to let them get a competing offer from another dealer
D) Reduce the price of the new vehicle instead
*Answer: C — Offering to let them get a competing offer shows confidence in your valuation and builds trust. If they find a better offer, you can match or beat it.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-6",
        title: "Step 6 Quiz: Price Negotiation",
        description: "4 questions on navigating pricing discussions effectively.",
        duration: "10 min",
        content: `## Step 6: Price Negotiation — Quiz

Test your knowledge of the price negotiation process.

### Quick Quiz

**Q1:** What should you do before presenting the price?
A) Remind the customer of the value they're getting
B) Ask for their ideal price first
C) Check with your manager for approval
D) Mention any current promotions
*Answer: A — Before presenting the price, recap the value. Remind them of everything they loved about the vehicle. This shifts the conversation from price to value.*

**Q2:** What is your most powerful negotiation tool?
A) A lower price
B) Silence
C) Product knowledge
D) A strong personality
*Answer: B — Silence is your most powerful negotiation tool. After presenting the number, stay silent. The person who speaks first typically concedes something.*

**Q3:** What is the "If I... will you..." technique?
A) Asking for permission before showing a vehicle
B) Trading a concession for a commitment
C) Asking if they're ready to buy
D) Offering a discount without conditions
*Answer: B — The "If I... will you..." technique trades a concession for a commitment. For example: "If I can get the payment to $X, will you take it home today?" This ensures you don't give away concessions for free.*

**Q4:** What is the #1 mistake in price negotiation?
A) Not knowing your walk-away number
B) Dropping price immediately without understanding the objection
C) Being too aggressive with the customer
D) Not having manager approval
*Answer: B — Dropping price immediately without understanding the objection devalues the vehicle and trains the customer to push harder. Always understand the objection first, then respond.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-7",
        title: "Step 7 Quiz: Closing the Sale",
        description: "4 questions on proven closing techniques.",
        duration: "10 min",
        content: `## Step 7: Closing the Sale — Quiz

Test your knowledge of closing techniques.

### Quick Quiz

**Q1:** What percentage of sales are lost because the salesperson never asked for the commitment?
A) 30%
B) 60%
C) 80%
D) 45%
*Answer: B — 60% of sales are lost because the salesperson never asked for the commitment. Fear of rejection is the #1 reason salespeople fail to close.*

**Q2:** What is the assumptive close?
A) Asking if they want to buy the vehicle
B) Acting as if the decision has already been made
C) Assuming they'll need time to think about it
D) Assuming they want a lower price
*Answer: B — The assumptive close means acting as if the decision has already been made. Instead of asking "Do you want to buy?" you say "Let's get the paperwork started."*

**Q3:** What should you do after asking for the commitment?
A) Immediately start explaining the benefits again
B) Stay silent and wait for their response
C) Ask if they have any questions
D) Offer a discount to sweeten the deal
*Answer: B — After asking for the commitment, stay silent. Count to 10 if you have to. The first person to speak after the ask typically concedes something.*

**Q4:** What does the "alternative close" do?
A) Gives the customer a choice between two positive options
B) Offers a third option when they're stuck
C) Presents the pros and cons of buying
D) Asks if they need to think about it
*Answer: A — The alternative close gives the customer a choice between two positive options: "Would you like the red or the blue?" Either choice leads to a sale.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-8",
        title: "Step 8 Quiz: Finance & Insurance (F&I)",
        description: "4 questions on presenting F&I products effectively.",
        duration: "10 min",
        content: `## Step 8: Finance & Insurance (F&I) — Quiz

Test your knowledge of the F&I presentation process.

### Quick Quiz

**Q1:** When is the best time to present F&I products?
A) Before the test drive
B) After the customer has agreed to purchase
C) During the vehicle presentation
D) During the price negotiation
*Answer: B — The best time to present F&I products is after the customer has agreed to purchase. They're in a positive emotional state and more receptive to additional value.*

**Q2:** How should F&I products be presented?
A) As a bundle with a single price
B) As solutions to real problems, one at a time
C) As optional add-ons at the end of paperwork
D) As required for financing approval
*Answer: B — Present F&I products as solutions to real problems, one at a time. Explain the problem each product solves, then present the solution. This creates perceived value.*

**Q3:** Why is it important to use third-party data in F&I?
A) It makes the presentation longer
B) It shows the real cost of not having protection
C) It's required by law
D) It impresses the customer with your knowledge
*Answer: B — Third-party data shows the real-world cost of not having protection. For example: "The average transmission repair costs $3,500. This warranty covers that for 7 years."*

**Q4:** What is the best way to handle an F&I objection?
A) Immediately lower the price of the product
B) Reframe the value and share a customer story
C) Tell the customer it's mandatory
D) Skip to the next product
*Answer: B — Reframe the value and share a customer story. Real stories about how protection products saved customers money are more persuasive than feature lists.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-9",
        title: "Step 9 Quiz: Delivery & Handover",
        description: "4 questions on delivering a memorable handover experience.",
        duration: "10 min",
        content: `## Step 9: Delivery & Handover — Quiz

Test your knowledge of the delivery and handover process.

### Quick Quiz

**Q1:** What is the most important part of the delivery experience?
A) Getting the customer to leave quickly
B) Making the customer feel celebrated and confident
C) Completing all the paperwork
D) Installing the license plates
*Answer: B — The delivery should make the customer feel celebrated and confident in their purchase. This creates a lasting positive impression that leads to referrals and repeat business.*

**Q2:** What is the #1 cause of post-delivery calls to the salesperson?
A) The vehicle has mechanical issues
B) The customer can't set up their phone integration
C) The customer lost their keys
D) The customer forgot how to use features
*Answer: B — Not setting up phone integration is the #1 cause of post-delivery calls. Always set up Bluetooth and phone connectivity before the customer leaves.*

**Q3:** How soon should you send a thank-you note after delivery?
A) Within 24 hours
B) Within a week
C) Within a month
D) At the first service appointment
*Answer: A — Send a thank-you note within 24 hours of delivery. This is when the customer is most excited about their purchase and most likely to remember you positively.*

**Q4:** What should you do during the delivery walkthrough?
A) Show them every feature at once
B) Walk through key features one at a time
C) Let them figure it out on their own
D) Give them the owner's manual and let them read it
*Answer: B — Walk through key features one at a time. Too much information at once is overwhelming. Focus on the features they'll use most often.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
      {
        id: "quiz-step-10",
        title: "Step 10 Quiz: Follow-Up & Referrals",
        description: "4 questions on maintaining relationships and generating referrals.",
        duration: "10 min",
        content: `## Step 10: Follow-Up & Referrals — Quiz

Test your knowledge of the follow-up and referral process.

### Quick Quiz

**Q1:** What percentage of sales are made between the 5th and 12th contact?
A) 50%
B) 80%
C) 60%
D) 90%
*Answer: B — 80% of sales are made between the 5th and 12th contact. Yet most salespeople stop after one or two follow-ups. Persistence pays off.*

**Q2:** What is the most important follow-up activity?
A) A sales pitch a week after delivery
B) A thank-you call within 24 hours of delivery
C) A monthly newsletter
D) A referral request on the first call
*Answer: B — A thank-you call within 24 hours is the most important follow-up. It shows you care about the customer beyond the sale and sets the tone for the ongoing relationship.*

**Q3:** When is the best time to ask for a referral?
A) On the first follow-up call
B) When the customer is happiest with their purchase
C) At the one-year anniversary of the purchase
D) During the price negotiation
*Answer: B — Ask for referrals when the customer is happiest — typically right after delivery or after a positive service experience. This is when they're most likely to say yes.*

**Q4:** What is the golden rule of follow-up?
A) Contact them as often as possible
B) Every contact must add value — never "just checking in"
C) Only contact them when you have a special offer
D) Let the customer initiate all follow-up
*Answer: B — Every contact must add value. Never "just checking in" — that's a waste of their time and yours. Share useful information, a maintenance tip, or a new inventory alert.*
**Q5:** What is the single best predictor of whether a customer will buy from you?
A) The price you offer
B) How quickly you build genuine rapport and trust
C) The specific vehicle they looked at first
D) The weather on the day of their visit
*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*
`,
      },
    ],
  },

  // ===== Course 3: Advanced Closing (expanded with MCQs) =====
  {
    id: "advanced-closing",
    title: "Advanced Closing Techniques",
    subtitle: "Take your closing rate to the next level",
    description:
      "Advanced techniques for experienced sales professionals. Each module includes in-depth strategy breakdowns, real-world applications, and 5 multiple-choice quiz questions. Master negotiation, handle multiple decision makers, and build a referral network that drives consistent sales.",
    levels: "Advanced",
    duration: "3 hours",
    lessons: 5,
    image: "closing",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    lessonsList: [
      {
        id: "negotiation",
        title: "Negotiation Mastery",
        description: "Learn advanced negotiation tactics to maximize deal value.",
        duration: "10 min",
        content: `## Negotiation Mastery

Negotiation is where profit is won or lost. The best negotiators don't just get the deal done — they maximize value for both the customer and the dealership while protecting gross profit. This module teaches you the advanced tactics that separate top performers from the pack.

### The Negotiation Mindset

Most salespeople approach negotiation defensively, bracing for the customer's attack on price. Top performers approach it as a collaborative problem-solving exercise. The customer has a number in mind; you have a business to run. The goal isn't to "win" — it's to find the overlap where both parties feel satisfied.

### Key Principles

**Know your BATNA (Best Alternative to a Negotiated Agreement) before you start.** What's the minimum deal you'll accept? What happens if this deal falls through? Knowing your walk-away point gives you confidence and prevents emotional decisions. Write it down before the customer sits at your desk.

**Anchor high but reasonably.** The first number mentioned in any negotiation becomes the anchor that all subsequent discussion orbits around. If you say nothing, the customer will anchor low. Present your numbers first, backed by market data, invoice pricing, and value-adds that justify the figure.

**Trade concessions, never give them.** If the customer asks for $500 off, ask for something in return: a commitment to close today, a higher down payment, or an agreement to finance through your F&I department. Concessions given freely are perceived as worthless; concessions traded feel earned.

**Use silence strategically.** After making an offer, stop talking. Most salespeople fill the silence with nervous chatter that weakens their position. Let the customer process. The first person to speak after a proposal typically makes a concession.

**Bundle and unbundle.** When discussing price, bundle everything together (vehicle, warranty, accessories). When discussing value, unbundle (safety features save $X, fuel economy saves $Y, resale value returns $Z). This framing shifts the conversation from cost to investment.

### Multiple Choice Quiz

**Q1:** What does BATNA stand for?
A) Best Available Trade Negotiation Approach
B) Best Alternative to a Negotiated Agreement
C) Buyer and Trader Negotiation Analysis
D) Basic Agreement Terms and Numbers Audit

**Q2:** Why should you present your numbers first in a negotiation?
A) It makes you seem aggressive
B) The first number anchors all subsequent discussion
C) It confuses the customer
D) Customers prefer it that way

**Q3:** When a customer asks for a $500 discount, what is the best response?
A) Give it to them immediately
B) Refuse flatly
C) Trade the concession for something of value in return
D) Walk away from the deal

**Q4:** After making an offer, what should you do?
A) Fill the silence with small talk
B) Lower the price immediately
C) Stop talking and let the customer process
D) Ask if they need to think about it

**Q5:** What is the primary goal of negotiation according to this module?
A) Win at all costs
B) Find the overlap where both parties feel satisfied
C) Get the highest price possible
D) Close the deal as fast as possible

**Answers:**
1. B — BATNA = Best Alternative to a Negotiated Agreement, your walk-away baseline.
2. B — The first number anchors the negotiation; present yours backed by data.
3. C — Trade concessions for commitments; never give them freely.
4. C — Silence is powerful; let the customer process and respond first.
5. B — Collaborative problem-solving creates win-win outcomes and repeat business.`,
      },
      {
        id: "multi-decision-maker",
        title: "Handling Multiple Decision Makers",
        description: "Navigate sales involving spouses, partners, and family members.",
        duration: "10 min",
        content: `## Handling Multiple Decision Makers

One of the most challenging scenarios in automotive sales is when more than one person is involved in the buying decision. Whether it's a married couple, a parent helping a child, or business partners, multiple decision makers multiply the complexity. This module shows you how to manage group dynamics and close the deal when everyone needs to say yes.

### Understanding Group Dynamics

When two or more people are shopping together, each person has their own priorities, concerns, and decision-making style. Often, one person is the primary driver of the purchase (the "champion") while the other is the "validator" who must be convinced before the deal can proceed. Misreading who plays which role is the most common mistake.

### Key Strategies

**Identify the decision-making structure early.** During the needs assessment, ask open-ended questions to both parties: "What's most important to each of you in a new vehicle?" "How do you typically make big decisions together?" Watch body language — who defers to whom, who makes the final call on test drive routes and feature preferences.

**Address each person's needs directly.** If one person cares about safety and the other cares about technology, make sure you've covered both thoroughly. Nothing kills a deal faster than one person feeling ignored. Rotate your eye contact and questions between all parties.

**The "unified solution" close.** After presenting the vehicle, summarize how it meets each person's top 2-3 priorities. "So we've got the top safety rating you wanted, the cargo space for your family trips, and the tech package that makes your commute easier. This vehicle checks everyone's boxes." This framing makes the purchase feel like a shared win rather than a compromise.

**Handle side conversations.** Couples often whisper to each other during the sales process. Instead of standing awkwardly, say: "I want to make sure we address any questions — what concerns are you discussing?" This brings private objections into the open where you can handle them.

**When one is ready and the other isn't.** Use the "temperature check": "On a scale of 1-10, how well does this vehicle fit what you're looking for?" If scores differ significantly, ask the lower-scoring person: "What would need to change to move that from a 6 to a 9?" This surfaces the real objection without confrontation.

**Never take sides.** Even if you agree with one person's opinion, stay neutral and focus on finding solutions. Taking sides creates a win-lose dynamic that will come back to haunt you at closing time.

### Multiple Choice Quiz

**Q1:** When selling to multiple decision makers, what is the first thing you should do?
A) Focus only on the person who seems most interested
B) Identify who plays what role in the decision-making process
C) Ask one person to wait in the lounge
D) Offer a discount to speed things up

**Q2:** What is the "unified solution" close?
A) Only talking to one person
B) Summarizing how the vehicle meets each person's priorities
C) Splitting the difference on price
D) Asking them to decide separately

**Q3:** When a couple whispers to each other during your presentation, you should:
A) Ignore it and keep talking
B) Leave the room
C) Ask what concerns they're discussing so you can address them
D) Call your manager

**Q4:** What's the best way to handle one person being ready to buy while the other hesitates?
A) Focus only on the enthusiastic person
B) Use a temperature check to surface the hesitant person's concerns
C) Pressure the hesitant person to decide
D) Give up on the sale

**Q5:** Why should you never take sides between decision makers?
A) It's illegal
B) It creates a win-lose dynamic that damages trust and future business
C) It takes too long
D) The manager won't allow it

**Answers:**
1. B — Identifying decision-making roles early is critical to managing the sale effectively.
2. B — Frame the purchase as meeting everyone's needs — a shared win.
3. C — Private conversations hide objections; bring them into the open professionally.
4. B — Temperature checks surface real concerns without confrontation.
5. B — Staying neutral preserves trust with both parties and enables a true win-win.`,
      },
      {
        id: "phone-up",
        title: "Phone-Up and Internet Lead Closing",
        description: "Convert remote inquiries into showroom visits and closed deals.",
        duration: "10 min",
        content: `## Phone-Up and Internet Lead Closing

Before a customer ever walks through your door, they've likely already interacted with your dealership online or over the phone. How you handle these initial contacts determines whether they visit your showroom — or your competitor's. This module covers the art and science of converting remote inquiries into appointments and sales.

### The 5-Minute Rule

Speed is everything in internet lead response. Studies consistently show that leads contacted within 5 minutes convert at 100x the rate of leads contacted after 30 minutes. The customer is actively shopping — probably filling out forms on multiple dealer websites simultaneously. The first dealer to respond professionally wins.

### Phone-Up Best Practices

**Answer enthusiastically on the second ring.** First ring creates anticipation; third ring suggests you're too busy. Your tone sets the entire trajectory of the call. Smile when you answer — it literally changes your voice and the customer can hear it.

**Goal: Get them in the door, not close over the phone.** Phone shoppers want information. Give them just enough to build curiosity and trust, then pivot to an appointment. "That's a great question — I can give you the best answer when you see it in person. When works better for you — this afternoon or tomorrow morning?"

**Use the alternative-choice appointment technique.** Never ask "Would you like to come in?" Instead: "I have availability at 2pm or 4pm — which works better?" This assumes the appointment and makes the decision about timing, not whether.

**Handle price questions deftly.** When a caller asks "What's your best price?", don't quote numbers over the phone. Say: "Our prices are very competitive, and we have some programs running this month that could save you even more. The best way to get your exact price is to come in so I can factor in any incentives you qualify for. Can you stop by this afternoon?"

### Internet Lead Response Formula

Every internet lead response should follow the **PVA Formula: Personalize, Value, Action.**

**Personalize:** Reference their specific inquiry. "Thanks for your interest in the 2024 Silverado 1500 — that's a fantastic truck with the best towing capacity in its class."

**Value:** Give them a reason to choose you. "We have 3 LT models in stock with different configurations, and several current incentives that could lower your payment significantly."

**Action:** Clear next step with time pressure. "I'd love to go over the numbers with you in person. I have openings at 3pm today or 10am tomorrow — which works better?"

### Handling Common Phone Objections

**"I'm just shopping around."** → "I understand — that's smart. When you come in, I'll give you all the specs and numbers so you can make the best comparison. Our best pricing is in-store — can you swing by this afternoon?"

**"Just send me the price."** → "I'll have your exact price ready when you arrive — it depends on which incentives you qualify for. I can walk you through everything in about 20 minutes. Does 3pm work?"

**"I'm not ready to buy yet."** → "No problem — this visit is just to get you the information you need. No pressure, just facts. Would tomorrow morning work?"

### Multiple Choice Quiz

**Q1:** How quickly should you respond to an internet lead for maximum conversion?
A) Within 24 hours
B) Within 5 minutes
C) By end of business day
D) Within 1 hour

**Q2:** What is the primary goal of a phone-up conversation?
A) Close the sale over the phone
B) Quote the lowest price
C) Get the customer to visit the showroom
D) Collect their email address

**Q3:** What is the PVA formula for internet lead responses?
A) Price, Vehicle, Agreement
B) Personalize, Value, Action
C) Promote, Verify, Ask
D) Prepare, Visit, Acknowledge

**Q4:** When a caller asks "What's your best price?", you should:
A) Give them your absolute lowest number
B) Tell them to check your website
C) Invite them in so you can factor in all applicable incentives
D) Hang up

**Q5:** What appointment-setting technique should you use?
A) "Would you like to come in?"
B) Alternative-choice: "2pm or 4pm — which works better?"
C) "Call us when you're ready"
D) "We're open whenever"

**Answers:**
1. B — Leads contacted within 5 minutes convert at dramatically higher rates.
2. C — The phone's purpose is to get the customer into the showroom.
3. B — PVA = Personalize the response, add Value, give a clear Action step.
4. C — Never quote prices over the phone; use it to create an appointment.
5. B — Alternative-choice questions assume the appointment and make timing the only decision.`,
      },
      {
        id: "referral-networks",
        title: "Building a Referral Network",
        description: "Create a sustainable pipeline of repeat and referral business.",
        duration: "10 min",
        content: `## Building a Referral Network

The highest-ROI marketing strategy in automotive sales isn't digital ads, direct mail, or social media — it's referrals. Referred customers close at nearly double the rate of walk-in traffic, have higher customer satisfaction scores, and cost the dealership nothing to acquire. Top performers build systematic referral networks that produce consistent business month after month.

### Why Referrals Are the Ultimate Growth Engine

Consider the math: if you sell 15 cars per month and each happy customer refers just one person per year, that's 180 referral opportunities annually. Even a 50% close rate on referrals means 90 additional sales — a 50% increase in annual production. And referral customers tend to have higher gross profits because they're less price-sensitive and more trusting.

### The Referral Mindset

Most salespeople ask for referrals once — at delivery — and never again. That's leaving money on the table. Referral generation should be woven into every customer touchpoint: the test drive, the negotiation, the delivery, the follow-up call, the service visit.

**The key insight:** People refer others because it makes THEM look good. Your job is to make your customers look like heroes to their friends and family. Provide an exceptional experience worth talking about, then make it easy for them to spread the word.

### When to Ask for Referrals

**During the sale (plant the seed):** "I'm really enjoying working with you. If we can get this deal done today, I hope you'll think of me when friends or family are looking for a vehicle."

**At delivery (the peak moment):** The customer is excited about their new car. This is the single best moment to ask. Hand them 3 of your business cards and say: "If anyone you know is in the market, I'd love to give them the same experience you had today."

**30-day follow-up call:** "How's the new car treating you? By the way, I'm working with a few people looking for similar vehicles — if you know anyone, I'd really appreciate the introduction."

**Service visits:** Partner with your service department. When a customer brings their vehicle in for maintenance, have the service advisor mention: "Your salesperson [Name] wanted me to remind you that they're always available for friends and family."

### Creating a Referral System

Top performers don't just ask — they build systems:
1. **Track referrals** in your CRM with source attribution
2. **Send thank-you gifts** for every closed referral (gift cards, car wash vouchers, etc.)
3. **Create a "referral club"** — customers who refer 3+ people get VIP treatment (priority service appointments, birthday gifts, event invitations)
4. **Ask for online reviews** that mention you by name — these become passive referral tools
5. **Stay top of mind** with quarterly check-in emails or cards

### Multiple Choice Quiz

**Q1:** Approximately how much higher is the close rate on referred customers compared to walk-in traffic?
A) 10% higher
B) 25% higher
C) Nearly double
D) It's about the same

**Q2:** When is the single best moment to ask for a referral?
A) During the test drive
B) At vehicle delivery, when excitement is highest
C) Six months after purchase
D) Never — it's pushy

**Q3:** Why do people refer others?
A) For the monetary reward
B) Because it makes them look good to their friends and family
C) Because they feel obligated
D) To help the dealership

**Q4:** How many referral opportunities does a salesperson selling 15 cars/month potentially generate annually (at 1 referral per customer)?
A) About 50
B) About 100
C) About 180
D) About 500

**Q5:** What is the most effective way to build a sustainable referral pipeline?
A) Ask once at delivery and hope for the best
B) Build a systematic approach with tracking, thank-you gifts, and regular touchpoints
C) Offer cash for referrals
D) Wait for customers to volunteer referrals

**Answers:**
1. C — Referred customers close at nearly double the rate of walk-in traffic.
2. B — The excitement of delivery is the peak moment to ask for referrals.
3. B — People refer to look good to friends; make your customers look like heroes.
4. C — 15 cars/month times 12 months times 1 referral = 180 annual opportunities.
5. B — Systematic tracking, appreciation, and consistent outreach create sustainable referral flow.`,
      },
      {
        id: "closing-psychology",
        title: "The Psychology of Closing",
        description: "Understand the psychological triggers that lead to buying decisions.",
        duration: "10 min",
        content: `## The Psychology of Closing

Closing isn't about tricks or pressure — it's about understanding how people make decisions and creating the conditions where saying "yes" feels natural and right. This module explores the psychological principles that drive purchase decisions and how to apply them ethically in the automotive sales process.

### Why People Buy (and Why They Don't)

People don't buy cars — they buy what the car does for them. They buy safety for their family, status among peers, freedom for road trips, reliability for their commute. The emotional decision comes first; the logical justification follows. Your job is to connect the vehicle's features to the customer's emotional drivers.

**Loss aversion** is twice as powerful as gain motivation. People are more motivated to avoid losing $500 than to gain $500. Frame your value proposition around what they'll miss by not acting: "This incentive ends Monday — that's $2,000 you'd leave on the table."

### Key Psychological Principles

**Reciprocity:** When you give something first, people feel a subconscious obligation to give back. This is why providing exceptional service, free coffee, a thorough walkaround, and genuine expertise creates a psychological debt that makes the customer want to reciprocate with a purchase.

**Social Proof:** People look to others to determine what's right. Use this by sharing: "We've sold 12 of these this month — customers love the fuel economy." Online reviews, testimonials, and popularity data all leverage social proof.

**Commitment and Consistency:** Once someone commits to a small thing, they're more likely to commit to bigger things. This is why micro-agreements ("Does this cargo space solve your issue?") are so effective — each small "yes" builds toward the big one.

**Scarcity:** Things become more desirable when they're perceived as limited. "This is the last one in this color with these options" creates urgency — but only if it's true. Never manufacture false scarcity; customers will see through it and trust is destroyed.

**Authority:** People defer to experts. Build your authority by demonstrating deep product knowledge, sharing market data, and positioning yourself as a trusted advisor rather than just a salesperson.

### The Ethical Close

Pressure tactics may work once, but they destroy repeat business and referrals. The ethical close is simply helping the customer make the decision they already want to make. If you've done a proper needs assessment, presented the right vehicle, and demonstrated genuine value, closing is the natural conclusion — not a battle.

### Multiple Choice Quiz

**Q1:** According to this module, what is more powerful — loss aversion or gain motivation?
A) Gain motivation
B) Loss aversion — by about 2x
C) They're equal
D) Neither matters

**Q2:** What psychological principle explains why providing exceptional service creates a subconscious urge to reciprocate?
A) Scarcity
B) Social proof
C) Reciprocity
D) Authority

**Q3:** Why are micro-agreements effective during the sales process?
A) They're legally binding
B) They leverage commitment and consistency — each "yes" builds toward the big one
C) They confuse the customer
D) They replace the need for a test drive

**Q4:** How should scarcity be used in automotive sales?
A) Always claim inventory is almost gone
B) Only when genuinely true, to maintain trust
C) Never — it doesn't work
D) Only with used cars

**Q5:** What is the "ethical close"?
A) Using any means necessary to get a signature
B) Helping the customer make the decision they already want to make
C) Avoiding closing altogether
D) Offering the lowest price

**Answers:**
1. B — Loss aversion is approximately 2x more powerful than gain motivation.
2. C — Reciprocity: giving first creates a natural desire to give back.
3. B — Small commitments build psychological momentum toward the final decision.
4. B — Only use genuine scarcity; false scarcity destroys trust and long-term relationships.
5. B — The ethical close is the natural conclusion of serving the customer's needs well.`,
      },
    ],
  },
// ===== Course 3b: Advanced Closing Part 2 (Plus-gated) =====
  {
    id: "advanced-closing-part2",
    title: "Advanced Closing Strategies Part 2",
    subtitle: "Consultative closing techniques that close more deals",
    description:
      "Master modern consultative closing techniques for today's informed buyers. 4 lessons covering Alternative Choice Close, Assumptive Trial Close, Either/Or Objection Handling, and Micro-Agreements. 7 MCQs per lesson.",
    levels: "Advanced",
    duration: "2 hours",
    lessons: 4,
    image: "closing",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    requiredTier: "plus",
    lessonsList: [
      {
        id: "alternative-choice",
        title: "The Alternative Choice Close",
        description: "Replace yes/no questions with choice-based closes that assume the sale.",
        duration: "5 min",
        content: "## The Alternative Choice Close\n\nInstead of asking if they are ready to buy, offer two options: Does 60-month or 72-month financing work better? Assume the purchase and focus on logistics.\n\n### Quick Quiz\n\n**Q1:** The Alternative Choice shifts thinking from ____ to ____.\nA) price to value\nB) should I buy to how should I buy\nC) now to later\nD) car to truck\n**(Correct: B)**\n\n**Q2:** When to deploy?\nA) Immediately on greeting\nB) After value is established\nC) Only after they say yes\nD) Never\n**(Correct: B)**\n\n**Q3:** Best Alternative Choice question?\nA) Are you buying this car?\nB) Would you prefer the red or blue?\nC) What color?\nD) Should I call my manager?\n**(Correct: B)**\n\n**Q4:** Why avoid offering one bad option?\nA) It is illegal\nB) Customers see through manipulation\nC) Takes too long\nD) Both are equally good\n**(Correct: B)**\n\n**Q5:** What follows after asking the choice question?\nA) Answer objections immediately\nB) Pause and let them process\nC) Repeat the question\nD) Move to paperwork\n**(Correct: B)**\n\n**Q6:** Which is NOT effective?\nA) 60-month or 72-month?\nB) Friday or Saturday delivery?\nC) Are you SURE you do not want it?\nD) Red exterior or blue?\n**(Correct: C)**\n\n**Q7:** This close works best with:\nA) High pressure\nB) A thorough needs assessment confirming fit\nC) Multiple calls\nD) Immediate discount\n**(Correct: B)**",
      },
      {
        id: "assumptive-trial",
        title: "The Assumptive Trial Close",
        description: "Test commitment right after the test drive before final negotiations.",
        duration: "5 min",
        content: "## The Assumptive Trial Close\n\nRight after the test drive, ask: If we can get the payments where you need them, is this the exact car you want to drive home today? This establishes mental ownership before numbers.\n\n### Quick Quiz\n\n**Q1:** Ideal timing for Assumptive Trial Close?\nA) During greeting\nB) Right after the test drive\nC) After they leave\nD) During paperwork\n**(Correct: B)**\n\n**Q2:** What does this close achieve?\nA) Forces immediate signature\nB) Isolates price as the only remaining variable\nC) Replaces the test drive\nD) Guarantees sale\n**(Correct: B)**\n\n**Q3:** Which phrase plants mental ownership?\nA) If we can get the payments\nB) Is this the exact car\nC) Drive home today\nD) Where you need them\n**(Correct: C)**\n\n**Q4:** If they say not sure, respond with:\nA) Offer a discount\nB) End interaction\nC) What would need to be different?\nD) Repeat the question\n**(Correct: C)**\n\n**Q5:** This close is best described as:\nA) High-pressure tactic\nB) Temperature check before negotiations\nC) Confusion tactic\nD) Replacement for sales process\n**(Correct: B)**\n\n**Q6:** Only use with buyers who already agreed?\nA) True\nB) False\n**(Correct: B)**\n\n**Q7:** After successful trial close, next step:\nA) More trial closes\nB) Send them home\nC) Confidently move to numbers\nD) Start over\n**(Correct: C)**",
      },
      {
        id: "either-or-objections",
        title: "Either/Or Objection Handling",
        description: "Isolate the real objection by framing it as an either/or choice.",
        duration: "5 min",
        content: "## Either/Or Objection Handling\n\nWhen customer says I need to think about it, ask: Is it the trade-in value or the monthly payment? Isolate the real issue and provide a concrete solution.\n\n### Quick Quiz\n\n**Q1:** Primary purpose of Either/Or?\nA) Pressure to buy\nB) Transform vague objection into solvable problem\nC) Confuse customer\nD) End conversation\n**(Correct: B)**\n\n**Q2:** Best Either/Or for I need to think?\nA) Why, what is wrong?\nB) Is it the trade-in or the payment?\nC) OK, call me later\nD) We have other cars\n**(Correct: B)**\n\n**Q3:** What tone to use?\nA) Aggressive\nB) Curious and helpful\nC) Sarcastic\nD) Indifferent\n**(Correct: B)**\n\n**Q4:** Why say I need to think?\nA) Wasting time\nB) Unspoken concern\nC) Already buying elsewhere\nD) Do not like you\n**(Correct: B)**\n\n**Q5:** After identifying real issue:\nA) Celebrate\nB) Provide concrete solution\nC) Ask another Either/Or\nD) Walk away\n**(Correct: B)**\n\n**Q6:** NOT a good Either/Or?\nA) Trade-in or payment?\nB) Color or features?\nC) Why do not you just buy it?\nD) Timing or financing?\n**(Correct: C)**\n\n**Q7:** Best combined with:\nA) Active listening and curiosity\nB) Aggressive negotiation\nC) Ignoring body language\nD) Multiple calls over weeks\n**(Correct: A)**",
      },
      {
        id: "micro-agreements",
        title: "Micro-Agreements",
        description: "Build toward the close with layers of small agreements throughout the sale.",
        duration: "5 min",
        content: "## Micro-Agreements\n\nInstead of one big close, build commitment incrementally. Confirm small agreements: Does this cargo space solve your issue? By paperwork time, they have agreed multiple times.\n\n### Quick Quiz\n\n**Q1:** Core principle of Micro-Agreements?\nA) Repeat same question\nB) Build through layers of small incremental yeses\nC) Use legal jargon\nD) Small discounts throughout\n**(Correct: B)**\n\n**Q2:** What makes it psychologically effective?\nA) People enjoy pressure\nB) People want consistency with prior commitments\nC) People do not notice small questions\nD) People buy on impulse\n**(Correct: B)**\n\n**Q3:** Good micro-agreement during walkaround?\nA) You are buying this, right?\nB) Does this cargo config solve your space issue?\nC) This car is the best, is not it?\nD) Sign here now\n**(Correct: B)**\n\n**Q4:** When NOT to use a micro-agreement?\nA) During needs assessment\nB) During test drive\nC) When customer just raised a genuine concern\nD) During feature demo\n**(Correct: C)**\n\n**Q5:** How many micro-agreements per sale?\nA) One\nB) 4-6, spaced naturally\nC) At least 20\nD) None, just close at end\n**(Correct: B)**\n\n**Q6:** Best post-test-drive question?\nA) On a scale of 1-10, how well does this fit?\nB) You are buying, right?\nC) Did you like it?\nD) Are we done?\n**(Correct: A)**\n\n**Q7:** Micro-agreements eliminate need for final close?\nA) True\nB) False\n**(Correct: B)**",
      },
    ],
  },
    // ===== Course 4: Digital Marketing (expanded with MCQs) =====
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
        content: `## Social Media for Car Dealers

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
5. B — Responding within 1 hour shows customers you're attentive and professional.`,
      },
      {
        id: "email-marketing",
        title: "Email Marketing Campaigns",
        description: "Build and nurture leads through targeted email.",
        duration: "10 min",
        content: `## Email Marketing Campaigns

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
5. B — A single clear call-to-action focuses the reader and drives the desired response.`,
      },
      {
        id: "direct-mail",
        title: "Direct Mail That Works",
        description: "Create effective direct mail campaigns that drive showroom traffic.",
        duration: "10 min",
        content: `## Direct Mail That Works

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
5. C — Physical mail stands out because people receive far fewer pieces than digital messages.`,
      },
      {
        id: "marketing-roi",
        title: "Measuring Marketing ROI",
        description: "Track, analyze, and optimize your marketing spend for maximum return.",
        duration: "10 min",
        content: `## Measuring Marketing ROI

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
5. C — Weekly reviews catch trends early and enable quick optimization.`,
      },
    ],
  },
// ===== Course 5: Customer Experience (expanded with MCQs) =====
  {
    id: "customer-experience",
    title: "Customer Experience Excellence",
    subtitle: "Turn every interaction into a 5-star experience",
    description:
      "Learn how to deliver exceptional customer experiences that drive satisfaction, positive reviews, and repeat business. Each module includes in-depth strategies, real-world applications, and 5 multiple-choice quiz questions.",
    levels: "Intermediate",
    duration: "2 hours",
    lessons: 4,
    image: "experience",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    lessonsList: [
      {
        id: "first-contact",
        title: "First Contact to First Visit",
        description: "Convert online inquiries into showroom visits with a world-class first impression.",
        duration: "10 min",
        content: `## First Contact to First Visit

The first interaction between your dealership and a potential customer sets the tone for the entire relationship. Whether it's an internet lead, a phone call, or a walk-in, the first few minutes determine whether the customer stays, buys, and returns — or walks out and never comes back.

### The Psychology of First Impressions

Research shows that people form a lasting impression within 7 seconds of meeting someone. In a dealership context, that impression is formed before the customer even speaks: your facility's appearance, the parking lot, the greeting they receive, the smell of the showroom, the demeanor of the receptionist. Every detail matters.

### The 5-Minute Response Rule

For internet leads and phone inquiries, response speed is the single biggest factor in conversion. Leads contacted within 5 minutes convert at dramatically higher rates than those contacted after 30 minutes. Set up automated acknowledgment emails, but always follow up personally within minutes. The customer is actively shopping — be the first to respond professionally.

### Converting an Inquiry into a Visit

When responding to an online inquiry or phone call, use the **AIR Method:**

**Acknowledge:** Thank them for their interest and reference their specific inquiry. "Thanks for asking about the 2024 Honda CR-V — great choice with top safety ratings."

**Inform:** Give them one compelling piece of information they didn't know. "We actually have three different trim levels in stock right now, and there's a manufacturer incentive this month that could save you up to $1,500."

**Request:** Ask for the appointment using alternative-choice language. "I'd love to show you the differences in person. I have availability at 2pm or 4pm today — which works better?"

### Creating a Welcoming Environment

When the customer arrives:
- Greet them warmly within 30 seconds of entering
- Offer refreshments immediately
- Have the vehicle they inquired about pulled up and ready
- Address them by name
- Thank them for making the trip

### Multiple Choice Quiz

**Q1:** How quickly do people form a lasting first impression?
A) Within 30 minutes
B) Within 7 seconds
C) After the first conversation
D) After the test drive

**Q2:** What is the single biggest factor in converting internet leads to showroom visits?
A) Offering the lowest price
B) Response speed — contacting within 5 minutes
C) Sending a brochure
D) Multiple follow-up emails

**Q3:** What does the "R" in the AIR Method stand for?
A) Research
B) Respond
C) Request — ask for the appointment using alternative-choice language
D) Refund

**Q4:** How quickly should a customer be greeted when they walk into the showroom?
A) Within 5 minutes
B) Within 30 seconds
C) Whenever you're free
D) After they've looked around

**Q5:** When a customer arrives for their appointment, what should be ready?
A) The finance paperwork
B) The vehicle they inquired about, pulled up and prepared
C) A discount offer
D) Nothing special — it's just a visit

**Answers:**
1. B — First impressions form within 7 seconds and are difficult to change.
2. B — Response speed within 5 minutes dramatically increases conversion rates.
3. C — Request the appointment using alternative-choice: "2pm or 4pm?"
4. B — Greet within 30 seconds; waiting creates anxiety and negative impressions.
5. B — Pull up the vehicle they asked about — it shows preparation and respect for their time.`,
      },
      {
        id: "showroom-experience",
        title: "The Showroom Experience",
        description: "Create an environment that makes customers comfortable, confident, and ready to buy.",
        duration: "10 min",
        content: `## The Showroom Experience

The showroom isn't just where cars are displayed — it's where buying decisions are formed. A clean, organized, welcoming environment puts customers at ease and makes them more receptive to your sales process. Conversely, a cluttered, chaotic, or high-pressure atmosphere drives customers away before you ever get to talk numbers.

### The Environment Sells Before You Do

Customers make judgments about your dealership's trustworthiness based on what they see. A clean lot with well-organized inventory suggests a well-run business. A dirty customer lounge suggests corners are cut everywhere. These impressions operate below conscious awareness but powerfully influence buying behavior.

### Key Elements of a Winning Showroom

**Curb appeal starts at the entrance.** The first 50 feet of your lot — the landscaping, the signage, the cleanliness of the entrance — sets expectations. Keep it immaculate. Pressure-wash sidewalks monthly, replace faded signage, and ensure the entrance is well-lit even during daylight hours.

**Inventory presentation matters.** Vehicles should be parked in straight lines with consistent spacing. Windshields should be clean, tire shine applied, and pricing clearly displayed. A disorganized lot signals a disorganized business.

**The customer lounge is a profit center.** Comfortable seating, fresh coffee, cold water, clean restrooms, and free Wi-Fi keep customers on-site longer. The longer they stay, the more likely they are to buy. Consider adding phone charging stations, a kids' play area, and snacks.

**Control the sensory experience.** Background music should be subtle and professional (no talk radio or polarizing genres). Temperature should be comfortable. The smell should be clean — not overwhelming air freshener or stale coffee. Lighting should be bright but not harsh; natural light is best.

**Manage noise and distraction.** Sales conversations shouldn't be overheard by other customers. Create private consultation areas. Keep the sales floor calm — loud laughter, arguments, or phones ringing constantly create negative impressions.

### The Human Element

The physical environment is important, but the human environment matters more. Every staff member — from the receptionist to the service advisor to the detailer — should acknowledge customers with a smile. Train non-sales staff to say "Welcome to [Dealership Name]" when they pass a customer in the hallway.

### Multiple Choice Quiz

**Q1:** What is the most important goal of the customer lounge?
A) To display awards
B) To keep customers comfortable and on-site longer
C) To save money on utilities
D) To store extra inventory brochures

**Q2:** How should vehicles be arranged on the lot?
A) Randomly to create a treasure-hunt feel
B) In straight lines with consistent spacing and clean presentation
C) Grouped only by color
D) Wherever they fit

**Q3:** What type of background music is appropriate for a dealership showroom?
A) Talk radio
B) Heavy metal
C) Subtle, professional background music
D) No music at all

**Q4:** Why should non-sales staff acknowledge customers?
A) It's not necessary — only salespeople should talk to customers
B) Every interaction shapes the customer's perception of the dealership
C) It confuses customers
D) It's required by law

**Q5:** What is the "first 50 feet" rule?
A) Customers only look at cars within 50 feet of the entrance
B) The first 50 feet of your lot from the entrance sets customer expectations
C) Salespeople must stay within 50 feet of customers
D) Inventory must be rotated every 50 days

**Answers:**
1. B — A comfortable lounge keeps customers on-site longer, increasing purchase likelihood.
2. B — Organized, clean inventory presentation signals a well-run business.
3. C — Subtle, professional music creates a calm, upscale atmosphere.
4. B — Every staff interaction contributes to the customer's overall impression of your dealership.
5. B — The entrance zone (first 50 feet) sets the tone for the entire visit.`,
      },
      {
        id: "online-reviews",
        title: "Managing Online Reviews",
        description: "Build a 5-star online reputation that attracts and converts customers.",
        duration: "10 min",
        content: `## Managing Online Reviews

Online reviews are the new word of mouth. Before a customer ever visits your dealership, they've read your reviews on Google, Yelp, and DealerRater. A single star difference in your average rating can mean thousands of dollars in lost or gained revenue per month. This module shows you how to build, protect, and leverage your online reputation.

### Why Reviews Matter More Than Ever

Over 90% of consumers read online reviews before visiting a business. The average car buyer reads 10+ reviews before choosing a dealership. Your online reputation isn't just nice to have — it's the primary filter that determines whether customers even consider you. A 4.8-star dealership will consistently outsell a 3.9-star competitor, even if the lower-rated dealer has better prices.

### Generating Positive Reviews

**Ask at the peak moment.** The best time to request a review is right after delivery, when the customer is happiest with their new vehicle. Hand them a card with a QR code linking directly to your Google review page. "If you enjoyed your experience today, a quick review would mean the world to us — it helps other customers find the same great service."

**Make it stupidly easy.** Create a simple one-page URL that redirects to your Google review form. Print it on business cards. Text it to customers after delivery. Include it in follow-up emails. Every extra click reduces the likelihood they'll complete the review.

**Personalize the ask.** "Mr. Johnson, I really enjoyed helping you find the perfect truck today. If you have a moment, I'd be honored if you shared your experience online." People review for the person, not the dealership.

**Respond to the positive reviews.** When a customer leaves a 5-star review, respond within 24 hours thanking them by name. This shows the reviewer (and everyone reading) that you're engaged and appreciative.

### Handling Negative Reviews

Every dealership gets negative reviews. It's how you respond that matters.

**Respond within 24 hours, always.** A prompt response shows you're attentive. A delayed response (or no response) suggests you don't care.

**Acknowledge, don't argue.** Start with: "Thank you for your feedback. I'm sorry your experience didn't meet your expectations." Even if the customer is wrong, arguing publicly makes YOU look defensive. Take the conversation offline: "I'd like to understand more about what happened — could you call me directly at [number]?"

**Offer to make it right.** "We'd love the opportunity to earn back your trust." This shows future readers that you stand behind your service.

**Never get personal or emotional.** A calm, professional response to a hostile review makes the reviewer look unreasonable and you look like the grown-up in the room.

### Building a Review Culture

Make online reputation part of your dealership's DNA:
- Set review goals for each salesperson (e.g., 5 reviews per month)
- Celebrate 5-star reviews in team meetings
- Include review generation in compensation discussions
- Monitor review sites daily and assign response responsibility

### Multiple Choice Quiz

**Q1:** What percentage of consumers read online reviews before visiting a business?
A) About 30%
B) About 50%
C) Over 90%
D) Less than 25%

**Q2:** When is the best time to ask a customer for a review?
A) During the test drive
B) At vehicle delivery, when excitement is highest
C) Six months later
D) During price negotiation

**Q3:** How quickly should you respond to a negative review?
A) Within a week
B) Within 24 hours
C) Whenever convenient
D) Never — it's better to ignore them

**Q4:** What is the best way to handle a negative review publicly?
A) Argue with the customer to prove you're right
B) Delete it
C) Acknowledge their experience, apologize, and take the conversation offline
D) Post a competing positive review

**Q5:** What's the most effective way to make it easy for customers to leave reviews?
A) Send them a lengthy email with instructions
B) Hand them a card with a QR code linking directly to your review page
C) Ask them to Google your dealership
D) Wait for them to figure it out

**Answers:**
1. C — Over 90% of consumers read online reviews before visiting a business.
2. B — The excitement of delivery is the peak moment to request a review.
3. B — Respond within 24 hours to show you're attentive and care about feedback.
4. C — Acknowledge, apologize, and move the conversation offline to resolve privately.
5. B — QR codes eliminate friction — one scan takes them directly to the review form.`,
      },
      {
        id: "delivery-experience",
        title: "The Delivery Experience",
        description: "Make the final delivery memorable and exciting — the start of a lifelong customer relationship.",
        duration: "10 min",
        content: `## The Delivery Experience

Vehicle delivery is the most important moment in the customer lifecycle. It's the culmination of everything — the research, the test drives, the negotiation, the paperwork. Done right, delivery creates a customer for life who refers friends and returns for service and future purchases. Done poorly, it creates buyer's remorse that poisons the relationship before it starts.

### Why Delivery Defines the Relationship

The average customer spends 3-5 hours in your dealership to purchase a vehicle. The last 30 minutes — delivery — is what they'll remember most. Psychologists call this the "peak-end rule": people judge experiences primarily by how they felt at the peak and at the end. Make the ending spectacular.

### The Perfect Delivery Checklist

**Before the customer arrives:**
- Vehicle is detailed inside and out — spotless, gleaming, showroom-quality
- Full tank of gas (this small gesture generates disproportionate goodwill)
- All protective plastic removed from seats, screens, and trim
- Climate control set to comfortable temperature
- Phone paired with Bluetooth if you have their information
- All paperwork organized and ready for signature

**The delivery walkthrough (15-20 minutes):**
- Start with a celebration: "Congratulations! This is the exciting part."
- Walk around the exterior, pointing out key features
- Sit in the driver's seat together and go through every control:
  - Phone pairing and infotainment setup
  - Climate control and seat adjustments
  - Safety features and driver assistance settings
  - Key maintenance reminders (oil change schedule, tire pressure monitoring)
- Take a photo of the customer with their new vehicle (with permission)
- Give them your cell phone number: "If you have ANY questions tonight or tomorrow, call me directly."

**After they drive away:**
- Send a follow-up text within 2 hours: "Hope you're loving the new vehicle! Call me anytime."
- Call on Day 3 to check in — ask if they have any questions about features
- Send a handwritten thank-you note within the first week

### The Delivery Presentation

Presentation matters. Some top dealers:
- Put a giant bow on the vehicle
- Have the entire sales team sign a congratulations card
- Include a small gift (branded keychain, car care kit, gas gift card)
- Use a dedicated "delivery bay" with good lighting for photos
- Play upbeat music during the walkthrough

### Avoiding Common Delivery Mistakes

**Rushing.** The customer just spent tens of thousands of dollars. Don't rush through delivery because you have another customer waiting. They deserve your full attention.

**Skipping features.** "You'll figure it out" is NOT acceptable. Walk through everything — especially safety tech. Confused customers become unhappy customers.

**Forgetting the follow-up.** Delivery isn't the end — it's the beginning of the ownership experience. The 3-day call and the 30-day check-in are non-negotiable.

### Multiple Choice Quiz

**Q1:** According to the "peak-end rule," what determines how customers remember an experience?
A) The entire experience equally
B) How they felt at the peak and at the end
C) Only the price they paid
D) The first 5 minutes

**Q2:** How soon should you send a follow-up after the customer drives away?
A) Within 2 hours
B) Within a week
C) Within a month
D) No follow-up needed

**Q3:** What should the vehicle's condition be at delivery?
A) "As-is" from the lot
B) Detailed, spotless, full tank of gas, all plastic removed
C) Washed but not detailed
D) Whatever condition the customer accepts

**Q4:** What is the most common delivery mistake?
A) Taking too long
B) Rushing through the delivery because of other customers
C) Offering too many free accessories
D) Playing music

**Q5:** Why should you give the customer your cell phone number at delivery?
A) It's required by dealership policy
B) Direct access builds trust and shows you're invested in their satisfaction
C) So they can call you about future purchases only
D) To upsell them on accessories

**Answers:**
1. B — The peak-end rule: people judge experiences by the peak and the ending.
2. A — A text within 2 hours shows genuine care and opens a direct communication channel.
3. B — The vehicle should be immaculate — it's a major purchase and delivery sets the tone.
4. B — Rushing through delivery to help another customer devalues the current customer's experience.
5. B — Direct access builds lasting trust and shows you stand behind your work.`,
      },
    ],
  },
// ===== Course 6: Sales Drills (expanded with 5 MCQs per lesson) =====
  {
    id: "sales-drills",
    title: "5-Minute Sales Drills",
    subtitle: "Quick, focused modules for every step of the sale",
    description:
      "Bite-sized 5-minute training modules covering each step of the automotive sales process. Each module includes detailed strategy breakdowns and 5 multiple-choice quiz questions to sharpen your skills. Perfect for daily practice.",
    levels: "Beginner",
    duration: "2 hours",
    lessons: 10,
    image: "drills",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    lessonsList: [
      {
        id: "drill-greeting",
        title: "Step 1: Meet & Greet",
        description: "Master the 10-second first impression that sets the tone.",
        duration: "5 min",
        content: `## Step 1: Meet & Greet — 2 Minute Drill

**Goal:** Master the 10-second first impression that sets the tone for the entire sale. The greeting is the single most important moment in the customer interaction — it determines whether the customer trusts you, likes you, and wants to buy from you.

### Why the Greeting Matters

Research shows customers decide within 7-10 seconds whether they trust a salesperson. A weak greeting — "Can I help you?" — triggers the automatic "just looking" response. A strong, genuine greeting creates immediate rapport and keeps the customer open to your guidance.

### The 10-Second Formula
1. **Smile genuinely** — a real smile reaches your eyes
2. **Make eye contact** — not a stare, but confident and warm
3. **Introduce yourself by name** — "Hi, I'm [Name], welcome to [Dealership]"
4. **Use their name** — if you know it from an appointment or lead
5. **Give them a reason to engage** — "What brings you in today?" or "Great day to look at cars!"

### Common Mistakes to Avoid
- Approaching too aggressively (crowding their space)
- Asking "Can I help you?" (triggers automatic rejection)
- Ignoring a customer who's already on the lot
- Using a scripted, robotic greeting

### Multiple Choice Quiz

**Q1:** A customer walks in and heads straight to a vehicle. You should:
A) Let them browse alone for 10 minutes
B) Walk up and ask "Can I help you?"
C) Greet them warmly within 30 seconds, introduce yourself, then give them space
D) Follow them silently

**Q2:** How quickly do customers form a trust judgment about a salesperson?
A) Within 5-10 minutes
B) Within 7-10 seconds
C) After the test drive
D) During price negotiation

**Q3:** What is the most effective opening line when greeting a new customer?
A) "Can I help you?"
B) "Are you looking to buy today?"
C) "Hi, I'm [Name], welcome to [Dealership]! What brings you in?"
D) "We have great deals today!"

**Q4:** What should you do if you don't know the customer's name?
A) Don't address them by name
B) Ask "What's your name?" immediately
C) Introduce yourself first, then naturally ask for their name
D) Call them "buddy" or "friend"

**Q5:** Why is "Can I help you?" a weak greeting?
A) It's too formal
B) It triggers the automatic "just looking" defense response
C) It takes too long to say
D) Customers prefer to be ignored initially

**Answers:**
1. C — Acknowledge warmly, introduce yourself, then respect their space.
2. B — Trust judgments form within 7-10 seconds and are hard to change.
3. C — Personal introduction with an open-ended question builds immediate rapport.
4. C — Introduce yourself first, then naturally ask — it's a conversation, not an interrogation.
5. B — "Can I help you?" triggers the automatic "just looking" shield; use an open-ended greeting instead.`,
      },
      {
        id: "drill-qualification",
        title: "Step 2: Qualification",
        description: "Uncover the customer's true needs in 2 minutes.",
        duration: "5 min",
        content: `## Step 2: Qualification — 2 Minute Drill

**Goal:** Uncover the customer's true needs, budget range, and decision timeline in the first 2 minutes of conversation. Qualification is the foundation of every successful sale — skip it and you're guessing.

### Why Qualification Is Critical

Top salespeople spend 70% of their time listening and 30% talking during qualification. The opposite ratio guarantees you'll present the wrong vehicle, discuss irrelevant features, and lose the customer's trust. Qualification isn't interrogation — it's a collaborative discovery process.

### The 4 Key Questions
1. **"What brings you in today?"** — Open-ended, non-threatening, reveals motivation
2. **"What's most important to you in your next vehicle?"** — Priorities: safety, fuel economy, space, tech, style
3. **"How will you primarily use this vehicle?"** — Commuting, family, work, adventure
4. **"What's your timeline for making a decision?"** — Today, this week, this month

### Reading Between the Lines
Customers often don't say what they really mean. "I want good gas mileage" might mean "My last car cost me $400/month in fuel." "I need space" might mean "We're expecting a third child." Ask follow-up questions: "Tell me more about that."

### Multiple Choice Quiz

**Q1:** A customer says "I'm just looking." You should:
A) Walk away and wait for them to approach you
B) Say "Great! What kind of vehicles catch your eye?"
C) Hand them a brochure and leave them alone
D) Tell them to find you when they're ready

**Q2:** What is the ideal listen-to-talk ratio during qualification?
A) 50% listening, 50% talking
B) 70% listening, 30% talking
C) 30% listening, 70% talking
D) 90% listening, 10% talking

**Q3:** A customer wants a vehicle for a growing family. You should focus on:
A) Horsepower and 0-60 time
B) Safety ratings, cargo space, and rear-seat comfort
C) The cheapest model on the lot
D) Two-door sports coupes

**Q4:** When a customer says "I need good gas mileage," what should you do?
A) Immediately show them a hybrid
B) Ask "Tell me more — what kind of driving do you do?"
C) Assume they want the smallest car
D) Tell them all cars get decent mileage now

**Q5:** What is the most important qualification question that many salespeople skip?
A) "What color do you want?"
B) "What's your timeline for making a decision?"
C) "Do you have a trade-in?"
D) "How did you hear about us?"

**Answers:**
1. B — Redirect "just looking" into an engaging question about their interests.
2. B — 70/30 listening-to-talking ratio uncovers needs without dominating the conversation.
3. B — Match vehicle features to the customer's life stage and stated priorities.
4. B — Follow up to understand the real context behind their stated need.
5. B — Timeline reveals urgency and helps prioritize your sales approach.`,
      },
      {
        id: "drill-presentation",
        title: "Step 3: Vehicle Presentation",
        description: "Connect features to customer needs with the FAB method.",
        duration: "5 min",
        content: `## Step 3: Vehicle Presentation — 2 Minute Drill

**Goal:** Present the vehicle in a way that connects features directly to the customer's needs. A great presentation makes the customer mentally own the vehicle before they ever drive it.

### The FAB Method
Every feature you mention should follow the **Feature → Advantage → Benefit** chain:
- **Feature:** "This vehicle has adaptive cruise control"
- **Advantage:** "It automatically maintains a safe distance from the car ahead"
- **Benefit:** "So on your daily commute, you'll arrive less stressed and more relaxed"

Without the benefit, a feature is just a fact. With the benefit, it becomes a reason to buy.

### The Walkaround Sequence
1. Start from the front — grille, headlights, overall stance
2. Move to the driver's side — keyless entry, mirrors, visibility
3. Open the driver's door — seat comfort, steering wheel, dashboard layout
4. Move to the rear — cargo space, folding seats, trunk organization
5. Engine compartment (if relevant) — fuel economy, maintenance access

### Tailoring to the Customer
If they care about safety, lead with safety features. If they care about tech, lead with the infotainment system. Don't recite a memorized script — have a conversation about what matters to them.

### Multiple Choice Quiz

**Q1:** During a vehicle presentation, you should:
A) Recite every feature from the brochure
B) Focus only on the price
C) Connect features to the customer's stated needs using the FAB method
D) Let the customer figure out features on their own

**Q2:** What does FAB stand for?
A) Fast, Affordable, Beautiful
B) Feature, Advantage, Benefit
C) Find, Ask, Buy
D) Finance, Appraise, Bargain

**Q3:** Where should you start a vehicle walkaround?
A) The trunk
B) Under the hood
C) From the front, working around the driver's side
D) Inside the vehicle

**Q4:** A customer says safety is their #1 priority. Which feature should you lead with?
A) Premium sound system
B) Heated seats
C) Advanced safety suite and crash test ratings
D) Wheel size

**Q5:** What makes a feature presentation compelling?
A) Listing specifications from memory
B) Connecting the feature to a tangible benefit in the customer's daily life
C) Talking as fast as possible
D) Using technical jargon to sound knowledgeable

**Answers:**
1. C — Connect features to the customer's specific needs — relevance drives desire.
2. B — Feature → Advantage → Benefit: the proven formula for impactful presentations.
3. C — Start from the front, move naturally around the driver's side, end inside.
4. C — Lead with what matters most to that specific customer.
5. B — Benefits make features personal and emotionally compelling.`,
      },
      {
        id: "drill-test-drive",
        title: "Step 4: Test Drive",
        description: "Guide the test drive that builds emotional ownership.",
        duration: "5 min",
        content: `## Step 4: Test Drive — 2 Minute Drill

**Goal:** Guide the customer through a test drive that builds emotional connection and confirms the vehicle is right for them. The test drive is the single most influential moment in the buying decision.

### Why Test Drives Close Deals

Studies show that customers who take a test drive are over 70% more likely to purchase. The physical experience of driving — the smell, the feel, the sound — creates emotional ownership that no brochure can match. Your job is to facilitate that experience, not distract from it.

### The Test Drive Protocol
1. **Set the route beforehand** — mix of city streets and highway for varied experience
2. **Drive first (2-3 minutes)** — demonstrate key features while they observe
3. **Switch and let them drive (10-15 minutes)** — minimize your talking; let them experience
4. **Ask strategic questions** — "How does the visibility feel?" "Notice how quiet the cabin is?"
5. **Return and debrief** — "On a scale of 1-10, how well does this fit what you're looking for?"

### What NOT to Do
- Talk constantly during their driving time
- Play loud music or have the radio on
- Take calls or check your phone
- Rush the experience
- Skip the debrief conversation

### Multiple Choice Quiz

**Q1:** During a test drive, you should:
A) Talk constantly about vehicle features
B) Let the customer experience the vehicle with minimal interruption
C) Play the radio to demonstrate the sound system
D) Route only through slow neighborhood streets

**Q2:** Approximately how much more likely is a customer to buy after a test drive?
A) 10% more likely
B) 25% more likely
C) Over 70% more likely
D) It makes no difference

**Q3:** What is the best question to ask during the test drive?
A) "Are you ready to buy?"
B) "How does the visibility and driving position feel to you?"
C) "What monthly payment can you afford?"
D) "Do you want to see another color?"

**Q4:** Who should drive first during a test drive?
A) The customer immediately
B) The salesperson, for 2-3 minutes to demonstrate key features
C) No one — just sit in the vehicle
D) A manager

**Q5:** What should you do immediately after returning from the test drive?
A) Go straight to price negotiation
B) Ask the customer to rate the vehicle on a 1-10 scale and discuss their feedback
C) Show them another vehicle
D) Leave them alone to think

**Answers:**
1. B — Let them experience the vehicle; your job is to facilitate, not dominate.
2. C — Test drives increase purchase likelihood by over 70%.
3. B — Strategic, experience-focused questions deepen emotional connection.
4. B — Demonstrate first, then hand over control for the majority of the drive.
5. B — The post-drive debrief surfaces concerns and builds momentum toward closing.`,
      },
      {
        id: "drill-trade-in",
        title: "Step 5: Trade-In Appraisal",
        description: "Handle trade-in discussions transparently and professionally.",
        duration: "5 min",
        content: `## Step 5: Trade-In Appraisal — 2 Minute Drill

**Goal:** Handle the trade-in conversation transparently and professionally, turning a potential conflict point into a trust-building moment. Trade-in discussions are where many deals fall apart — but they don't have to.

### Why Trade-Ins Are Sensitive

Customers are emotionally attached to their current vehicle. They've researched its value online and often have unrealistic expectations. If you dismiss their number or lowball them, you lose trust immediately. If you overpay, you lose profit. The key is transparency and education.

### The Trade-In Conversation Protocol
1. **Ask about their vehicle early** — "Tell me about your current car. What have you loved about it? Anything you're ready to upgrade from?"
2. **Do a thorough walkaround together** — Point out both positives and any concerns honestly
3. **Explain how appraisals work** — "We use market data from recent sales and auction values to determine a fair number"
4. **Present the offer with context** — "Based on current market conditions, here's what we can offer. Here's how we arrived at that number"
5. **Separate trade-in from new car negotiation** — The trade-in value is one number; the new car price is another

### Common Mistakes
- Making an offer without inspecting the vehicle
- Criticizing the customer's car ("This thing is beat up")
- Pressuring them to accept immediately
- Using trade-in as the only negotiation lever

### Multiple Choice Quiz

**Q1:** When should you ask about a trade-in?
A) At the very end of the sales process
B) During initial qualification, naturally and early
C) Never — let the customer bring it up
D) Only after they've agreed to buy

**Q2:** How should you present the trade-in offer?
A) "Here's what we'll give you, take it or leave it"
B) With market data and a clear explanation of how you arrived at the number
C) As low as possible to maximize profit
D) Without inspecting the vehicle first

**Q3:** What is the biggest mistake in trade-in conversations?
A) Being transparent
B) Criticizing or disrespecting the customer's current vehicle
C) Offering fair market value
D) Explaining your appraisal methodology

**Q4:** How should the trade-in discussion relate to the new car negotiation?
A) Bundle everything together
B) Keep them separate — trade-in value is one number, new car price is another
C) Always negotiate trade-in first
D) Never discuss trade-in at all

**Q5:** Why do customers often have unrealistic trade-in expectations?
A) They're trying to trick you
B) They've researched online but may not understand condition adjustments and market variations
C) They don't care about their car's value
D) Dealers always overpay

**Answers:**
1. B — Ask naturally during qualification; it's part of understanding their situation.
2. B — Transparency with market data builds trust even if the number isn't what they hoped.
3. B — Never disrespect the customer's vehicle; it feels personal.
4. B — Keep trade-in and new car as separate discussions to maintain clarity.
5. B — Online research gives ballpark figures; condition and local market create variance.`,
      },
      {
        id: "drill-price",
        title: "Step 6: Price Presentation",
        description: "Present pricing that builds value and protects gross.",
        duration: "5 min",
        content: `## Step 6: Price Presentation — 2 Minute Drill

**Goal:** Present pricing in a way that builds value, protects gross profit, and keeps the customer engaged rather than defensive. How you present the numbers is often more important than the numbers themselves.

### The Psychology of Price Presentation

Studies show that customers don't evaluate prices in isolation — they evaluate them relative to perceived value. A $35,000 vehicle feels expensive if value hasn't been established. The same vehicle feels like a bargain after a thorough walkaround, an exciting test drive, and clear connection to the customer's needs. Price is only painful in the absence of value.

### The Price Presentation Sequence
1. **Recap the value first** — "We've confirmed this vehicle has the safety features you wanted, the cargo space for your family, and the fuel economy you were hoping for"
2. **Present from top down** — Start with MSRP, then show savings: incentives, rebates, dealer discounts
3. **Use visual aids** — A printed worksheet or screen share builds credibility
4. **Pause after presenting** — Let them process; don't fill the silence with concessions
5. **Ask for their reaction** — "How does this compare to what you were expecting?"

### Handling Price Objections
- **"That's more than I expected"** → "What number were you expecting? Let me see if I can explain the difference"
- **"I saw it cheaper online"** → "Can you show me? There may be differences in fees, incentives, or trim level"
- **"I need to think about it"** → "What specifically would you like to think about? Maybe I can help clarify"

### Multiple Choice Quiz

**Q1:** Most customers care most about:
A) The absolute lowest price
B) Fair value and transparent pricing
C) Only the monthly payment
D) Beating the dealer

**Q2:** When presenting price, you should:
A) Start with the monthly payment only
B) Start from MSRP and work down, showing all savings
C) Give the lowest price immediately
D) Avoid talking about price altogether

**Q3:** What should you do immediately after presenting the price?
A) Offer a discount
B) Pause and let the customer process
C) Ask if they want to buy
D) Suggest another vehicle

**Q4:** A customer says "That's more than I expected." Best response:
A) "What number were you expecting? Let me help explain the difference"
B) "That's the price, take it or leave it"
C) Immediately offer $2,000 off
D) Walk away from the deal

**Q5:** What makes price feel acceptable to a customer?
A) It's the lowest in the market
B) Perceived value has been established before the number appears
C) The salesperson is aggressive
D) There are no fees

**Answers:**
1. B — Customers want fair, transparent pricing — not necessarily the cheapest.
2. B — Present MSRP first, then show savings; this creates a sense of getting a deal.
3. B — Silence after the price gives the customer space to process without pressure.
4. A — Understand their expectation gap before adjusting; it may be an information issue.
5. B — Price feels right when value has been clearly established first.`,
      },
      {
        id: "drill-closing",
        title: "Step 7: Closing",
        description: "Guide customers to a confident yes.",
        duration: "5 min",
        content: `## Step 7: Closing — 2 Minute Drill

**Goal:** Guide the customer to a confident "yes" using proven closing techniques that feel natural, not pressured. The close isn't a battle — it's the logical conclusion of a well-run sales process.

### The Close Starts at Hello

The most common closing mistake is waiting until the end to "close." In reality, closing begins with the greeting. Every step — qualification, presentation, test drive, price discussion — is a micro-close that builds toward the final commitment. If you've done everything right, the close is simply asking for the business.

### 5 Proven Closing Techniques

**1. The Assumptive Close:** Act as if the decision is made and move to logistics. "Would you prefer to take delivery Friday or Saturday?" This works when the customer has shown strong buying signals.

**2. The Alternative Choice Close:** Offer two positive options. "Would the 60-month or 72-month financing work better for your budget?" This avoids the yes/no trap.

**3. The Summary Close:** Recap everything they love about the vehicle. "So we've got the safety rating you wanted, the fuel economy, the color you love, and payments in your range. Are you ready to take it home?"

**4. The Temperature Check:** "On a scale of 1-10, where are you on this vehicle?" If they say 7, ask: "What would move it to a 10?"

**5. The Direct Close:** Simply ask. "Would you like to buy this vehicle today?" Sometimes straightforward is best.

### Reading Buying Signals
- Customer asks about financing or payments
- Customer talks about the vehicle using "my" or "mine"
- Customer asks about delivery timing
- Customer stops looking at other vehicles
- Customer's body language relaxes and they smile more

### Multiple Choice Quiz

**Q1:** Customer says "I need to think about it." Best response:
A) "OK, take your time"
B) "I understand. What specifically would you like to think about — maybe I can help?"
C) "You don't need to think — just buy it"
D) Walk away
**(Correct: B)**

**Q2:** The assumptive close works best when:
A) You just met the customer
B) The customer has shown clear buying signals throughout the process
C) The customer seems angry
D) The price hasn't been discussed

**Q3:** Which is a buying signal?
A) Customer checks their phone constantly
B) Customer asks about delivery timing and available colors
C) Customer says they're just looking
D) Customer walks toward the exit

**Q4:** What is the "Temperature Check" close?
A) Asking if the showroom is too cold
B) "On a scale of 1-10, where are you on this vehicle?"
C) Taking the customer's temperature literally
D) Closing the deal immediately regardless of objections

**Q5:** When does the close actually begin?
A) After the test drive
B) After presenting the price
C) At the greeting — every step builds toward the close
D) Only when the customer says they're ready

**Answers:**
1. B — Isolate what they need to think about; vague objections hide specific concerns.
2. B — The assumptive close works when buying signals have been building throughout.
3. B — Questions about logistics signal mental ownership and purchase intent.
4. B — A 1-10 scale surfaces real concerns without confrontation.
5. C — The close is a process that runs through the entire sale, not a one-time event.`,
      },
      {
        id: "drill-fni",
        title: "Step 8: F&I Introduction",
        description: "Transition customers to F&I smoothly.",
        duration: "5 min",
        content: `## Step 8: F&I Introduction — 2 Minute Drill

**Goal:** Smoothly transition the customer to the Finance & Insurance office in a way that maximizes product penetration while maintaining trust. The F&I handoff is where additional profit lives — but only if done right.

### The F&I Handoff Formula

The worst F&I introduction: "OK, now you need to go see our finance guy." This makes F&I sound like a punishment. The best introduction: a warm, confident transition that positions F&I as a valuable service.

### How to Introduce F&I
1. **Set expectations early** — During the sale, mention: "Our finance team will go over some great protection options for your new vehicle"
2. **Make a warm physical handoff** — Walk the customer to the F&I office; don't just point
3. **Brief the F&I manager** — Share what matters to this customer so F&I can tailor recommendations
4. **Stay positive** — "Maria in finance is fantastic — she'll take great care of you and make sure all the paperwork is smooth"
5. **Don't disappear** — Let the customer know you'll check in after

### Common F&I Products to Position Positively
- Extended service contracts → "Peace of mind for the long haul"
- GAP insurance → "Protection if the unexpected happens"
- Tire & wheel protection → "Our roads aren't getting any better"
- Prepaid maintenance → "Lock in today's prices for future service"

### Multiple Choice Quiz

**Q1:** The best way to introduce F&I is:
A) "Now you have to go see the finance guy"
B) A warm, confident transition positioning F&I as a valuable service
C) Don't mention F&I at all — let them discover it
D) Tell them it's optional and they can skip it

**Q2:** When should you first mention F&I?
A) Only when walking to the F&I office
B) Early in the sales process, setting positive expectations
C) Never — it's the F&I manager's job
D) After they've signed all paperwork

**Q3:** What should you do during the F&I handoff?
A) Point toward the office and leave
B) Walk the customer there, brief the F&I manager on customer priorities, and stay positive
C) Let the customer find their own way
D) Handle the F&I presentation yourself

**Q4:** How should extended service contracts be positioned?
A) "This will cost you extra"
B) "Peace of mind for the long haul — let me show you how it protects your investment"
C) "You probably don't need this"
D) Don't mention them

**Q5:** What should you tell the customer after the F&I handoff?
A) Nothing — your job is done
B) "I'll check in with you after you're done with Maria"
C) "Good luck in there"
D) "Hope they don't keep you too long"

**Answers:**
1. B — A warm, confident transition turns F&I from an obstacle into a service.
2. B — Plant positive seeds early so F&I feels like a natural next step, not a surprise.
3. B — Personal handoff with briefing ensures continuity and customer comfort.
4. B — Frame products around protection and peace of mind, not cost.
5. B — Let them know you're still with them; don't abandon the customer post-handoff.`,
      },
      {
        id: "drill-delivery",
        title: "Step 9: Delivery",
        description: "Create a memorable delivery experience.",
        duration: "5 min",
        content: `## Step 9: Delivery — 2 Minute Drill

**Goal:** Create a memorable delivery experience that turns a customer into a loyal advocate. Delivery isn't the end of the sale — it's the beginning of the customer relationship.

### Why Delivery Is the Most Important Step

The "peak-end rule" in psychology states that people judge experiences primarily by their emotional peak and how they end. Your customer may have spent 3 hours at the dealership, but they'll remember the last 20 minutes most vividly. A rushed, impersonal delivery poisons the entire experience. A celebratory, thorough delivery creates a customer for life.

### The Perfect Delivery Checklist
- Vehicle detailed inside and out with a full tank of gas
- All plastic removed; climate control set comfortably
- Phone paired with Bluetooth (if customer agrees)
- A planned 15-20 minute walkthrough of key features
- A celebration moment — photo with the vehicle, congratulations card
- Your personal cell number: "Call me with ANY questions"
- A clear outline of next steps: "I'll call in 3 days to check in"

### The Psychology of Ownership
The moment a customer drives away, doubts can creep in — "Did I pay too much? Should I have gotten the other color?" This is buyer's remorse, and it's normal. Combat it by over-delivering on the experience and staying connected in the first week. A 3-day check-in call prevents that doubt from hardening into regret.

### Multiple Choice Quiz

**Q1:** According to the peak-end rule, what will the customer remember most?
A) The entire experience equally
B) The emotional peak and how the experience ended
C) The price negotiation
D) The test drive only

**Q2:** What is the most important follow-up after delivery?
A) A thank-you email
B) A personal call within 3 days to check in and answer questions
C) No follow-up needed — the sale is done
D) A survey request

**Q3:** What should you do to prevent buyer's remorse?
A) Nothing — it's inevitable
B) Over-deliver on the delivery experience and check in within 3 days
C) Offer a discount after delivery
D) Avoid talking to the customer after they leave

**Q4:** What should the vehicle look like at delivery?
A) As-is from the lot with a quick wash
B) Detailed, clean, full tank of gas, all protective materials removed
C) It doesn't matter — they already bought it
D) Parked wherever there's space

**Q5:** What should you give the customer at delivery besides the keys?
A) Nothing else needed
B) Your personal cell phone number and a commitment to help with any questions
C) A list of things they did wrong in negotiation
D) Another sales pitch for accessories

**Answers:**
1. B — The peak-end rule: customers judge experiences by peaks and endings.
2. B — A personal check-in within 3 days prevents remorse and builds long-term loyalty.
3. B — An exceptional delivery experience plus proactive follow-up prevents doubt.
4. B — The vehicle should be immaculate — it's still a major emotional purchase.
5. B — Personal accessibility shows you stand behind your work and care about satisfaction.`,
      },
      {
        id: "drill-follow-up",
        title: "Step 10: Follow-Up",
        description: "Build systematic follow-up for repeat business and referrals.",
        duration: "5 min",
        content: `## Step 10: Follow-Up — 2 Minute Drill

**Goal:** Build a systematic follow-up process that generates repeat business, referrals, and long-term customer loyalty. The sale doesn't end at delivery — it begins there.

### Why Follow-Up Is Where Champions Are Made

The average car buyer replaces their vehicle every 5-7 years. They'll need service 2-3 times per year. They know dozens of people who will buy cars during that time. Every customer represents not one sale, but a lifetime of potential revenue — IF you stay in touch. Salespeople who master follow-up routinely double their income through repeat and referral business alone.

### The Follow-Up Cadence
- **Day 1 (evening of delivery):** Text — "How's the new car? Call me if you have any questions!"
- **Day 3:** Phone call — "Just checking in. Any features you want me to walk through again?"
- **Day 7:** Handwritten thank-you card mailed to their home
- **Day 30:** Phone call — "How's the first month been? Any service needs?"
- **Month 3:** Email with relevant content — maintenance tips, seasonal advice
- **Month 6:** Personal check-in — "Still loving the car? Let me know if anything changes."
- **Annually:** Birthday or purchase anniversary card

### Referral Generation in Follow-Up
Every follow-up touch is an opportunity for referrals. "By the way, if any friends or family are in the market, I'd love to give them the same experience you had." Make it easy: give them extra business cards at delivery. Create a simple referral rewards program.

### CRM Discipline
Use your CRM religiously. Set reminders. Log every interaction. A follow-up system only works if it's systematic — winging it means missed opportunities.

### Multiple Choice Quiz

**Q1:** The most important follow-up is:
A) The thank-you email
B) The 3-day check-in phone call
C) The annual birthday card
D) The 6-month check-in

**Q2:** How many follow-up touches should you plan in the first month?
A) One
B) At least three — Day 1 text, Day 3 call, Day 7 card
C) None — give them space
D) Only if there's a problem

**Q3:** When is the best time to plant the seed for referrals?
A) During the first follow-up call
B) Never — it's pushy
C) Only when the customer asks
D) At delivery and throughout the follow-up cadence

**Q4:** Why is CRM discipline critical for follow-up?
A) It's not — you can remember everything
B) Systematic reminders and logging prevent missed opportunities
C) Only managers need CRMs
D) Paper notes work better

**Q5:** What is the lifetime value of a well-managed customer relationship?
A) One vehicle sale
B) One sale plus a few service visits
C) Multiple vehicle purchases, years of service revenue, and dozens of referrals
D) Just the first service visit

**Answers:**
1. B — The 3-day call prevents early buyer's remorse and opens ongoing communication.
2. B — At least three touches in month one keeps you top of mind without being intrusive.
3. D — Referral conversations are natural throughout the relationship, not a one-time ask.
4. B — CRM systems turn good intentions into reliable execution.
5. C — A lifetime customer is worth far more than a single transaction.`,
      },
    ],
  },
// ===== Course 7: Senior Sales Training (Plus+ required) =====
  {
    id: "senior-sales",
    title: "Senior Sales Training",
    subtitle: "Advanced techniques for experienced sales professionals",
    description:
      "Take your sales skills to the next level with advanced negotiation tactics, enterprise deal strategies, team leadership principles, and complex deal structuring. Designed for experienced salespeople who want to become top performers and team leaders. PLUS subscription required.",
    levels: "Advanced",
    duration: "3 hours",
    lessons: 5,
    image: "advanced",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    lessonsList: [
      {
        id: "senior-negotiation",
        title: "Advanced Negotiation Tactics",
        description: "Master psychological negotiation techniques used by top performers.",
        duration: "35 min",
        content: `## Advanced Negotiation Tactics

**Goal:** Move beyond price negotiation to value-based deal structuring.

### The Psychology of Negotiation

Top negotiators understand that price is rarely the real objection. The real negotiation is about perceived value, trust, and timing. Advanced negotiation isn't about winning — it's about creating a solution where both parties feel they've won.

### The Anchoring Effect

The first number put on the table sets the anchor for the entire negotiation. Use this strategically: present the MSRP first, then present your discounted offer. The contrast makes your offer feel more valuable.

### The Reciprocity Principle

When you give something first (a concession, extra service, or time), the customer feels psychological pressure to reciprocate. Use this ethically — offer genuine value first.

### Quick Quiz

**Q1:** The "anchoring effect" in negotiation refers to:
A) Keeping the customer anchored to one vehicle
B) The first number mentioned setting the reference point for all subsequent offers
C) Physically anchoring the customer in the showroom
D) Using boat analogies to sell cars
**(Correct: B)**

**Q2:** When a customer says "Your price is too high," the best advanced response is:
A) Immediately lower the price
B) Ask "Compared to what?" and explore the basis of their comparison
C) Walk away from the deal
D) Tell them they're wrong
**(Correct: B)**

**Q3:** The reciprocity principle suggests you should:
A) Never give anything for free
B) Offer genuine value or a concession before asking for commitment
C) Always ask for the sale first
D) Reciprocate anger with anger
**(Correct: B)**

**Q4:** A customer wants $2,000 off a vehicle. The best advanced response is:
A) "Let me ask my manager"
B) "If I could get you $1,000 off and include [valued add-on], would that work for you?"
C) "That's impossible"
D) "OK, done"
**(Correct: B)**
**Q5:** A customer wants a specific number below your dealership minimum. Best response:
A) "No, we can't do that"
B) "Let me show you exactly how we arrived at our number and see if we can find creative ways to close the gap"
C) Walk away from the deal
D) Accept the loss to make the sale
**(Correct: B)**
`,
      },
      {
        id: "senior-enterprise",
        title: "Enterprise & Fleet Deals",
        description: "Structure multi-vehicle deals for business and fleet customers.",
        duration: "35 min",
        content: `## Enterprise & Fleet Deals

**Goal:** Understand how to identify, approach, and close multi-vehicle enterprise deals.

### Identifying Fleet Opportunities

Look for customers who mention business use, company vehicles, or multiple drivers. A single conversation about one vehicle can unlock a 5-10 vehicle opportunity if you ask the right follow-up questions.

### The Decision-Making Unit

Unlike individual buyers, enterprise deals involve multiple decision-makers: the owner/finance director, the fleet manager, and the end users/employees. You need to address each stakeholder's concerns.

### Quick Quiz

**Q1:** The first sign of a fleet opportunity is often:
A) The customer wearing a suit
B) The customer mentioning business use or multiple vehicles
C) The customer paying cash
D) The customer arriving in a luxury vehicle
**(Correct: B)**

**Q2:** When presenting to a business decision-maker, focus on:
A) Vehicle color and styling
B) Total cost of ownership, tax benefits, and reliability metrics
C) How fast the vehicle can go
D) Entertainment features
**(Correct: B)**

**Q3:** The biggest mistake in enterprise sales is:
A) Bringing brochures
B) Only talking to one decision-maker when multiple people influence the purchase
C) Following up too often
D) Offering fleet pricing
**(Correct: B)**

**Q4:** A business customer asks about 3 identical trucks. You should:
A) Quote three individually
B) Ask about their business needs, usage patterns, and offer a fleet consultation
C) Say you don't do fleet sales
D) Give them the same price as a single vehicle
**(Correct: B)**
**Q5:** A fleet customer mentions they're also considering a competitor. You should:
A) Badmouth the competitor
B) Acknowledge the competition respectfully and differentiate on value and service, not price alone
C) Offer an immediate discount
D) Ignore the mention
**(Correct: B)**
`,
      },
      {
        id: "senior-leadership",
        title: "Sales Team Leadership",
        description: "Lead, motivate, and develop other salespeople on your team.",
        duration: "35 min",
        content: `## Sales Team Leadership

**Goal:** Transition from individual contributor to team leader who elevates everyone's performance.

### The Leadership Mindset

Great sales leaders don't just close their own deals — they multiply their impact by making every team member better. The best salespeople aren't always the best leaders because leadership requires a completely different skillset: patience, teaching ability, and emotional intelligence.

### Coaching vs. Managing

Managing is about metrics and accountability. Coaching is about development and growth. Top sales leaders spend 70% of their time coaching and 30% managing. Ask questions instead of giving answers. Let your team members discover solutions themselves.

### Quick Quiz

**Q1:** The key difference between a top salesperson and a great sales leader is:
A) The leader makes more money
B) The leader multiplies their impact by developing others
C) The leader works fewer hours
D) The leader is older
**(Correct: B)**

**Q2:** When a struggling salesperson misses their target, a great leader first:
A) Puts them on a performance improvement plan
B) Asks questions to understand what's happening and listens
C) Yells at them for motivation
D) Ignores the problem
**(Correct: B)**

**Q3:** The most effective coaching technique is:
A) Telling people exactly what to do
B) Asking guiding questions that help them discover the answer themselves
C) Doing the deal for them
D) Sending them to more training videos
**(Correct: B)**

**Q4:** A team member consistently skips the needs assessment step. You should:
A) Write them up
B) Role-play with them, demonstrate the impact on closing rates, and have them practice
C) Let them figure it out
D) Assign them to another team
**(Correct: B)**
**Q5:** A team member resists coaching after multiple sessions. You should:
A) Give up on them
B) Have a direct, private conversation about their goals and whether this role is the right fit
C) Humiliate them in front of the team
D) Assign them only low-value leads
**(Correct: B)**
`,
      },
      {
        id: "senior-coaching",
        title: "Coaching Other Salespeople",
        description: "Effective one-on-one coaching techniques for automotive sales.",
        duration: "35 min",
        content: `## Coaching Other Salespeople

**Goal:** Develop a repeatable coaching framework that improves individual and team performance.

### The GROW Coaching Model

- **G**oal — What does the salesperson want to achieve?
- **R**eality — Where are they now? What's blocking them?
- **O**ptions — What could they try differently?
- **W**ill — What will they commit to doing?

### Observation-Based Coaching

Spend time on the lot observing before you coach. Watch how they greet, qualify, present, and close. Take notes. Then sit down and walk through what you observed. Focus on patterns, not one-off incidents.

### Quick Quiz

**Q1:** The GROW coaching model stands for:
A) Greet, Respond, Observe, Win
B) Goal, Reality, Options, Will
C) Grow, Reach, Overcome, Win
D) Guide, Review, Optimize, Work
**(Correct: B)**

**Q2:** Before coaching a salesperson, you should first:
A) Tell them everything they're doing wrong
B) Observe them on the lot interacting with real customers
C) Send them an email with feedback
D) Talk to other salespeople about them
**(Correct: B)**

**Q3:** The most effective coaching sessions end with:
A) The coach talking for 80% of the time
B) The salesperson committing to specific, measurable actions
C) A vague promise to "do better"
D) A threat of consequences
**(Correct: B)**

**Q4:** A salesperson struggles with objections. The best coaching approach is:
A) Give them a script to memorize
B) Role-play common objections until responses become natural
C) Tell them objections don't matter
D) Take over when objections arise
**(Correct: B)**
**Q5:** The most important quality in a sales coach is:
A) Being the best closer on the team
B) The ability to diagnose skill gaps and provide specific, actionable feedback
C) Having the most experience
D) Being liked by everyone
**(Correct: B)**
`,
      },
      {
        id: "senior-complex-deals",
        title: "Complex Deal Structuring",
        description: "Navigate multi-party, high-value, and time-sensitive deals.",
        duration: "35 min",
        content: `## Complex Deal Structuring

**Goal:** Master the art of structuring deals involving multiple parties, trade-ins, financing, and timing constraints.

### The Deal Triangle

Every complex deal has three elements: Price, Terms, and Timing. You can give on one if you hold on the other two. Understanding which element matters most to the customer gives you the leverage to create a win-win structure.

### Multi-Party Dynamics

When spouses, parents, or business partners are involved, identify the primary decision-maker AND the primary influencer. They're often different people. Address both of their concerns.

### Quick Quiz

**Q1:** In a complex deal, the three primary levers are:
A) Price, vehicle, color
B) Price, terms, timing
C) Salesperson, manager, finance
D) Morning, afternoon, evening
**(Correct: B)**

**Q2:** When a couple disagrees on a vehicle, the best approach is:
A) Side with the more vocal person
B) Find the shared needs and present a vehicle that addresses both concerns
C) Wait for them to figure it out
D) Only talk to one person
**(Correct: B)**

**Q3:** A customer has a trade-in with negative equity. You should:
A) Hide the negative equity
B) Be transparent, explain the situation clearly, and present options
C) Refuse the trade-in
D) Only show them cheap vehicles
**(Correct: B)**

**Q4:** The customer wants a specific vehicle that won't arrive for 3 weeks. You should:
A) Try to sell something on the lot
B) Secure the incoming unit with a deposit, stay in weekly contact, and provide updates
C) Tell them to come back in 3 weeks
D) Say you can't help them
**(Correct: B)**
**Q5:** A customer wants a vehicle sold out nationwide. You should:
A) Tell them it's impossible
B) Be honest about availability, offer a committed search with updates, and present the closest alternatives
C) Lie and say it's coming next week
D) Pressure them to buy whatever is on the lot
**(Correct: B)**
`,
      },
    ],
  },

  // ===== Course 8: Closing & Overcoming Objections =====
  {
    id: "closing-objections",
    title: "Closing & Overcoming Objections",
    subtitle: "Turn every objection into an opportunity to close",
    description:
      "Master the art of handling objections and closing deals with confidence. Learn to overcome price objections, hesitation, spouse objections, competitor comparisons, and timing issues. 25 scenario-based questions to sharpen your skills.",
    levels: "Intermediate",
    duration: "4 hours",
    lessons: 5,
    image: "closing",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    lessonsList: [
      {
        id: "closing-price-objections",
        title: "Overcoming Price Objections",
        description: "Handle \"it's too expensive\" with proven techniques.",
        duration: "35 min",
        content: `## Overcoming Price Objections

**Goal:** Turn price concerns into value conversations and close more deals at higher gross.

### The Price-Value Equation

Price is what they pay. Value is what they get. When a customer says "It's too expensive," they're really saying "I don't see enough value for that price." Your job is to bridge the gap.

### Techniques That Work

1. **Reframe**: "Let's talk about what you're getting for that price..."
2. **Break it down**: "$X per month is only $Y per day — less than your daily coffee."
3. **Compare value**: "The competitor's vehicle costs less upfront, but here's what you give up..."
4. **The silence technique**: After stating your price, stay quiet. Let them process.

### Quick Quiz

**Q1:** A customer says "That's more than I wanted to spend." Best response:
A) "What were you hoping to spend?" followed by listening
B) Immediately offer a discount
C) "That's our best price"
D) Walk away
**(Correct: B)**

**Q2:** The "break it down" technique involves:
A) Breaking the vehicle into parts
B) Converting the price difference into a small daily amount
C) Breaking the deal
D) Breaking eye contact
**(Correct: B)**

**Q3:** When a customer compares your price to a competitor's lower price, you should:
A) Badmouth the competitor
B) Acknowledge the difference and highlight value advantages your vehicle offers
C) Match the competitor's price immediately
D) Ignore the comparison
**(Correct: B)**

**Q4:** The silence technique after stating a price works because:
A) It makes the customer uncomfortable
B) It gives the customer time to process and often leads them to fill the silence with useful information
C) It shows you don't care
D) It wastes time
**(Correct: B)**

**Q5:** A customer wants you to "sharpen your pencil." You respond:
A) "How much sharper were you thinking?" to understand their target
B) "No"
C) "OK, here's $500 off"
D) "Let me get my manager"
**(Correct: B)**`,
      },
      {
        id: "closing-think-about-it",
        title: 'Handling "I Need to Think About It"',
        description: "Turn hesitation into commitment with the right questions.",
        duration: "35 min",
        content: `## Handling "I Need to Think About It"

**Goal:** Uncover the real concern behind hesitation and close the deal.

### What They Really Mean

"I need to think about it" is almost never about thinking. It's a polite way of saying one of:
- "I have a concern I'm not comfortable sharing"
- "I need to check with someone else"
- "I'm not convinced this is the right vehicle/price"
- "I'm afraid of making the wrong decision"

### The Clarify-Address-Close Method

1. **Clarify**: "I understand. Help me understand — what specifically do you want to think about?"
2. **Address**: Once they share the real concern, address it directly.
3. **Close**: "If we can resolve that concern, are you ready to move forward?"

### Quick Quiz

**Q1:** "I need to think about it" usually means:
A) The customer genuinely needs time to think
B) There's an unspoken concern or objection
C) The customer is going to buy somewhere else
D) The customer hates the vehicle
**(Correct: B)**

**Q2:** The best follow-up to "I need to think about it" is:
A) "OK, take your time" and walk away
B) "I completely understand. Help me understand — what specifically do you want to think through?"
C) "You're making a mistake"
D) "I'll call you tomorrow"
**(Correct: B)**

**Q3:** After the customer shares their real concern, you should:
A) Argue with them
B) Address it directly, then ask "If we resolve this, are you ready to move forward?"
C) Offer a bigger discount
D) Change the subject
**(Correct: B)**

**Q4:** The "fear of making the wrong decision" is best addressed by:
A) Pressuring them to decide
B) Providing social proof (other happy customers), warranty coverage, and reassurance
C) Telling them they're overthinking
D) Ignoring their fear
**(Correct: B)**

**Q5:** A customer says they need to check with their spouse. You should:
A) Tell them spouses don't matter
B) Offer to set up a time when the spouse can come in, or do a video call
C) Close the deal anyway
D) Send them home with a brochure
**(Correct: B)**`,
      },
      {
        id: "closing-spouse-objections",
        title: "Spouse & Partner Objections",
        description: "Navigate dual-decision scenarios with finesse.",
        duration: "35 min",
        content: `## Spouse & Partner Objections

**Goal:** Handle situations where both partners are involved in the buying decision.

### The Dual-Decision Dynamic

When two people are making a decision together, they often have different priorities. One may care about price, the other about safety. One may want style, the other practicality. Your job is to address BOTH sets of needs.

### Include Both Partners

- Address questions to both people, not just the more vocal one
- Ask each person what's most important to them
- Find common ground where both priorities overlap
- Never take sides or undermine one partner to the other

### Quick Quiz

**Q1:** When working with a couple, the biggest mistake is:
A) Addressing only the more vocal partner
B) Showing them too many vehicles
C) Discussing price
D) Being too friendly
**(Correct: B)**

**Q2:** A wife is concerned about safety, the husband about performance. You should:
A) Focus only on safety
B) Focus only on performance
C) Present vehicles that excel in both areas and highlight both benefits
D) Tell them to compromise
**(Correct: B)**

**Q3:** One partner clearly wants to buy but the other is resistant. Best approach:
A) Push the enthusiastic partner to convince the other
B) Ask the resistant partner "What would make you feel comfortable with this decision?"
C) Ignore the resistant partner
D) Tell them to come back when they agree
**(Correct: B)**

**Q4:** The husband wants to negotiate price but the wife hasn't seen the vehicle yet. You should:
A) Start negotiating immediately
B) Politely suggest the wife see and drive the vehicle first, then discuss numbers
C) Only talk to the husband
D) Split them up
**(Correct: B)**

**Q5:** A partner objects to the monthly payment. The best response:
A) "That's what it costs"
B) Explore alternative financing terms, down payment options, or different trim levels
C) End the conversation
D) Offer a lease instead
**(Correct: B)**`,
      },
      {
        id: "closing-competitor",
        title: "Competitor Comparisons",
        description: "Win deals when customers are cross-shopping other brands.",
        duration: "35 min",
        content: `## Competitor Comparisons

**Goal:** Position your vehicle as the clear winner when customers are comparing multiple brands.

### The Comparison Framework

Never badmouth competitors — it makes YOU look bad. Instead:
1. **Acknowledge**: "The [Competitor] is a solid vehicle."
2. **Differentiate**: "Here's where we're different..."
3. **Advantage**: "And here's why that matters to you..."

### Know Your Competition

Study the top 3 competitors for every vehicle in your lineup. Know their pricing, features, warranty, and resale value. Being informed builds trust. Being uninformed costs deals.

### Quick Quiz

**Q1:** The best way to handle a competitor comparison is:
A) Say the competitor makes terrible vehicles
B) Acknowledge the competitor's strengths, then highlight your unique advantages
C) Pretend the competitor doesn't exist
D) Match their price
**(Correct: B)**

**Q2:** A customer says they're also looking at a competitor with a lower price. You should:
A) Immediately match the price
B) Explore what features matter to them and show where your vehicle delivers more value
C) Let them walk
D) Claim the competitor is lying
**(Correct: B)**

**Q3:** The most effective competitive research includes knowing:
A) Only your own vehicle's specs
B) The competitor's pricing, key features, warranty terms, and common customer complaints
C) Nothing — it doesn't matter
D) Only the competitor's weaknesses
**(Correct: B)**

**Q4:** When a customer mentions a specific competitor feature you don't have, you should:
A) Dismiss it as unimportant
B) Acknowledge it, then pivot to a feature you DO have that addresses the same customer need
C) Lie and say you have it
D) Change the subject
**(Correct: B)**

**Q5:** The customer test-drove a competitor's vehicle this morning. Best question to ask:
A) "Why would you even consider them?"
B) "What did you like about it, and what didn't feel quite right?"
C) "They're terrible, aren't they?"
D) "Did you buy it?"
**(Correct: B)**`,
      },
      {
        id: "closing-timing",
        title: "Timing & Urgency Objections",
        description: "Create ethical urgency and handle timing-based stalls.",
        duration: "35 min",
        content: `## Timing & Urgency Objections

**Goal:** Help customers overcome procrastination and make confident decisions today.

### Why Customers Delay

Customers delay for two reasons: genuine timing constraints (lease isn't up, waiting on financing) and fear (afraid of making the wrong choice, hoping for a better deal later). Learn to distinguish between them.

### Creating Ethical Urgency

Never manufacture fake urgency. Instead, highlight REAL reasons to act now:
- Current incentives or rebates that expire
- Limited availability of specific configurations
- Rate locks and trade-in value guarantees
- The cost of waiting (continued repair costs, missed savings)

### Quick Quiz

**Q1:** The most ethical way to create urgency is:
A) Lie about another buyer being interested
B) Highlight real, time-sensitive benefits like expiring incentives or limited availability
C) Pressure the customer
D) Threaten price increases
**(Correct: B)**

**Q2:** A customer says they want to wait until "next month." You should ask:
A) "Why are you being so difficult?"
B) "Is there something specific happening next month, or is there a concern I can address now?"
C) "OK, goodbye"
D) Nothing — just wait
**(Correct: B)**

**Q3:** The cost-of-waiting argument works best when:
A) You make up numbers
B) You quantify real costs: current repair bills, missed rebates, trade-in depreciation
C) You're aggressive
D) You ignore the customer's timeline
**(Correct: B)**

**Q4:** A customer says "I want to sleep on it." Best response:
A) "You can't sleep here!"
B) "I understand. Let me ask — is there a specific question I can answer that might help you feel confident deciding today?"
C) "Fine, leave"
D) "The deal expires at midnight"
**(Correct: B)**

**Q5:** The end of the month is approaching and the customer is on the fence. You should:
A) Tell them prices go up on the 1st (if true)
B) Mention any month-end incentives that apply and ask if that changes their timeline
C) Make up fake deadlines
D) Ignore the calendar entirely
**(Correct: B)**`,
      },
    ],
  },

  // ===== Course 9: Landing on the Right Vehicle - Needs Assessment Part 2 =====
  {
    id: "needs-assessment-2",
    title: "Landing on the Right Vehicle — Needs Assessment Part 2",
    subtitle: "Advanced qualification techniques to match customers with their perfect vehicle",
    description:
      "Go deeper than basic needs assessment. Learn to read buying signals, match lifestyle to vehicle, navigate family vs individual needs, qualify budgets with tact, and handle trade-in psychology. 25 in-depth scenario questions.",
    levels: "Intermediate",
    duration: "4 hours",
    lessons: 5,
    image: "needs",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    lessonsList: [
      {
        id: "needs2-buying-signals",
        title: "Reading Buying Signals",
        description: "Recognize verbal and non-verbal cues that indicate readiness to buy.",
        duration: "35 min",
        content: `## Reading Buying Signals

**Goal:** Identify when a customer is ready to move forward so you can close at the right moment.

### Verbal Buying Signals

- "How soon can I take delivery?"
- "What's the warranty like?"
- "Can I get it in blue?"
- "Would you take [amount] for my trade?"
- "What are my financing options?"

These questions indicate the customer has mentally moved from "if" to "how."

### Non-Verbal Buying Signals

- Nodding while you explain features
- Touching or lingering near the vehicle
- Looking at their spouse/partner and smiling
- Relaxed, open body language
- Taking photos of the vehicle

### Quick Quiz

**Q1:** A customer asks "How soon can I take delivery?" This signals:
A) They're just curious
B) They've mentally moved from "if I buy" to "how I buy"
C) They're wasting time
D) They're unhappy
**(Correct: B)**

**Q2:** The most reliable non-verbal buying signal is:
A) Arms crossed
B) The customer touching the vehicle, smiling, and looking at their partner
C) Looking at their phone
D) Walking toward the exit
**(Correct: B)**

**Q3:** A customer takes photos of the vehicle and texts someone. You should:
A) Tell them photos aren't allowed
B) Ask "Sending that to someone who needs to see it? Would it help to bring them in?"
C) Ignore it
D) Take the phone away
**(Correct: B)**

**Q4:** The difference between a question and a buying signal is:
A) There's no difference
B) A buying signal implies movement toward purchase ("How soon can I get it?") vs. general curiosity
C) Buying signals are always about price
D) Only managers can spot buying signals
**(Correct: B)**

**Q5:** A customer keeps returning to look at a specific vehicle feature. This indicates:
A) They're bored
B) That feature is important to them — highlight it during your presentation
C) They don't like the vehicle
D) They're comparing to competitors
**(Correct: B)**`,
      },
      {
        id: "needs2-lifestyle-matching",
        title: "Matching Lifestyle to Vehicle",
        description: "Connect vehicle features to the customer's daily life and passions.",
        duration: "35 min",
        content: `## Matching Lifestyle to Vehicle

**Goal:** Move beyond feature lists to connect vehicles to how customers actually live.

### Lifestyle Discovery Questions

- "What does a typical weekend look like for you?"
- "How do you use your current vehicle?"
- "What hobbies or activities are important to you?"
- "Who usually rides with you?"
- "What's your commute like?"

### The Lifestyle-Connect Method

1. **Discover** — Ask lifestyle questions
2. **Connect** — Link their answers to specific vehicle features
3. **Visualize** — "Imagine loading up the kayaks on this roof rack this Saturday..."

### Quick Quiz

**Q1:** The most powerful lifestyle question to ask is:
A) "What's your budget?"
B) "What does a typical weekend look like for you?"
C) "Do you like the color?"
D) "When are you buying?"
**(Correct: B)**

**Q2:** A customer mentions they go camping every month. You should:
A) Show them a sports car
B) Focus on cargo space, roof rack capability, all-wheel drive, and ground clearance
C) Tell them camping is irrelevant
D) Show the cheapest vehicle
**(Correct: B)**

**Q3:** The Lifestyle-Connect method works because:
A) It pressures customers
B) It helps customers mentally picture the vehicle as part of their real life
C) It confuses them
D) It speeds up the process artificially
**(Correct: B)**

**Q4:** A customer has a 45-minute highway commute. Priority features are:
A) Off-road capability
B) Fuel economy, comfortable seats, adaptive cruise control, and cabin quietness
C) Towing capacity
D) Racing stripes
**(Correct: B)**

**Q5:** The customer can't articulate what they want. Best approach:
A) Show them everything
B) Ask lifestyle questions to narrow down what matters, then present 2-3 matching vehicles
C) Give up
D) Pick a vehicle for them randomly
**(Correct: B)**`,
      },
      {
        id: "needs2-family-needs",
        title: "Family Needs vs. Individual Needs",
        description: "Balance multiple priorities when a vehicle serves the whole family.",
        duration: "35 min",
        content: `## Family Needs vs. Individual Needs

**Goal:** Find the sweet spot between what the primary driver wants and what the family needs.

### The Family Vehicle Matrix

Create a mental grid:
- **Safety** — crash ratings, driver assistance features
- **Space** — seating capacity, cargo room, legroom
- **Convenience** — easy entry/exit, kid-friendly features
- **Fun** — what the driver actually enjoys

The best recommendation hits at least 3 of 4 boxes.

### Handling Competing Priorities

When the primary driver wants a sports car but the family needs an SUV, don't dismiss either desire. Find vehicles that bridge the gap: sporty SUVs, performance crossovers, or versatile sedans.

### Quick Quiz

**Q1:** The family vehicle matrix includes these four elements:
A) Price, color, brand, speed
B) Safety, space, convenience, fun
C) Engine, transmission, tires, paint
D) Radio, seats, mirrors, lights
**(Correct: B)**

**Q2:** A dad wants a pickup truck but mom wants a minivan. Best approach:
A) Sell them one of each
B) Explore SUVs with third-row seating and cargo flexibility that bridge both needs
C) Side with the dad
D) Side with the mom
**(Correct: B)**

**Q3:** When kids are present during the visit, you should:
A) Ignore them
B) Acknowledge them, ask about car seat needs, and show kid-friendly features
C) Ask them to wait outside
D) Only talk to the adults
**(Correct: B)**

**Q4:** A family of five needs a new vehicle. The most important spec to discuss is:
A) 0-60 time
B) Seating capacity and ease of third-row access
C) Premium audio system
D) Sunroof
**(Correct: B)**

**Q5:** The primary driver is disappointed they can't get the sports car they wanted. You should:
A) Say "tough luck"
B) Find vehicles with sporty driving dynamics that still meet family requirements
C) Only show minivans
D) Tell them to come back without the family
**(Correct: B)**`,
      },
      {
        id: "needs2-budget-qualification",
        title: "Budget Qualification Techniques",
        description: "Discuss money comfortably and qualify budgets with tact.",
        duration: "35 min",
        content: `## Budget Qualification Techniques

**Goal:** Understand the customer's true budget without making them uncomfortable.

### The Comfortable Money Conversation

Money doesn't have to be awkward. Frame budget discussions around monthly payment comfort, not "how much can you afford." Use ranges instead of exact numbers to help customers share more openly.

### Budget Discovery Questions

- "Most of our customers find payments in the $X-$Y range work well. Where do you see yourself?"
- "Are you planning to finance, lease, or pay cash?"
- "Is there a monthly payment you're trying to stay under?"
- "What were you thinking for a down payment?"

### Quick Quiz

**Q1:** The most comfortable way to open a budget conversation is:
A) "How much money do you make?"
B) "Most of our customers find payments in the $400-$600 range comfortable. Does that sound about right for you?"
C) "What's your credit score?"
D) "Can you afford this?"
**(Correct: B)**

**Q2:** A customer gives a vague budget answer. You should:
A) Accept it and move on
B) Use ranges to narrow it down: "Are we thinking closer to $400 or $600 per month?"
C) Insist on an exact number
D) Show them the most expensive vehicle
**(Correct: B)**

**Q3:** When a customer's budget doesn't match their vehicle wishes, the best response is:
A) "You can't afford this"
B) Explore whether budget or vehicle preference is more flexible, and present options at both levels
C) Only show vehicles in their budget
D) Only show what they want
**(Correct: B)**

**Q4:** A customer says they're paying cash. This usually means:
A) They're rich
B) They may or may not pay cash — keep financing options open as an alternative
C) They definitely have the money
D) The deal will be simple
**(Correct: B)**

**Q5:** The customer avoids the budget question entirely. You should:
A) Skip budget and show vehicles randomly
B) Pivot to lifestyle questions first, then naturally return to budget: "Based on what you've described, most similar customers are in the $X range. How does that feel?"
C) Refuse to help until they answer
D) Guess their budget
**(Correct: B)**`,
      },
      {
        id: "needs2-tradein-psychology",
        title: "Trade-In Psychology",
        description: "Understand the emotional attachment to trade-ins and use it to build trust.",
        duration: "35 min",
        content: `## Trade-In Psychology

**Goal:** Navigate the emotional and practical aspects of trade-in discussions.

### The Emotional Attachment

Customers often have strong emotional connections to their current vehicle. It's taken them on road trips, carried their kids, been part of their lives. Never dismiss or insult their current vehicle — it's an extension of them.

### The Validation Approach

1. **Validate**: "That's been a great vehicle for you, hasn't it?"
2. **Understand**: "What will you miss most about it?"
3. **Transition**: "Let me show you how this new one builds on what you love..."

### Quick Quiz

**Q1:** The biggest mistake in trade-in discussions is:
A) Offering too much
B) Insulting or dismissing the customer's current vehicle
C) Being too slow
D) Not appraising the vehicle
**(Correct: B)**

**Q2:** A customer is emotionally attached to their trade-in. Best approach:
A) Tell them it's just a car
B) Validate their feelings, acknowledge what the vehicle has meant to them, then help them get excited about the next chapter
C) Rush through the appraisal
D) Ignore the emotional aspect entirely
**(Correct: B)**

**Q3:** The Validation-Understand-Transition approach works because:
A) It's manipulative
B) It respects the customer's emotional connection while guiding them forward
C) It wastes time
D) It guarantees a higher offer
**(Correct: B)**

**Q4:** A customer overvalues their trade-in based on sentiment. You should:
A) Agree with them
B) Acknowledge the sentimental value while gently introducing market data to set realistic expectations
C) Tell them their vehicle is worthless
D) Refuse the trade
**(Correct: B)**

**Q5:** The best time to discuss trade-in value is:
A) At the very end of the deal
B) Early in the process, before presenting numbers on the new vehicle
C) Never
D) After they've signed
**(Correct: B)**`,
      },
    ],

  },

  // ===== Course 10: HEART Method =====
  {
    id: "heart-method",
    title: "The H.E.A.R.T. Method",
    subtitle: "A human-centered sales system that builds trust and closes more deals — Plus+ Tier",
    requiredTier: "plus",
    description:
      "Plus+ Tier Exclusive. Master the H.E.A.R.T. framework: Human Connection, Emotional Discovery, Aligned Solutions, Respectful Guidance, and Trusted Partnership. Transform transactional selling into relational advising. 6 lessons with 48 scenario-based quiz questions.",
    levels: "Intermediate",
    duration: "5 hours",
    lessons: 6,
    image: "heart",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    lessonsList: [
      {
        id: "heart-intro",
        title: "Introduction to the H.E.A.R.T. Method",
        description: "Why human-centered selling outperforms transactional tactics and how the HEART framework transforms your results.",
        duration: "40 min",
        content: `## Introduction to the H.E.A.R.T. Method

**Goal:** Understand why traditional high-pressure sales tactics are failing and how a human-centered approach builds lasting success.

### The Death of Transactional Selling

Customers today are more informed than ever. They've researched inventory online, compared prices across multiple dealerships, and read dozens of reviews before they ever walk onto your lot. The old model — control the conversation, overcome objections, close hard — doesn't just fail; it actively drives customers away.

Research shows that 74% of car buyers say they would buy more often from a salesperson who made them feel understood rather than sold. The H.E.A.R.T. Method is built on this insight.

### What H.E.A.R.T. Stands For

- **H** — Human Connection: See the person before the commission. Build genuine rapport that transcends the transaction.
- **E** — Emotional Discovery: Uncover the feelings, fears, and aspirations driving the purchase decision.
- **A** — Aligned Solutions: Match vehicles to both practical requirements and emotional desires.
- **R** — Respectful Guidance: Lead the customer through the process without pressure, manipulation, or games.
- **T** — Trusted Partnership: Become their automotive advisor for life, not just this sale.

### Why This Works

The H.E.A.R.T. Method leverages fundamental psychology: people buy from those they trust, and trust is built through empathy, competence, and consistency — not pressure. When a customer feels genuinely understood, price becomes secondary to the relationship.

### Quick Quiz

**Q1:** The primary reason traditional high-pressure sales tactics are failing is:
A) Cars are too expensive now
B) Customers are more informed and resistant to transactional manipulation
C) Salespeople are less skilled than before
D) The internet doesn't work for car sales
**(Correct: B)**

**Q2:** What percentage of car buyers say they would buy more often from a salesperson who made them feel understood?
A) 32%
B) 51%
C) 74%
D) 89%
**(Correct: C)**

**Q3:** The "H" in H.E.A.R.T. stands for:
A) High pressure
B) Human Connection
C) Hard closing
D) Happy customers
**(Correct: B)**

**Q4:** Which of the following is NOT one of the five elements of the H.E.A.R.T. Method?
A) Human Connection
B) Emotional Discovery
C) Aggressive Negotiation
D) Trusted Partnership
**(Correct: C)**

**Q5:** According to the H.E.A.R.T. philosophy, trust is primarily built through:
A) Low prices and big discounts
B) Empathy, competence, and consistency
C) Fast-talking and persuasion
D) Offering the most features
**(Correct: B)**

**Q6:** The H.E.A.R.T. Method positions the salesperson as:
A) A negotiator fighting for the dealership
B) An automotive advisor for life
C) A product specialist only
D) A finance manager
**(Correct: B)**

**Q7:** When a customer feels genuinely understood, what typically happens to price sensitivity?
A) It increases dramatically
B) It becomes secondary to the relationship
C) It disappears completely
D) It doubles
**(Correct: B)**

**Q8:** The "T" in H.E.A.R.T. emphasizes:
A) Transactional speed
B) Trusted Partnership beyond a single sale
C) Talking more than listening
D) Taking control of the conversation
**(Correct: B)**`,
      },
      {
        id: "heart-human-connection",
        title: "H — Hear: Active Listening",
        description: "Master the art of active listening — hear what customers are really saying beneath their words.",
        duration: "45 min",
        content: `## H — Hear: Active Listening

**Goal:** Build genuine rapport that goes beyond the transaction and makes customers feel seen, heard, and valued.

### Beyond the Script

Most salespeople have a "greeting script" — a rehearsed sequence of words designed to open the conversation. Customers can smell a script from across the lot. Human Connection isn't about what you say; it's about how you make them feel.

### The 3-Layer Connection Model

**Layer 1: The Welcome** — Your first 10 seconds set the tone. Smile genuinely. Make eye contact. Use a warm, unrushed tone. The message is: "I'm genuinely glad you're here."

**Layer 2: The Observation** — Notice something real about the customer. Their vehicle, their family, their energy level. Comment on it authentically. "I see you've got a car seat in the back — how old is your little one?" This signals you see them as a person, not a prospect.

**Layer 3: The Bridge** — Connect your observation to their visit without jumping to business. "With a growing family, you're probably thinking about space and safety. Is that what brought you in today?" This transitions naturally while validating their presence.

### Common Connection Killers

- Rushing to qualify before connecting
- Using closed questions that invite "no"
- Treating every customer the same
- Checking your phone or watch during conversation
- Interrupting to pitch features

### Quick Quiz

**Q1:** The 3-Layer Connection Model consists of:
A) Greet, Pitch, Close
B) Welcome, Observation, Bridge
C) Smile, Talk, Sell
D) Hello, Qualify, Present
**(Correct: B)**

**Q2:** What is the primary goal of the "Observation" layer?
A) To find something to criticize
B) To signal that you see the customer as a person, not a prospect
C) To identify their credit score
D) To determine what car they can afford
**(Correct: B)**

**Q3:** Which of these is a "Connection Killer"?
A) Making genuine eye contact
B) Rushing to qualify before connecting
C) Asking about their family
D) Using their name
**(Correct: B)**

**Q4:** The "Bridge" layer accomplishes which of the following?
A) It closes the deal immediately
B) It connects your observation naturally to the reason for their visit
C) It brings up financing options
D) It asks for a credit application
**(Correct: B)**

**Q5:** When you notice a customer has a car seat, the best approach is:
A) Ignore it and stick to your script
B) Acknowledge it genuinely and ask about their child
C) Immediately show them the most expensive SUV
D) Tell them your vehicle has more cup holders
**(Correct: B)**

**Q6:** Customers can detect a "scripted" greeting because:
A) They've done research online
B) It lacks authenticity, specific observation, and genuine warmth
C) They're naturally suspicious
D) Scripts always mention price
**(Correct: B)**

**Q7:** A customer arrives looking stressed and rushed. Your best opening:
A) "Can I help you?" (efficient and direct)
B) "You look like you've had a day — take a breath. I'm here whenever you're ready. Can I get you some water?"
C) Launch into your full sales presentation immediately
D) "We're running a special today only"
**(Correct: B)**

**Q8:** The first 10 seconds of a customer interaction should communicate:
A) That you know everything about every vehicle
B) That you're genuinely glad they're here
C) That you have the best prices in town
D) That you're the top salesperson
**(Correct: B)**`,
      },
      {
        id: "heart-emotional-discovery",
        title: "E — Empathize: Understanding Customer Needs",
        description: "Put yourself in the customer's shoes. Uncover the real feelings, fears, and aspirations driving every purchase decision.",
        duration: "50 min",
        content: `## E — Empathize: Understanding Customer Needs

**Goal:** Move beyond surface-level needs to uncover the emotional drivers that actually close deals.

### Cars Are Emotional Purchases

Nobody buys a car purely on logic. Even the most practical minivan purchase is driven by emotions: safety for the kids, pride in providing, fear of breakdowns, excitement about road trips. The salesperson who only asks about budget, features, and trade-in value is missing 80% of the sale.

### The Emotion Map

Every car buyer has three layers of motivation:

**Surface Layer** — What they say they want: "I need an SUV with good gas mileage."
**Middle Layer** — The practical reasons: "My commute is long, and my family is growing."
**Deep Layer** — The emotional driver: "I want to feel safe with my kids in the car, and I want to feel proud when I pull into the driveway."

Great salespeople reach the deep layer.

### Discovery Questions That Reveal Emotion

- "What would having this vehicle mean for your family?"
- "What's the one thing you're most excited about in a new car?"
- "What worries you most about making the wrong choice?"
- "Tell me about the best car you ever owned — what made it special?"
- "If this vehicle could solve one problem in your daily life, what would it be?"

### Listening for Emotional Cues

When a customer says "I need good gas mileage," they may really be saying "I'm stressed about money." When they say "I want something reliable," they may mean "I'm afraid of being stranded." Listen for the feeling behind the words.

### Quick Quiz

**Q1:** According to the HEART Method, what percentage of a car purchase is driven by emotion?
A) About 20%
B) About 50%
C) A significant majority — most purchases are emotionally driven
D) Zero — cars are purely logical purchases
**(Correct: C)**

**Q2:** The three layers of buyer motivation are:
A) Price, Payment, Terms
B) Surface, Middle, Deep
C) Greeting, Presentation, Close
D) Budget, Features, Trade-in
**(Correct: B)**

**Q3:** A customer says "I need good gas mileage." What might they really be feeling?
A) They love math
B) They may be stressed about money or monthly expenses
C) They're an environmentalist
D) They want a smaller car
**(Correct: B)**

**Q4:** Which is the best "deep layer" discovery question?
A) "What's your budget?"
B) "What would having this vehicle mean for your family?"
C) "Do you want leather or cloth?"
D) "Are you trading in?"
**(Correct: B)**

**Q5:** When a customer says "I want something reliable," the underlying emotion is often:
A) Excitement about technology
B) Fear of being stranded or dealing with repair costs
C) Desire for luxury
D) Interest in performance
**(Correct: B)**

**Q6:** The "Emotion Map" helps you:
A) Manipulate customers into buying
B) Move past surface statements to the real feelings driving the decision
C) Draw pictures of vehicles
D) Calculate monthly payments
**(Correct: B)**

**Q7:** A customer mentions their kids multiple times during conversation. This signals:
A) They're trying to get a discount
B) Family safety and comfort are deep emotional priorities
C) They want a minivan
D) They're not serious buyers
**(Correct: B)**

**Q8:** "Tell me about the best car you ever owned — what made it special?" This question works because:
A) It's a trick to get them talking
B) It reveals the emotional qualities they value most in a vehicle
C) It wastes time
D) It leads directly to price negotiation
**(Correct: B)**`,
      },
      {
        id: "heart-aligned-solutions",
        title: "A — Act: Matching Solutions to Needs",
        description: "Take action based on what you've learned. Match vehicles to both practical needs and emotional desires — the perfect-fit presentation.",
        duration: "50 min",
        content: `## A — Act: Matching Solutions to Needs

**Goal:** Present vehicles that align with both the customer's stated needs AND their unspoken emotional drivers.

### The Alignment Principle

Most salespeople present vehicles based on inventory availability or gross profit potential. The HEART salesperson presents based on alignment: how perfectly does this vehicle match what the customer truly wants and needs?

When a customer feels a vehicle was chosen specifically for them — not just shown to them — resistance melts away. They stop shopping you and start buying from you.

### The Alignment Checklist

Before presenting any vehicle, confirm it aligns on:

1. **Practical Needs** — Seating, cargo, fuel economy, budget range
2. **Emotional Drivers** — Safety feelings, pride of ownership, lifestyle aspirations
3. **Usage Patterns** — Commute, family trips, hobbies, work requirements
4. **Budget Comfort** — Monthly payment they feel good about, not just what they qualify for
5. **Timeline Fit** — Availability that matches their urgency level

### The 3-Vehicle Presentation Strategy

Never present just one vehicle — it creates a "take it or leave it" dynamic. Never present more than three — it creates confusion.

**Vehicle A: The Perfect Fit** — Best aligns with everything you've discovered.
**Vehicle B: The Value Option** — Similar benefits at a lower price point.
**Vehicle C: The Aspiration Option** — A step up that addresses an emotional desire they mentioned.

### Presenting with Emotional Anchoring

Instead of listing features, anchor each feature to an emotional benefit:
- "The rear-seat entertainment system means your kids stay occupied on long trips — less stress for you."
- "This safety rating isn't just a number — it means you can drive with confidence knowing your family is protected."

### Quick Quiz

**Q1:** The Alignment Principle states that vehicles should be presented based on:
A) Which has the highest gross profit
B) How perfectly they match the customer's true needs and desires
C) What's been on the lot the longest
D) What the manager wants to move
**(Correct: B)**

**Q2:** The 3-Vehicle Presentation Strategy includes:
A) Any three vehicles on the lot
B) The Perfect Fit, The Value Option, and The Aspiration Option
C) The cheapest, the most expensive, and a random one
D) Three vehicles of the same color
**(Correct: B)**

**Q3:** Why should you never present just one vehicle?
A) It seems lazy
B) A single option creates a "take it or leave it" dynamic that kills deals
C) Customers always want choices
D) It violates dealership policy
**(Correct: B)**

**Q4:** "Emotional anchoring" in a vehicle presentation means:
A) Physically anchoring the customer to the car
B) Connecting each feature to how it will make the customer feel
C) Only talking about price
D) Avoiding emotional topics
**(Correct: B)**

**Q5:** Presenting more than three vehicles typically results in:
A) Higher customer satisfaction
B) Confusion and decision paralysis
C) Faster sales
D) Higher gross profit
**(Correct: B)**

**Q6:** The Alignment Checklist includes all of the following EXCEPT:
A) Practical Needs
B) Emotional Drivers
C) Salesperson's Commission
D) Budget Comfort
**(Correct: C)**

**Q7:** "This safety rating means you can drive with confidence that your family is protected." This is an example of:
A) Feature-based selling
B) Emotional anchoring — connecting a feature to a feeling
C) Price negotiation
D) Technical demonstration
**(Correct: B)**

**Q8:** The Aspiration Option in a 3-vehicle presentation should be:
A) The most expensive vehicle on the lot
B) A step up that addresses an emotional desire the customer mentioned
C) Always a luxury trim level
D) Something completely unrelated to their needs
**(Correct: B)**`,
      },
      {
        id: "heart-respectful-guidance",
        title: "R — Relate: Building Rapport Through Guidance",
        description: "Relate to customers through respectful guidance. Lead them through decisions with expertise and integrity — no pressure, no games.",
        duration: "50 min",
        content: `## R — Relate: Building Rapport Through Guidance

**Goal:** Guide customers confidently through the buying process while respecting their autonomy — transforming resistance into collaboration.

### The Difference Between Pressure and Guidance

Pressure says: "You need to buy this now." Guidance says: "Based on what you've told me, here's what I recommend, and here's why." Pressure creates resistance. Guidance creates trust.

Customers don't want to be sold — but they desperately want help making a confident decision. Your role is to be the expert guide who helps them navigate the complexity with clarity and honesty.

### The Respectful Guidance Framework

**Step 1: Summarize and Validate** — "Let me make sure I've understood you correctly. You need space for three kids, good fuel economy for your commute, and you want something that feels solid and safe. Did I get that right?"

**Step 2: Educate, Don't Sell** — Share your expertise neutrally. "The turbo engine gives you better highway passing power. The hybrid saves about $600/year in fuel. Here's the trade-off." Let them decide what matters.

**Step 3: Offer a Clear Recommendation** — "Based on everything we've discussed, I'd recommend starting with this model. Here's why it fits what you described."

**Step 4: Invite, Don't Push** — "How does this feel to you? Does this match what you had in mind, or should we adjust?"

### Handling Resistance with Respect

When a customer hesitates or objects, don't argue. Validate, explore, and adapt:
- Validate: "That makes sense. A lot of people feel that way."
- Explore: "Help me understand — what specifically gives you pause?"
- Adapt: "Let me show you something that addresses that concern."

### The "No-Game" Commitment

Never use manufactured urgency, fake "manager calls," or disingenuous "I'll lose my job" tactics. Customers see through these. The only sustainable sales career is built on truth and trust.

### Quick Quiz

**Q1:** The key difference between pressure and guidance is:
A) Pressure is louder; guidance is quieter
B) Pressure demands action; guidance offers informed recommendations
C) There is no difference
D) Guidance only works with luxury buyers
**(Correct: B)**

**Q2:** The first step in the Respectful Guidance Framework is:
A) Present the vehicle
B) Summarize and validate what you've heard
C) Ask for the sale
D) Discuss financing
**(Correct: B)**

**Q3:** When a customer objects, the HEART approach is to:
A) Overcome the objection aggressively
B) Validate, explore, and adapt
C) Ignore the objection
D) Offer a bigger discount
**(Correct: B)**

**Q4:** "Manufactured urgency" refers to:
A) Real limited-time incentives
B) Fake deadlines and pressure tactics designed to force quick decisions
C) End-of-month quotas
D) Vehicle availability
**(Correct: B)**

**Q5:** The "Invite, Don't Push" step means:
A) Asking the customer to leave
B) Asking how the recommendation feels and whether adjustments are needed
C) Pushing for a signature immediately
D) Calling the manager
**(Correct: B)**

**Q6:** A customer says "I'm not sure this is the right one." The best response is:
A) "Of course it is — trust me."
B) "What specifically doesn't feel right? Let's adjust until it does."
C) "This is the best we have."
D) "You're wrong — it's perfect for you."
**(Correct: B)**

**Q7:** The "No-Game" Commitment means:
A) You don't play games with pricing
B) You never use deceptive tactics, fake urgency, or dishonest persuasion
C) You don't negotiate
D) You only sell to serious buyers
**(Correct: B)**

**Q8:** When you educate rather than sell, you:
A) Give the customer neutral, honest information and let them decide
B) Tell them what to buy
C) Hide the downsides of each option
D) Only present one vehicle
**(Correct: A)**`,
      },
      {
        id: "heart-trusted-partnership",
        title: "T — Trust: Earning Long-Term Loyalty",
        description: "Build unshakeable trust. Become their automotive advisor for life — turning one sale into a lifetime of referrals and repeat business.",
        duration: "45 min",
        content: `## T — Trust: Earning Long-Term Loyalty

**Goal:** Transform a single transaction into an ongoing relationship that generates referrals, repeat sales, and a sustainable career.

### The Lifetime Value of a Customer

The average car buyer purchases 9-12 vehicles in their lifetime. Each happy customer will tell 3-5 people about their experience. A single satisfied customer can be worth $50,000+ in future sales and referrals. Yet most salespeople treat every sale like it's their last interaction with that customer.

### Building the Partnership

**During the Sale:**
- Be transparent about every fee, every number, every step
- Ask about their long-term vehicle plans
- Mention you'll be here for service questions, not just sales
- Give them your direct contact — not just the dealership number

**After the Sale:**
- Call 48 hours later: "How's the new car? Any questions I can answer?"
- Check in at 30 days: "Everything still feeling good?"
- Send a birthday card or holiday greeting — be human, not a sales robot
- Remember their kids' names, their hobbies, their preferences

**At Trade-In Time:**
- Reach out proactively when their vehicle hits key milestones
- "Your lease is coming up in 6 months — want to explore options early?"
- "I saw we just got a new model I think your wife would love based on what you told me last time."

### The Referral Engine

Happy customers want to refer you — but they need to be asked. After a positive experience, simply say: "I'm glad this worked out so well. If you know anyone else looking for a vehicle, I'd love to help them the same way."

### The Legacy Mindset

The best salespeople don't chase commissions — they build a book of business. A roster of 200-300 loyal customers who buy from you repeatedly and send their friends. This is the difference between grinding every month and having a sustainable, fulfilling career.

### Quick Quiz

**Q1:** The average car buyer purchases how many vehicles in their lifetime?
A) 1-2
B) 3-5
C) 9-12
D) 20+
**(Correct: C)**

**Q2:** The "Legacy Mindset" means:
A) Focusing only on this month's commission
B) Building a book of loyal customers who buy repeatedly and refer others
C) Selling the most expensive vehicles
D) Working only with high-end clients
**(Correct: B)**

**Q3:** The best time to make the first follow-up call after a sale is:
A) One year later
B) 48 hours later
C) Never — let them call you
D) One month later
**(Correct: B)**

**Q4:** A single satisfied customer can be worth approximately how much in future sales and referrals?
A) $1,000
B) $5,000
C) $50,000+
D) Nothing — each sale is independent
**(Correct: C)**

**Q5:** When asking for referrals, the best approach is:
A) Send a mass email to everyone
B) Ask genuinely after a positive experience: "If you know anyone looking, I'd love to help them too"
C) Offer cash for referrals
D) Wait for them to offer
**(Correct: B)**

**Q6:** Proactive trade-in outreach means:
A) Cold-calling random people
B) Contacting customers when their vehicle hits key milestones like lease-end or high mileage
C) Waiting for them to come back on their own
D) Sending generic advertisements
**(Correct: B)**

**Q7:** Remembering personal details about customers (kids' names, hobbies, preferences) helps because:
A) It's creepy
B) It demonstrates genuine human connection and builds long-term trust
C) It's required by the dealership
D) It helps with credit applications
**(Correct: B)**

**Q8:** The difference between "grinding every month" and a sustainable career is:
A) Working more hours
B) Building a loyal customer base that generates repeat business and referrals
C) Selling more expensive vehicles
D) Switching dealerships frequently
**(Correct: B)**`,
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getLesson(courseId: string, lessonId: string): { course: Course; lesson: Lesson } | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  const lesson = course.lessonsList.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  return { course, lesson };
}