import type { Meta, StoryObj } from '@storybook/react';
import { PostCard } from '../PostCard';

const meta = {
  title: 'Components/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost = {
  post_id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Getting Started with Next.js 15',
  content: 'Next.js 15 introduces exciting new features including React 19 support, improved Server Components, and better performance optimizations. In this post, we will explore the key features and how to migrate your existing applications.',
  author: 'John Doe',
  slug: 'getting-started-nextjs-15',
  create_at: new Date().toISOString(),
  update_at: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    post: mockPost,
  },
};

export const LongContent: Story = {
  args: {
    post: {
      ...mockPost,
      title: 'Advanced TypeScript Patterns for React Developers',
      content: 'TypeScript has become an essential tool for modern React development. This comprehensive guide covers advanced patterns including generic components, discriminated unions, type guards, and more. We will dive deep into real-world examples and best practices that will help you write more type-safe and maintainable code.',
    },
  },
};
