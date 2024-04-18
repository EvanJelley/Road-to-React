/* eslint-disable */
import { describe, it, expect } from 'vitest'

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
        screen.debug();
        expect(screen.getByText('React')).toBeTruthy();
        expect(screen.getByText('Jordan Walke')).toBeTruthy();
    });

    it('renders a clickable dismiss button', () => {
        render(<Item item={storyOne} />);
        expect(screen.getByRole('button')).toBeTruthy();
    });

    // it('clicking the dismiss button calls the callback handler', () => {
    //     const handleRemoveItem = jest.fn();
    //     render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
    //     fireEvent.click(screen.getByRole('button'));
    //     expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    // });
})
