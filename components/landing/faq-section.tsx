"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I add these stats to my GitHub README?",
    answer:
      "Simply copy and paste the markdown code provided in the dashboard. For example: `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername)`",
  },
  {
    question: "Are there any rate limits?",
    answer:
      "The public API is subject to GitHub's rate limits (5,000 requests per hour). For higher limits, you can deploy your own instance or authenticate with your GitHub token.",
  },
  {
    question: "Can I customize the appearance of the cards?",
    answer:
      "Yes! You can customize themes, layouts, colors, and which stats to display using URL parameters or through our interactive dashboard.",
  },
  {
    question: "Do you support private repositories?",
    answer:
      "Yes, but you'll need to use your own GitHub token with appropriate permissions and deploy your own instance of the application.",
  },
  {
    question: "How often are the stats updated?",
    answer:
      "Stats are cached for 6 hours by default to optimize performance and respect GitHub's rate limits. You can configure this in your own deployment.",
  },
  {
    question: "Can I contribute to this project?",
    answer:
      "We welcome contributions including new features, themes, translations, and bug fixes. Check out our GitHub repository for contribution guidelines.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="container py-24 space-y-12">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Common questions about GitHub Readme Stats
        </p>
      </motion.div>

      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}
