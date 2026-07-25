import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExpensesByCategoryChart from './ExpensesByCategoryChart';

describe('ExpensesByCategoryChart', () => {
  it('shows an empty state when there is no data', () => {
    render(<ExpensesByCategoryChart data={[]} />);
    expect(screen.getByText('No expense data available')).toBeInTheDocument();
  });

  it('renders category labels when given data', () => {
    render(
      <ExpensesByCategoryChart
        data={[
          { category: 'Food & Dining', total: 800 },
          { category: 'Transportation', total: 300 },
        ]}
      />
    );
    expect(screen.queryByText('No expense data available')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Food & Dining/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Transportation/).length).toBeGreaterThan(0);
  });
});
