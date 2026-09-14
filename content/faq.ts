import type { Blok } from "./types";

export interface FaqBlok extends Blok {
  component: "faq_item";
  question: string;
  answer: string[];
}

/**
 * Frequently asked questions.
 *
 * SOURCING: every answer below is either carried across from the previous
 * site's own FAQ page, or is a fact recorded in the project notes. Nothing here
 * is invented, and nothing is stated more precisely than the source states it.
 * The answers are also emitted as FAQPage structured data, which is exactly the
 * wrong place to guess.
 */
export const faqs: FaqBlok[] = [
  {
    _uid: "faq-bde",
    component: "faq_item",
    question: "What is a BDE course?",
    answer: [
      "BDE stands for Beginner Driver Education. It is the driver training course approved by Ontario's Ministry of Transportation, and only an accredited provider can deliver it. We are one.",
      "Our course is {onlineHours} hours of coursework and {inCarMin} hours of in-car instruction, and the larger packages add in-car time on top of that. You finish with an MTO BDE certificate.",
    ],
  },
  {
    _uid: "faq-g1",
    component: "faq_item",
    question: "Do I need my G1 before I start in-car lessons?",
    answer: [
      "Yes. In-car lessons cannot begin until you have your G1.",
      "You can start the course itself without one. You are then required to obtain your G1 within a few weeks of completing the classroom portion of the programme, and plenty of students work through the online hours while they wait for a G1 test appointment.",
    ],
  },
  {
    _uid: "faq-approved",
    component: "faq_item",
    question: "Are you approved by the Ministry of Transportation?",
    answer: [
      "Yes. We are an accredited provider of Ministry-approved Beginner Driver Education courses.",
    ],
  },
  {
    _uid: "faq-eight-months",
    component: "faq_item",
    question: "How does the course get me a road test sooner?",
    answer: [
      "A G1 holder normally waits twelve months before they can book a G2 road test. Completing an approved BDE course reduces that wait to eight months.",
      "It applies to every package we sell, from {entryPackage} upwards.",
    ],
  },
  {
    _uid: "faq-insurance",
    component: "faq_item",
    question: "Will this reduce my insurance?",
    answer: [
      "Most Ontario insurers reduce premiums for a new driver who has achieved BDE certification. The exact saving depends on your insurer and your policy, so ask yours what they offer.",
    ],
  },
  {
    _uid: "faq-apart",
    component: "faq_item",
    question: "What sets North London Driving School apart?",
    answer: [
      "Experienced, accredited instructors who are professional, patient and supportive, with the training expertise to get you there efficiently.",
      "An award-winning school, with recognition including Best of London, Readers' Choice, Consumer Choice and Top Choice Awards.",
      "Flexible scheduling with weekend, daytime and evening lessons, online learning, interest-free payment plans, and transparent pricing with no hidden fees.",
      "Defensive driving techniques and safety strategies are covered in depth.",
    ],
  },
  {
    _uid: "faq-payment",
    component: "faq_item",
    question: "How do I pay, and can I pay in instalments?",
    answer: [
      "Flexible, interest-free payment plans are available and can be arranged directly with us. We accept cash, cheque, debit, e-transfer and credit card.",
      "If you buy a package on this website, payment is taken by Stripe and your card details never reach us.",
    ],
  },
  {
    _uid: "faq-book-test",
    component: "faq_item",
    question: "How do I book my road test?",
    answer: [
      "Through DriveTest, either at drivetest.ca or by calling 1.888.570.6110.",
      "You are also welcome to contact us directly and we will help you book it.",
    ],
  },
  {
    _uid: "faq-winter",
    component: "faq_item",
    question: "Is it harder to pass the road test in winter?",
    answer: [
      "Not if you are well trained. Our instructors have seen higher pass rates in winter, largely because the conditions call for slower turns and there is less emphasis on parking within a set distance of the kerb.",
      "Preparation still matters, and we will make sure you go into it ready.",
    ],
  },
  {
    _uid: "faq-prepare",
    component: "faq_item",
    question: "How should I prepare for an in-car lesson?",
    answer: [
      "Practise regularly. We recommend four to six hours of practice so you can perform at your best.",
      "Bring your driver's licence, and wear comfortable, appropriate footwear so you can operate the vehicle easily.",
      "If you are unwell, exhausted or under real stress, tell us and we will reschedule. Driving when you are not at your best affects both your performance and your safety.",
    ],
  },
  {
    _uid: "faq-lessons-cover",
    component: "faq_item",
    question: "What will the in-car lessons cover?",
    answer: [
      "The in-car hours cover vehicle handling, lane discipline, threshold braking, three-point turns, and parallel, hill and stall parking. You drive in the city, on rural roads and on the 401 and 402, and work through intersections with multiple turning lanes, one-way streets and construction zones.",
      "They also cover what to do when something goes wrong: collision avoidance, emergency braking with and without ABS, skid recovery when the weather allows, and recovering when a wheel drops onto the gravel shoulder.",
      "The full list is on the How It Works page.",
    ],
  },
  {
    _uid: "faq-cancel",
    component: "faq_item",
    question: "What if I need to cancel or reschedule a lesson?",
    answer: [
      "Tell us in advance and we will arrange another time. At least 24 hours' notice helps us manage the schedule and offer the slot to someone else.",
      "If we have to cancel for a vehicle problem, illness or severe weather, we will contact you by phone or email and get you back in as quickly as we can.",
    ],
  },
  {
    _uid: "faq-nervous",
    component: "faq_item",
    question: "I am very nervous about driving. Can you still teach me?",
    answer: [
      "Yes. We are experienced in teaching students with anxiety, students with zero experience, and seniors.",
      "Tell us when you call, and we will pace the lessons to suit you.",
      "During a lesson we keep control of the vehicle at all times and step in whenever it is needed, for your safety and that of everyone else on the road. That leaves you free to concentrate on learning.",
    ],
  },
  {
    _uid: "faq-seniors",
    component: "faq_item",
    question: "Do you teach seniors?",
    answer: [
      "Yes. Our school is open to all ages, and we offer two-hour lessons for drivers returning to the road or preparing for a senior licence review, separately from the full course.",
      "From the age of 80, Ontario drivers renew their licence every two years. If that is what you are preparing for, say so when you call.",
    ],
  },
  {
    _uid: "faq-areas",
    component: "faq_item",
    question: "Which areas do you cover?",
    answer: [
      "We teach in Komoka, Ilderton, Kilworth, Thorndale, Lucan, Delaware, St Thomas, and North, West, East and South London.",
      "Pick-up and drop-off for lessons covers London, Komoka and Ilderton. If you are outside that, call and ask.",
    ],
  },
  {
    _uid: "faq-open",
    component: "faq_item",
    question: "When are you open?",
    answer: [
      "We run four seasons a year, and our office and phone support are open Monday to Sunday, 8am to 8pm.",
      "The website is open around the clock if you would rather sign up for a course than ring. A phone call is preferred.",
    ],
  },
];
