import React from 'react'; // Ensure React is imported
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; // for additional matchers

import Blog from './Blog';

describe('Blog', () => {
  const blog = {
    title: 'Testing the testing',
    url: 'http://example.com',
    author: 'Ted Tester',
    likes: 10,
  };

  test('renders only title and author by default', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} handleVote={vi.fn()} handleDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Testing the testing')).toBeInTheDocument();
    expect(screen.queryByText('http://example.com')).toBeNull();
  });

  test('renders url and likes after clicking view', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Blog blog={blog} handleVote={vi.fn()} handleDelete={vi.fn()} />
      </MemoryRouter>
    );
    const button = screen.getByText('view');
    await user.click(button);

    expect(screen.getByText('http://example.com')).toBeInTheDocument();
    expect(screen.getByText('likes 10')).toBeInTheDocument();
  });

  test('clicking like twice calls event handler twice', async () => {
    const handleVote = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Blog blog={blog} handleVote={handleVote} handleDelete={vi.fn()} />
      </MemoryRouter>
    );
    const button = screen.getByText('view');
    await user.click(button);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(handleVote).toHaveBeenCalledTimes(2);
  });
});
