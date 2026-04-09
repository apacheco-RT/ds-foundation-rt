import type { Meta, StoryObj } from '@storybook/react';
import { Display, H1, H2, H3, H4, H5, BodyLarge, Body, BodySmall, Caption } from './Typography';

const meta: Meta = {
  title: 'Components/Typography',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
      <Body>The quick brown fox jumps over the lazy dog.</Body>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Display>Display</Display>
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <BodyLarge>Body Large — The quick brown fox.</BodyLarge>
      <Body>Body — The quick brown fox.</Body>
      <BodySmall>Body Small — The quick brown fox.</BodySmall>
      <Caption>Caption — Supporting text in muted tone.</Caption>
    </div>
  ),
};
