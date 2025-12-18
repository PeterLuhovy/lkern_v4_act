/*
 * ================================================================
 * FILE: EmptyState.stories.tsx
 * PATH: /packages/ui-components/src/components/EmptyState/EmptyState.stories.tsx
 * DESCRIPTION: Storybook stories for EmptyState component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Icon or emoji to display',
    },
    title: {
      control: 'text',
      description: 'Main heading text',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Empty state component for displaying empty/no-data states with optional action button.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--theme-input-background, #fafafa)',
        borderRadius: '8px',
        padding: '40px'
      }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// ============================================================
// Basic Examples
// ============================================================

export const Default: Story = {
  args: {
    icon: '📭',
    title: 'No items found',
    description: 'Try adjusting your search or filters.',
  },
};

export const WithoutDescription: Story = {
  args: {
    icon: '🔍',
    title: 'No results',
  },
};

export const WithAction: Story = {
  args: {
    icon: '📝',
    title: 'No contacts yet',
    description: 'Get started by adding your first contact.',
    action: <Button variant="primary">Add Contact</Button>,
  },
};

// ============================================================
// Sizes
// ============================================================

export const SizeSmall: Story = {
  args: {
    icon: '📭',
    title: 'No items',
    description: 'Small empty state.',
    size: 'small',
  },
};

export const SizeMedium: Story = {
  args: {
    icon: '📭',
    title: 'No items found',
    description: 'Medium empty state (default).',
    size: 'medium',
  },
};

export const SizeLarge: Story = {
  args: {
    icon: '📭',
    title: 'No items found',
    description: 'Large empty state for full-page views.',
    size: 'large',
  },
};

// ============================================================
// Real-World Examples
// ============================================================

export const NoContacts: Story = {
  args: {
    icon: '👥',
    title: 'No contacts yet',
    description: 'Start building your network by adding your first contact.',
    action: (
      <Button variant="primary" icon="+" iconPosition="left">
        Add First Contact
      </Button>
    ),
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for contacts list.',
      },
    },
  },
};

export const NoSearchResults: Story = {
  args: {
    icon: '🔍',
    title: 'No results found',
    description: 'Try searching with different keywords or check your spelling.',
    action: <Button variant="secondary">Clear Search</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for search with no results.',
      },
    },
  },
};

export const NoOrders: Story = {
  args: {
    icon: '🛒',
    title: 'No orders yet',
    description: 'Your order history will appear here once you make your first purchase.',
    action: <Button variant="primary">Browse Products</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for orders list.',
      },
    },
  },
};

export const NoNotifications: Story = {
  args: {
    icon: '🔔',
    title: "You're all caught up!",
    description: 'No new notifications at the moment.',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for notifications (positive message).',
      },
    },
  },
};

export const NoMessages: Story = {
  args: {
    icon: '💬',
    title: 'No messages',
    description: 'Start a conversation by sending your first message.',
    action: <Button variant="primary">New Message</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for messages/inbox.',
      },
    },
  },
};

export const EmptyInbox: Story = {
  args: {
    icon: '📧',
    title: 'Inbox Zero!',
    description: "Great job! You've cleared all your emails.",
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for email inbox (achievement message).',
      },
    },
  },
};

export const NoFavorites: Story = {
  args: {
    icon: '⭐',
    title: 'No favorites yet',
    description: 'Mark items as favorites to find them quickly later.',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for favorites list.',
      },
    },
  },
};

export const NoFilterResults: Story = {
  args: {
    icon: '🔎',
    title: 'No items match your filters',
    description: 'Try removing some filters to see more results.',
    action: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary">Clear Filters</Button>
        <Button variant="ghost">Reset All</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state with multiple action buttons.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    icon: '⚠️',
    title: 'Unable to load data',
    description: 'Something went wrong. Please try again later or contact support.',
    action: <Button variant="primary">Retry</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state used as error state.',
      },
    },
  },
};

export const ComingSoon: Story = {
  args: {
    icon: '🚧',
    title: 'Coming Soon',
    description: 'This feature is currently under development. Check back later!',
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for features under development.',
      },
    },
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
      <div style={{
        background: 'var(--theme-input-background, #fafafa)',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <EmptyState
          icon="📭"
          title="Small Size"
          description="Compact empty state"
          size="small"
        />
      </div>
      <div style={{
        background: 'var(--theme-input-background, #fafafa)',
        borderRadius: '8px',
        padding: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <EmptyState
          icon="📭"
          title="Medium Size"
          description="Default empty state size"
          size="medium"
        />
      </div>
      <div style={{
        background: 'var(--theme-input-background, #fafafa)',
        borderRadius: '8px',
        padding: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <EmptyState
          icon="📭"
          title="Large Size"
          description="Full-page empty state"
          size="large"
        />
      </div>
    </div>
  ),
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: 'All available sizes side by side.',
      },
    },
  },
};

export const CommonIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      {[
        { icon: '📭', title: 'Empty List' },
        { icon: '🔍', title: 'No Results' },
        { icon: '👥', title: 'No Contacts' },
        { icon: '🛒', title: 'No Orders' },
        { icon: '⭐', title: 'No Favorites' },
        { icon: '💬', title: 'No Messages' },
        { icon: '📧', title: 'No Emails' },
        { icon: '🔔', title: 'No Notifications' },
        { icon: '⚠️', title: 'Error' },
      ].map((item, idx) => (
        <div
          key={idx}
          style={{
            background: 'var(--theme-input-background, #fafafa)',
            borderRadius: '8px',
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <EmptyState icon={item.icon} title={item.title} size="small" />
        </div>
      ))}
    </div>
  ),
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: 'Common icons used with EmptyState.',
      },
    },
  },
};
