/* eslint-disable */
import { describe, it, expect, vi } from 'vitest'
import axios from 'axios';

import App, {
    Item,
    List,
    SearchForm,
    InputWithLabel,
} from './App';

import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';

vi.mock('axios');

describe('something truthy and falsy', () => {
    it('true to be true', () => {
        expect(true).toBe(true)
    });

    it('false to be false', () => {
        expect(false).toBe(false)
    });
});

const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
};
const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
};
const stories = [storyOne, storyTwo];

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne} />);
        expect(screen.getByText('React')).toBeTruthy();
        expect(screen.getByText('Jordan Walke')).toBeTruthy();
    });

    it('renders a clickable dismiss button', () => {
        render(<Item item={storyOne} />);
        expect(screen.getByRole('button')).toBeTruthy();
    });

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn();
        render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    });
})


describe('SearchForm', () => {
    const searchFormProps = {
        searchTerm: 'React',
        onSearchInput: vi.fn(),
        onSearchSubmit: vi.fn(),
    };

    it('renders the input field with its value', () => {
        render(<SearchForm {...searchFormProps} />);
        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    });


    it('calls onSearchInput on input field change', () => {
        render(<SearchForm {...searchFormProps} />);
        fireEvent.change(screen.getByDisplayValue('React'), {
            target: { value: 'Redux' },
        });
        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    });

    it('calls onSearchSubmit on button submit click', () => {
        render(<SearchForm {...searchFormProps} />);
        fireEvent.submit(screen.getByRole('button'));
        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });
});

describe('App', () => {
    it('succeeds fetching data', async () => {
        const promise = Promise.resolve({
            data: { hits: stories },
        });
        axios.get.mockImplementationOnce(() => promise);
        render(<App />);
        await waitFor(() => [
            expect(screen.getByText('React')).toBeTruthy(),
            expect(screen.getByText('Redux')).toBeTruthy(),
        ]);
    });

    it('fails fetching data', async () => {
        const promise = Promise.reject();
        axios.get.mockImplementationOnce(() => promise);
        render(<App />);
        await waitFor(() => [
            expect(screen.queryByText('React')).toBeNull(),
            expect(screen.queryByText('Redux')).toBeNull(),
            expect(screen.getByText('Something went wrong ...')).toBeTruthy(),
        ]);
    });
})