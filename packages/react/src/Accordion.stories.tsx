import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: '400px' }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It comes with default styles matching the design system.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It uses CSS animations for smooth open and close transitions.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultipleOpen: StoryObj = {
  render: () => (
    <Accordion type="multiple" style={{ width: '400px' }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Payment Terms</AccordionTrigger>
        <AccordionContent>Net 30 days from invoice date. Early payment discount of 2% if paid within 10 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Settlement Instructions</AccordionTrigger>
        <AccordionContent>Wire transfers only. Provide SWIFT/BIC and IBAN. Reference payment ID in all correspondence.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Netting Rules</AccordionTrigger>
        <AccordionContent>Intercompany obligations are netted weekly. Threshold: $20M USD / €10M EUR.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
