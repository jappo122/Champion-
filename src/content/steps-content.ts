export interface DetailedStep {
  step: number;
  title: string;
  detailedDesc: string;
  whyItMatters: string;
  howToExecute: string;
  keyPrinciples: string[];
  commonMistakes: string[];
  proTips: string[];
  courseId: string;
}

export interface StepQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StepQuiz {
  step: number;
  title: string;
  questions: StepQuestion[];
}

export const detailedSteps: DetailedStep[] = [
  {
    step: 1,
    title: "Greeting & Building Rapport",
    detailedDesc: "The greeting is the single most important moment in the entire sales process. Within the first 10 seconds, the customer has already formed a lasting impression of you and your dealership. A warm, genuine greeting sets the tone for a trust-based relationship, while a rushed or transactional greeting triggers defensive walls that are difficult to break down. The goal is not to sell — it's to connect. Customers buy from people they like and trust, and that trust begins with how you make them feel in the first moment of contact.",
    whyItMatters: "Research shows that customers decide within 30 seconds whether they trust a salesperson. A poor first impression is nearly impossible to reverse. The greeting is your only chance to make a positive first impression, and it directly impacts every subsequent step of the process.",
    howToExecute: "Approach the customer warmly but not aggressively. Smile genuinely, make eye contact, and use their name as soon as you learn it. Start with an open-ended question like 'What brings you in today?' rather than a closed question like 'Can I help you?' Find common ground — notice something about their vehicle, their clothing, or their family. Make them feel welcomed, not hunted. The key is to be likable first and a salesperson second.",
    keyPrinciples: [
      "Be warm, not pushy — a genuine smile creates trust",
      "Use open-ended questions to start conversations",
      "Find common ground within the first 30 seconds",
      "Listen more than you talk — let them speak 80% of the time",
      "Make the customer feel welcomed, not hunted",
      "Use their name once you've learned it"
    ],
    commonMistakes: [
      "Rushing to qualify the customer before building rapport — this signals that you care more about the sale than the person",
      "Using closed questions like 'Can I help you?' which invites a 'no' and ends the conversation before it starts"
    ],
    proTips: [
      "Keep a bottle of water in your hand — it makes you appear approachable and gives you a natural prop",
      "If the customer is on their phone, wait 30 seconds before approaching. It shows respect for their time"
    ],
    courseId: "10-steps-part-1"
  },
  {
    step: 2,
    title: "Needs Assessment",
    detailedDesc: "The needs assessment is where top performers separate themselves from average salespeople. Instead of showing vehicles and hoping something sticks, great salespeople ask targeted questions to uncover exactly what the customer needs, wants, and can afford. This step is about gathering information, not presenting solutions. The more you understand about the customer's lifestyle, budget, preferences, and decision-making process, the better equipped you are to present the perfect vehicle. Think of yourself as a consultant, not a salesperson — your job is to diagnose before you prescribe.",
    whyItMatters: "80% of sales are lost because the salesperson didn't understand the customer's needs. Without a thorough needs assessment, you're guessing. With one, you're solving problems. Customers can tell when you genuinely understand them, and that understanding builds trust and makes the rest of the sales process smoother.",
    howToExecute: "Use the NEED system: Needs (what problems are they solving?), Expectations (what does their ideal experience look like?), Experience (what's their buying history?), Decision (who else is involved?). Also use the BANT framework: Budget, Authority, Need, Timeline. Ask open-ended questions and take detailed notes. Let them talk 80% of the time. After they answer, summarize what you heard: 'So if I understand correctly, you're looking for a reliable SUV with good fuel economy under $40,000. Did I get that right?'",
    keyPrinciples: [
      "Listen more than you talk — let them speak 80% of the time",
      "Identify budget range and monthly payment targets",
      "Understand primary use — commute, family, work, pleasure",
      "Determine who else is involved in the decision",
      "Take detailed notes — it shows you value their words",
      "Summarize what you heard to confirm understanding"
    ],
    commonMistakes: [
      "Jumping straight to vehicle features before understanding needs — this makes the customer feel unheard",
      "Asking only yes/no questions that don't reveal the real motivations behind the purchase"
    ],
    proTips: [
      "Use a physical notebook for notes — it's more personal than a tablet and signals that you're paying attention",
      "Ask 'What do you love about your current vehicle?' before asking what they want to change — it reveals their priorities"
    ],
    courseId: "10-steps-part-1"
  },
  {
    step: 3,
    title: "Vehicle Presentation",
    detailedDesc: "Once you understand the customer's needs, it's time to present the right vehicle. The key word is 'right' — not every vehicle on your lot, but the one that matches their specific requirements. Use the Feature-Advantage-Benefit (FAB) method to connect every feature to a customer benefit. For example: 'This vehicle has a blind-spot monitoring system (Feature), which means you'll be alerted to vehicles in your blind spots (Advantage), so you can change lanes with confidence, especially with your kids in the car (Benefit).' Limit choices to 2-3 vehicles max to avoid decision paralysis.",
    whyItMatters: "Customers who see 3+ vehicles experience decision fatigue and are less likely to buy. Presenting the right vehicle — not everything you have — positions you as a trusted advisor who has their best interests at heart. Every feature you highlight should directly connect back to something they told you during the needs assessment.",
    howToExecute: "Follow the walk-around sequence: Front (grille, headlights, stance), Side (lines, wheels, profile), Interior (seats, technology, space), Back (cargo, trunk, accessibility), Under the hood (engine, performance). At each point, connect the feature to their stated needs. Let them touch, sit in, and explore the vehicle. Ask questions like 'How does this feel?' to keep them engaged.",
    keyPrinciples: [
      "Present only 2-3 vehicles max to avoid decision paralysis",
      "Use the Feature-Advantage-Benefit (FAB) method for every feature",
      "Connect every feature back to something they told you",
      "Let them touch, sit in, and explore the vehicle",
      "Limit information to 3 key features at a time",
      "Ask engagement questions throughout the presentation"
    ],
    commonMistakes: [
      "Showing too many vehicles — this overwhelms the customer and leads to indecision",
      "Talking about features without connecting them to benefits — features alone don't sell, benefits do"
    ],
    proTips: [
      "Pre-load the vehicle with their preferred radio station and temperature setting before the walk-around",
      "Use the '3-Feature Rule' — present only 3 features that directly address their stated needs, then stop"
    ],
    courseId: "customer-experience"
  },
  {
    step: 4,
    title: "Test Drive",
    detailedDesc: "The test drive is where emotion takes over from logic. Data shows that customers who take a test drive are 70% more likely to buy. The test drive isn't about the car's specifications — it's about how the car makes them feel. Your job during the test drive is to facilitate that emotional connection, not to sell. Let the customer experience the vehicle's performance, comfort, and features firsthand. The more positive emotions they associate with the vehicle, the more likely they are to buy.",
    whyItMatters: "The test drive is the moment when a customer goes from 'looking' to 'imagining ownership.' When they start saying 'I'd park it in the garage' or 'I'd take this on road trips,' they've already bought emotionally. Your role is to reinforce that emotional connection, not interrupt it with sales talk.",
    howToExecute: "Before the drive, pre-set the seat, mirrors, and radio to a good station. Plan a route that highlights different driving conditions (highway, hills, smooth roads). Let the customer drive first — you drive back. During the drive, stay quiet for the first few minutes to let them experience the vehicle. Then, highlight benefits that connect to their needs: 'Notice how smooth the ride is — you mentioned you have a long commute.' After the drive, ask: 'How did that feel?'",
    keyPrinciples: [
      "Pre-set seat, mirrors, and radio before the drive",
      "Plan a route that highlights different driving conditions",
      "Let the customer drive first — you drive back",
      "Stay quiet during the first few minutes of the drive",
      "Highlight benefits that connect to their stated needs",
      "Ask 'How did that feel?' after the drive, not 'What do you think?'"
    ],
    commonMistakes: [
      "Talking too much during the test drive — this prevents the customer from forming their own emotional connection",
      "Taking a boring route that doesn't showcase the vehicle's strengths"
    ],
    proTips: [
      "Point out a specific landmark or feature on the route that they'll remember — it creates a lasting positive association",
      "If they smile or laugh during the drive, note what caused it and reinforce it later during the numbers presentation"
    ],
    courseId: "customer-experience"
  },
  {
    step: 5,
    title: "Trade-In Appraisal",
    detailedDesc: "The trade-in appraisal is often a tension point in the sales process because customers overvalue their vehicles and salespeople need to provide a fair market value. Handle this step with transparency and empathy. Use third-party data sources like Kelley Blue Book or NADA to justify your offer. Separate the trade-in conversation from the new car deal to keep the numbers clear. A fair, transparent trade-in offer builds enormous trust and sets the stage for a smooth negotiation.",
    whyItMatters: "An unfair trade-in offer can destroy all the trust you've built. Customers talk to friends and family, and they'll quickly learn if they got a fair deal. A transparent trade-in process that's backed by data creates trust and reduces friction later in the deal.",
    howToExecute: "Ask about the trade-in early in the process — don't wait until the end. Inspect the vehicle thoroughly, noting condition, mileage, and any damage. Use third-party valuation tools transparently. Explain how you arrived at the number: 'Based on the condition, mileage, and market data, this vehicle is worth approximately $X.' Be prepared to justify your number. If the customer disagrees, offer to let them get a second opinion from CarMax or another dealer.",
    keyPrinciples: [
      "Ask about trade-in early in the process, not at the end",
      "Inspect thoroughly — walk around, note condition, mileage",
      "Use third-party data to justify your offer",
      "Be transparent about how you determined the value",
      "Separate the trade-in from the new car deal",
      "Offer a fair value — trust builds deals"
    ],
    commonMistakes: [
      "Waiting until the end of the deal to bring up the trade-in — this feels like a bait-and-switch",
      "Lowballing the trade-in to make up profit — this destroys trust and can kill the entire deal"
    ],
    proTips: [
      "If the trade-in has noticeable issues, take photos during the walk-around and show the customer — it makes the justification more transparent",
      "Offer to let them get a competing offer — the confidence that you'll match or beat it builds trust"
    ],
    courseId: "10-steps-part-1"
  },
  {
    step: 6,
    title: "Price Negotiation",
    detailedDesc: "Price negotiation is where most salespeople lose control. The key is to focus on value, not price. Before you discuss numbers, remind the customer of everything they loved about the vehicle. Use the 'value stack' — list all the features, benefits, warranty, and service that are included. When you present the price, do it with confidence. If the customer objects, don't immediately drop the price. Instead, find out what's really holding them back. Use silence as a powerful negotiation tool — the person who speaks first after the number is presented typically loses.",
    whyItMatters: "Every dollar you give away in negotiation comes directly from your commission and the dealership's profit. But more importantly, customers who pay full price for a fair value are happier than customers who get a discount but feel the process was adversarial. The goal is a win-win where the customer feels they got value and you protected your gross.",
    howToExecute: "Present the price with confidence: 'Here's the complete picture.' Break down the numbers line by line. If they object, use the 'If I... will you...' technique: 'If I can get the monthly payment to $X, will you take it home today?' Know your walk-away number before you start. Use silence after presenting the numbers. Trade concessions rather than giving them away — 'If I can do that, I'll need you to finance with us.'",
    keyPrinciples: [
      "Know your walk-away number before you start negotiating",
      "Focus on value, not just price",
      "Use silence as your most powerful negotiation tool",
      "Trade concessions, don't give them away",
      "Use the 'If I... will you...' technique",
      "Be willing to walk away — and mean it"
    ],
    commonMistakes: [
      "Dropping price immediately without understanding the objection — this devalues the vehicle and trains the customer to push harder",
      "Talking too much after presenting the number — silence is uncomfortable, but the person who breaks it first typically concedes"
    ],
    proTips: [
      "Write the numbers on paper — it makes them feel more real and harder to dispute than numbers on a screen",
      "Use the 'Feel, Felt, Found' pattern: 'I understand how you feel. Many customers have felt the same way. But what they found was...'"
    ],
    courseId: "advanced-closing"
  },
  {
    step: 7,
    title: "Closing the Sale",
    detailedDesc: "Closing is the natural conclusion to a well-executed sales process. If you've done everything right — built rapport, assessed needs, presented the right vehicle, handled the test drive, appraised the trade-in fairly, and negotiated transparently — the close should feel like a formality. The most common reason salespeople fail to close is simple: they don't ask. They're afraid of rejection. But closing is a service — you're helping the customer make a decision that improves their life. Ask with confidence, and if they say no, find out why and address it.",
    whyItMatters: "Studies show that 60% of sales are lost because the salesperson never asked for the commitment. Customers expect you to guide them through the decision. If you don't ask, they'll leave and buy from someone who will. The close is where all your hard work pays off.",
    howToExecute: "Use the assumptive close: 'Let's get the paperwork started.' Use the alternative close: 'Would you like the red or the blue?' Use the summary close: recap all the value you've presented. Use the question close: 'Is there any reason we can't move forward today?' After presenting the final numbers, stay silent. Count to 10 in your head if you have to. The first person to speak after the number is presented typically loses the negotiation.",
    keyPrinciples: [
      "Assume the sale — act as if the decision has already been made",
      "Use trial closes throughout the process",
      "Create legitimate urgency without being pushy",
      "Ask for the commitment directly",
      "Use the assumptive, alternative, and summary closes",
      "Stay silent after asking for the close"
    ],
    commonMistakes: [
      "Not asking for the sale — fear of rejection prevents more deals than any other factor",
      "Talking after asking for the close — this gives the customer reasons to say no"
    ],
    proTips: [
      "Use the 'Benjamin Franklin' close: list pros and cons on paper. The pros will always outweigh the cons, and they'll see it visually",
      "If they say 'I need to think about it,' isolate the objection: 'What specifically do you need to think through?'"
    ],
    courseId: "advanced-closing"
  },
  {
    step: 8,
    title: "Finance & Insurance (F&I)",
    detailedDesc: "The F&I presentation is where you maximize the value of the deal for both the customer and the dealership. After the customer has agreed to purchase, they're in a positive emotional state — this is the best time to introduce protection products. The key is to present these products as solutions to real problems, not as add-ons that increase the price. Explain the benefits clearly and simply. Use third-party data to show the value: 'The average repair cost for a transmission is $3,500. This warranty covers that for 7 years.'",
    whyItMatters: "F&I products protect the customer from unexpected expenses and generate significant profit for the dealership. A well-presented F&I menu can add $1,000-$2,000 per deal. But more importantly, customers who buy protection products are more satisfied because they feel protected and valued.",
    howToExecute: "Make a warm introduction to the F&I manager with a summary of the deal. Present protection products one at a time, starting with the most valuable. Explain each product in terms of the problem it solves, not the features it has. Use simple language and avoid jargon. Address objections by reframing the value: 'I understand it's an additional cost. Consider that one major repair could cost more than this entire warranty.' Complete the paperwork accurately and efficiently.",
    keyPrinciples: [
      "Present F&I products as solutions, not add-ons",
      "Explain benefits clearly and simply",
      "Use third-party data to demonstrate value",
      "Present products one at a time, starting with the most valuable",
      "Address objections by reframing the value",
      "Complete paperwork accurately and efficiently"
    ],
    commonMistakes: [
      "Rushing through the F&I presentation — this signals that the products aren't valuable",
      "Using jargon that confuses the customer — if they don't understand it, they won't buy it"
    ],
    proTips: [
      "Use the 'If you buy one thing, buy this' approach — it creates urgency and prioritization",
      "Share a real customer story where a protection product saved them money — stories are more persuasive than statistics"
    ],
    courseId: "digital-marketing"
  },
  {
    step: 9,
    title: "Delivery & Handover",
    detailedDesc: "The delivery experience is the most memorable part of the customer journey. It's the moment they've been waiting for, and it should be celebrated. A well-executed delivery creates a lasting positive impression that leads to repeat business and referrals. The vehicle should be spotless, full of gas, and ready to go. Take the customer through a thorough feature walkthrough, making sure they know how to use everything. Set up their phone and technology integration. Take a photo with them in front of the vehicle — this creates a shareable moment.",
    whyItMatters: "The delivery experience determines whether the customer becomes a repeat buyer and referral source. A poor delivery can undo all the goodwill you've built. A great delivery creates a customer for life. Studies show that customers who have a positive delivery experience are 3x more likely to refer others.",
    howToExecute: "Use the delivery checklist: vehicle is detailed and clean, full tank of gas, floor mats installed, keys and owner's manual ready, license plates/temporary tags installed. Walk through key features one at a time — don't overwhelm them. Point out safety features, explain the maintenance schedule, and set expectations for follow-up. Take a photo together and ask for a review. Send a thank-you note within 24 hours.",
    keyPrinciples: [
      "Vehicle must be spotless and full of gas",
      "Walk through key features one at a time",
      "Set up phone and technology integration",
      "Take a photo together for a shareable moment",
      "Send a thank-you note within 24 hours",
      "Set expectations for follow-up and service"
    ],
    commonMistakes: [
      "Rushing the delivery because the customer is eager to leave — this leads to confusion and frustration later",
      "Not setting up the phone integration — this is the #1 cause of post-delivery calls to the salesperson"
    ],
    proTips: [
      "Have a small gift (keychain, hat, or branded item) waiting in the vehicle — it's a small touch that creates a big impression",
      "Record a short video walkthrough of the key features and text it to them — they'll refer back to it later"
    ],
    courseId: "customer-experience"
  },
  {
    step: 10,
    title: "Follow-Up & Referrals",
    detailedDesc: "The sale doesn't end at the delivery — it's just the beginning of the relationship. The fortune is in the follow-up. Most salespeople never follow up after the sale, leaving money on the table. A systematic follow-up process generates repeat business, referrals, and positive reviews. The first 24 hours after delivery are critical — this is when the customer is most excited and most likely to refer others. After that, a regular touch-point cadence keeps you top-of-mind.",
    whyItMatters: "80% of sales are made between the 5th and 12th contact. Yet most salespeople stop after one or two follow-ups. A single customer who refers 3 people is worth more than 10 cold leads. Repeat customers spend 67% more than new customers. The follow-up is the highest-ROI activity a salesperson can do.",
    howToExecute: "Day 1: Thank-you call. Week 1: Check-in call to see how everything is going. Month 1: Satisfaction survey and service reminder. Month 3: Service reminder and referral request. Month 6: Referral request and update on new inventory. Year 1: Anniversary call and trade-in evaluation offer. Use a CRM to track all interactions. Every contact should add value — never 'just checking in.'",
    keyPrinciples: [
      "Send a thank-you note within 24 hours of delivery",
      "Make a follow-up call within the first week",
      "Schedule a 30-day check-in with the customer",
      "Ask for referrals at the right time — when they're happiest",
      "Track every interaction in a CRM",
      "Every contact must add value — never 'just checking in'"
    ],
    commonMistakes: [
      "Never following up after the sale — this leaves money on the table and loses future business",
      "Only contacting customers when you want something — this feels transactional and damages the relationship"
    ],
    proTips: [
      "Set a recurring reminder in your calendar to reach out to past customers — treat it as seriously as a customer appointment",
      "Use a handwritten note for the first follow-up — it's rare and memorable in a digital world"
    ],
    courseId: "digital-marketing"
  },
];

export const stepQuizzes: StepQuiz[] = [
  {
    step: 1,
    title: "Greeting & Building Rapport",
    questions: [
      {
        question: "What is the most important goal of the greeting?",
        options: [
          "To qualify the customer's budget immediately",
          "To build trust and make a positive first impression",
          "To show the customer every vehicle on the lot",
          "To get the customer's contact information"
        ],
        correctIndex: 1,
        explanation: "The greeting is about building trust and making a positive first impression. Qualifying, showing vehicles, and gathering contact info come later in the process."
      },
      {
        question: "What type of question should you open with?",
        options: [
          "A closed question like 'Can I help you?'",
          "An open-ended question like 'What brings you in today?'",
          "A leading question about budget",
          "A direct question about their timeline"
        ],
        correctIndex: 1,
        explanation: "Open-ended questions invite conversation. 'Can I help you?' is a closed question that invites a 'no' response and ends the conversation."
      },
      {
        question: "How quickly do customers form their first impression?",
        options: [
          "Within the first minute",
          "Within the first 10 seconds",
          "After the first 5 minutes of conversation",
          "After the test drive"
        ],
        correctIndex: 1,
        explanation: "Customers form their first impression within 10 seconds. This makes the opening moments of the greeting critical to the entire sales process."
      },
      {
        question: "What is the best way to make a customer feel welcomed?",
        options: [
          "Immediately start asking qualifying questions",
          "Give them a tour of the dealership",
          "Smile genuinely, make eye contact, and find common ground",
          "Hand them a brochure and let them browse alone"
        ],
        correctIndex: 2,
        explanation: "A genuine smile, eye contact, and finding common ground makes customers feel welcomed. Rushing to qualify or leaving them alone both miss the opportunity to build rapport."
      }
    ]
  },
  {
    step: 2,
    title: "Needs Assessment",
    questions: [
      {
        question: "What does the BANT framework stand for?",
        options: [
          "Budget, Authority, Need, Timeline",
          "Benefits, Approach, Negotiation, Terms",
          "Buyer, Action, Numbers, Test",
          "Budget, Ask, Negotiate, Trade"
        ],
        correctIndex: 0,
        explanation: "BANT stands for Budget, Authority, Need, Timeline. It's a framework for qualifying customers by understanding their financial range, decision-making power, requirements, and timing."
      },
      {
        question: "What percentage of the conversation should the customer speak during needs assessment?",
        options: [
          "About 50%",
          "About 80%",
          "About 20%",
          "About 60%"
        ],
        correctIndex: 1,
        explanation: "The customer should speak about 80% of the time. Your job is to listen and ask targeted questions, not to talk about vehicles."
      },
      {
        question: "Why is it important to summarize what the customer told you?",
        options: [
          "To fill silence in the conversation",
          "To confirm you understood their needs correctly",
          "To show off your listening skills",
          "To transition to the vehicle presentation"
        ],
        correctIndex: 1,
        explanation: "Summarizing confirms you understood their needs correctly and shows the customer you were listening. It's a trust-building technique that prevents miscommunication."
      },
      {
        question: "What should you do if a customer says 'I'm just looking'?",
        options: [
          "Walk away and let them browse",
          "Say 'Great! What kind of vehicle interests you?'",
          "Follow them silently around the lot",
          "Hand them a business card and leave"
        ],
        correctIndex: 1,
        explanation: "Acknowledge their statement and keep the conversation going with a gentle, open-ended question. 'I'm just looking' is often a defense mechanism, not a rejection."
      }
    ]
  },
  {
    step: 3,
    title: "Vehicle Presentation",
    questions: [
      {
        question: "What does the FAB method stand for?",
        options: [
          "Feature, Advantage, Benefit",
          "Find, Assess, Buy",
          "Feature, Ask, Bargain",
          "Facts, Advantages, Benefits"
        ],
        correctIndex: 0,
        explanation: "FAB stands for Feature, Advantage, Benefit. It's a method for presenting vehicle features by connecting each one to a specific customer advantage and benefit."
      },
      {
        question: "How many vehicles should you present to a customer?",
        options: [
          "As many as possible to show options",
          "2-3 vehicles max",
          "Only 1 vehicle",
          "4-5 vehicles to compare"
        ],
        correctIndex: 1,
        explanation: "Presenting 2-3 vehicles max prevents decision paralysis. Too many options overwhelm customers and make it harder for them to commit."
      },
      {
        question: "What is the walk-around sequence?",
        options: [
          "Interior, trunk, hood, wheels",
          "Front, side, interior, back, under the hood",
          "Back, front, interior, tires, engine",
          "Driver side, passenger side, trunk, hood"
        ],
        correctIndex: 1,
        explanation: "The proper walk-around sequence is: Front (grille, headlights), Side (lines, wheels), Interior (seats, technology), Back (cargo, trunk), Under the hood (engine, performance)."
      },
      {
        question: "What is the most important rule during vehicle presentation?",
        options: [
          "Show every available feature",
          "Connect features to the customer's stated needs",
          "Let the customer drive the vehicle",
          "Mention the price early"
        ],
        correctIndex: 1,
        explanation: "Every feature you highlight should connect directly back to something the customer told you during the needs assessment. This shows you were listening and that the vehicle is the right fit."
      }
    ]
  },
  {
    step: 4,
    title: "Test Drive",
    questions: [
      {
        question: "What percentage of customers who take a test drive are more likely to buy?",
        options: [
          "50%",
          "70%",
          "90%",
          "30%"
        ],
        correctIndex: 1,
        explanation: "Customers who take a test drive are 70% more likely to buy. The test drive creates an emotional connection that's essential for closing the deal."
      },
      {
        question: "Who should drive first during the test drive?",
        options: [
          "The salesperson",
          "The customer",
          "Whoever is more comfortable driving",
          "It doesn't matter"
        ],
        correctIndex: 1,
        explanation: "Let the customer drive first. They need to experience the vehicle themselves to form an emotional connection. You drive back to the dealership."
      },
      {
        question: "What should you do during the first few minutes of the test drive?",
        options: [
          "Point out every feature of the vehicle",
          "Stay quiet and let them experience the vehicle",
          "Discuss pricing and payment options",
          "Ask about their trade-in vehicle"
        ],
        correctIndex: 1,
        explanation: "Stay quiet during the first few minutes to let the customer experience the vehicle. Talking too much prevents them from forming their own emotional connection."
      },
      {
        question: "What is the best question to ask after the test drive?",
        options: [
          "'What do you think?'",
          "'How did that feel?'",
          "'Are you ready to buy?'",
          "'Did you like the acceleration?'"
        ],
        correctIndex: 1,
        explanation: "Ask 'How did that feel?' This focuses on the emotional experience rather than a logical evaluation. 'What do you think?' invites criticism, while 'How did that feel?' reinforces the positive experience."
      }
    ]
  },
  {
    step: 5,
    title: "Trade-In Appraisal",
    questions: [
      {
        question: "When should you ask about a trade-in?",
        options: [
          "At the very end of the process",
          "Early in the process",
          "After the test drive",
          "During the F&I presentation"
        ],
        correctIndex: 1,
        explanation: "Ask about the trade-in early in the process. Waiting until the end can feel like a bait-and-switch and makes the customer suspicious."
      },
      {
        question: "What should you use to justify your trade-in offer?",
        options: [
          "Your gut feeling about the vehicle's condition",
          "Third-party data like Kelley Blue Book or NADA",
          "What other customers have been offered",
          "The dealership's standard trade-in formula"
        ],
        correctIndex: 1,
        explanation: "Use third-party data sources like Kelley Blue Book or NADA to justify your offer. This provides an objective, trustworthy basis for the valuation."
      },
      {
        question: "How should you handle the trade-in appraisal?",
        options: [
          "Quickly and without much discussion",
          "Transparently, explaining how you determined the value",
          "As a separate negotiation from the new car deal",
          "Both B and C"
        ],
        correctIndex: 3,
        explanation: "Be transparent about how you determined the value AND separate the trade-in from the new car deal. Both practices build trust and keep the numbers clear."
      },
      {
        question: "What should you do if the customer disagrees with your trade-in offer?",
        options: [
          "Refuse to negotiate on the trade-in value",
          "Immediately increase the offer to keep them happy",
          "Offer to let them get a competing offer from another dealer",
          "Reduce the price of the new vehicle instead"
        ],
        correctIndex: 2,
        explanation: "Offering to let them get a competing offer shows confidence in your valuation and builds trust. If they find a better offer, you can match or beat it."
      }
    ]
  },
  {
    step: 6,
    title: "Price Negotiation",
    questions: [
      {
        question: "What should you do before presenting the price?",
        options: [
          "Remind the customer of the value they're getting",
          "Ask for their ideal price first",
          "Check with your manager for approval",
          "Mention any current promotions"
        ],
        correctIndex: 0,
        explanation: "Before presenting the price, recap the value. Remind them of everything they loved about the vehicle. This shifts the conversation from price to value."
      },
      {
        question: "What is your most powerful negotiation tool?",
        options: [
          "A lower price",
          "Silence",
          "Product knowledge",
          "A strong personality"
        ],
        correctIndex: 1,
        explanation: "Silence is your most powerful negotiation tool. After presenting the number, stay silent. The person who speaks first typically concedes something."
      },
      {
        question: "What is the 'If I... will you...' technique?",
        options: [
          "Asking for permission before showing a vehicle",
          "Trading a concession for a commitment",
          "Asking if they're ready to buy",
          "Offering a discount without conditions"
        ],
        correctIndex: 1,
        explanation: "The 'If I... will you...' technique trades a concession for a commitment. For example: 'If I can get the payment to $X, will you take it home today?' This ensures you don't give away concessions for free."
      },
      {
        question: "What is the #1 mistake in price negotiation?",
        options: [
          "Not knowing your walk-away number",
          "Dropping price immediately without understanding the objection",
          "Being too aggressive with the customer",
          "Not having manager approval"
        ],
        correctIndex: 1,
        explanation: "Dropping price immediately without understanding the objection devalues the vehicle and trains the customer to push harder. Always understand the objection first, then respond."
      }
    ]
  },
  {
    step: 7,
    title: "Closing the Sale",
    questions: [
      {
        question: "What percentage of sales are lost because the salesperson never asked for the commitment?",
        options: [
          "30%",
          "60%",
          "80%",
          "45%"
        ],
        correctIndex: 1,
        explanation: "60% of sales are lost because the salesperson never asked for the commitment. Fear of rejection is the #1 reason salespeople fail to close."
      },
      {
        question: "What is the assumptive close?",
        options: [
          "Asking if they want to buy the vehicle",
          "Acting as if the decision has already been made",
          "Assuming they'll need time to think about it",
          "Assuming they want a lower price"
        ],
        correctIndex: 1,
        explanation: "The assumptive close means acting as if the decision has already been made. Instead of asking 'Do you want to buy?' you say 'Let's get the paperwork started.'"
      },
      {
        question: "What should you do after asking for the commitment?",
        options: [
          "Immediately start explaining the benefits again",
          "Stay silent and wait for their response",
          "Ask if they have any questions",
          "Offer a discount to sweeten the deal"
        ],
        correctIndex: 1,
        explanation: "After asking for the commitment, stay silent. Count to 10 if you have to. The first person to speak after the ask typically concedes something."
      },
      {
        question: "What does the 'alternative close' do?",
        options: [
          "Gives the customer a choice between two positive options",
          "Offers a third option when they're stuck",
          "Presents the pros and cons of buying",
          "Asks if they need to think about it"
        ],
        correctIndex: 0,
        explanation: "The alternative close gives the customer a choice between two positive options: 'Would you like the red or the blue?' Either choice leads to a sale."
      }
    ]
  },
  {
    step: 8,
    title: "Finance & Insurance (F&I)",
    questions: [
      {
        question: "When is the best time to present F&I products?",
        options: [
          "Before the test drive",
          "After the customer has agreed to purchase",
          "During the vehicle presentation",
          "During the price negotiation"
        ],
        correctIndex: 1,
        explanation: "The best time to present F&I products is after the customer has agreed to purchase. They're in a positive emotional state and more receptive to additional value."
      },
      {
        question: "How should F&I products be presented?",
        options: [
          "As a bundle with a single price",
          "As solutions to real problems, one at a time",
          "As optional add-ons at the end of paperwork",
          "As required for financing approval"
        ],
        correctIndex: 1,
        explanation: "Present F&I products as solutions to real problems, one at a time. Explain the problem each product solves, then present the solution. This creates perceived value."
      },
      {
        question: "Why is it important to use third-party data in F&I?",
        options: [
          "It makes the presentation longer",
          "It shows the real cost of not having protection",
          "It's required by law",
          "It impresses the customer with your knowledge"
        ],
        correctIndex: 1,
        explanation: "Third-party data shows the real-world cost of not having protection. For example: 'The average transmission repair costs $3,500. This warranty covers that for 7 years.'"
      },
      {
        question: "What is the best way to handle an F&I objection?",
        options: [
          "Immediately lower the price of the product",
          "Reframe the value and share a customer story",
          "Tell the customer it's mandatory",
          "Skip to the next product"
        ],
        correctIndex: 1,
        explanation: "Reframe the value and share a customer story. Real stories about how protection products saved customers money are more persuasive than feature lists."
      }
    ]
  },
  {
    step: 9,
    title: "Delivery & Handover",
    questions: [
      {
        question: "What is the most important part of the delivery experience?",
        options: [
          "Getting the customer to leave quickly",
          "Making the customer feel celebrated and confident",
          "Completing all the paperwork",
          "Installing the license plates"
        ],
        correctIndex: 1,
        explanation: "The delivery should make the customer feel celebrated and confident in their purchase. This creates a lasting positive impression that leads to referrals and repeat business."
      },
      {
        question: "What is the #1 cause of post-delivery calls to the salesperson?",
        options: [
          "The vehicle has mechanical issues",
          "The customer can't set up their phone integration",
          "The customer lost their keys",
          "The customer forgot how to use features"
        ],
        correctIndex: 1,
        explanation: "Not setting up phone integration is the #1 cause of post-delivery calls. Always set up Bluetooth and phone connectivity before the customer leaves."
      },
      {
        question: "How soon should you send a thank-you note after delivery?",
        options: [
          "Within 24 hours",
          "Within a week",
          "Within a month",
          "At the first service appointment"
        ],
        correctIndex: 0,
        explanation: "Send a thank-you note within 24 hours of delivery. This is when the customer is most excited about their purchase and most likely to remember you positively."
      },
      {
        question: "What should you do during the delivery walkthrough?",
        options: [
          "Show them every feature at once",
          "Walk through key features one at a time",
          "Let them figure it out on their own",
          "Give them the owner's manual and let them read it"
        ],
        correctIndex: 1,
        explanation: "Walk through key features one at a time. Too much information at once is overwhelming. Focus on the features they'll use most often."
      }
    ]
  },
  {
    step: 10,
    title: "Follow-Up & Referrals",
    questions: [
      {
        question: "What percentage of sales are made between the 5th and 12th contact?",
        options: [
          "50%",
          "80%",
          "60%",
          "90%"
        ],
        correctIndex: 1,
        explanation: "80% of sales are made between the 5th and 12th contact. Yet most salespeople stop after one or two follow-ups. Persistence pays off."
      },
      {
        question: "What is the most important follow-up activity?",
        options: [
          "A sales pitch a week after delivery",
          "A thank-you call within 24 hours of delivery",
          "A monthly newsletter",
          "A referral request on the first call"
        ],
        correctIndex: 1,
        explanation: "A thank-you call within 24 hours is the most important follow-up. It shows you care about the customer beyond the sale and sets the tone for the ongoing relationship."
      },
      {
        question: "When is the best time to ask for a referral?",
        options: [
          "On the first follow-up call",
          "When the customer is happiest with their purchase",
          "At the one-year anniversary of the purchase",
          "During the price negotiation"
        ],
        correctIndex: 1,
        explanation: "Ask for referrals when the customer is happiest — typically right after delivery or after a positive service experience. This is when they're most likely to say yes."
      },
      {
        question: "What is the golden rule of follow-up?",
        options: [
          "Contact them as often as possible",
          "Every contact must add value — never 'just checking in'",
          "Only contact them when you have a special offer",
          "Let the customer initiate all follow-up"
        ],
        correctIndex: 1,
        explanation: "Every contact must add value. Never 'just checking in' — that's a waste of their time and yours. Share useful information, a maintenance tip, or a new inventory alert."
      }
    ]
  },
];