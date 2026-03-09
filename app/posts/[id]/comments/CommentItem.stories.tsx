import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './CommentItem';

const meta = {
  title: 'Components/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComment = {
  comment_id: '123e4567-e89b-12d3-a456-426614174000',
  post_id: 'post-123',
  content: 'This is a great article! Thanks for sharing your knowledge. I learned a lot about Next.js and Server Components.',
  author: 'John Doe',
  create_at: new Date().toISOString(),
  update_at: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    comment: mockComment,
    postId: 'post-123',
  },
};

export const ShortComment: Story = {
  args: {
    comment: {
      ...mockComment,
      content: 'Great post!',
      author: 'Jane Smith',
    },
  },
};
