import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '../Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    nextPage: 2,
    prevPage: null,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
    nextPage: 4,
    prevPage: 2,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
    nextPage: null,
    prevPage: 4,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    nextPage: null,
    prevPage: null,
  },
};
