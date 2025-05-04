import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Particles from '@/components/ui/particles';

interface FAQProps {
  question: string;
  answer: string;
}

const questions: FAQProps[] = [
  {
    question: 'What is StoryHero?',
    answer:
      'StoryHero is an AI‑powered clipping tool that takes any long video—like a YouTube video or Twitch stream of raw footage—and instantly finds the most engaging moments. It then automatically formats them into high-quality shorts, complete with captions, text hooks, and backgrounds so you can instantly publish reels, Shorts, or TikToks with zero manual editing.',
  },
  {
    question: 'Who is StoryHero for?',
    answer:
      'StoryHero is for anyone from people who want to share clips with their friends to gamers who aspire to become creators to experienced creators who want a way to repurpose their existing videos into high-quality shorts!',
  },
  {
    question: 'Can I upload my raw gameplay?',
    answer:
      'Yes! A lot of our users upload their footage to YouTube as unlisted and then paste the link into StoryHero. Alternatively, you can upload straight from your computer with the "Upload" button.',
  },
  {
    question: "Why should I post shorts when I'm making long-form content?",
    answer:
      'Short-form content is growing exponentially and like it or not, social media platforms like YouTube are pushing them hard! StoryHero was created as an easy way for creators to adapt and tap into a new viewer base of millions of people.',
  },
  {
    question: 'Will this decrease views on my long-form video?',
    answer:
      "While there are some users who consume content on multiple platforms, each social media platform tends to have completely different audiences and algorithms. For example, TikTok tends to skew way younger than YouTube. With the power of short-form content, you'll likely attract a completely new set of viewers!",
  },
  {
    question: 'Will short-form content dilute my brand?',
    answer:
      'Shorts content that perform will always be different in style for long-form content. For example, punchier visual hooks matter way more when scrolling. StoryHero implements all these learnings for you! If you want, you could always post to a burner account on TikTok to test it out. There are 100s of clippers on random accounts out there already reposting content.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      "We offer a free trial with 20 free credits! However, processing videos has a high cost so we can't offer refunds. You can cancel your plan at any time have your plan remain active until the end of the billing cycle.",
  },
  {
    question: 'Still have questions?',
    answer: `Join our discord community of creators and ask our staff team.`,
  },
];

function FAQ({ question, answer }: FAQProps) {
  return (
    <AccordionItem value={`${question}-${answer}`}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent>{answer}</AccordionContent>
    </AccordionItem>
  );
}

export default function FAQSection() {
  return (
    <div className="relative flex h-fit w-full justify-center">
      <section id="faq" className="relative z-10 container flex flex-col gap-8">
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <p className="text-2xl font-extrabold md:text-5xl">
            Frequently Asked Questions
          </p>
          <p className="text-muted-foreground text-sm md:text-lg">
            Your questions, answered.
          </p>
        </div>

        <Accordion className="mx-auto w-full max-w-3xl" type="single">
          {questions.map((question, index) => (
            <FAQ key={index} {...question} />
          ))}
        </Accordion>
      </section>
    </div>
  );
}
