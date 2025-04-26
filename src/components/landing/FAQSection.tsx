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
      'StoryHero is a platform that allows you to create engaging short-form content from your long videos.',
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
