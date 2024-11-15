import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

// Mock window.electron before tests
Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: {
      onSuggestionNotification: jest.fn(),
    },
  },
  writable: true,
});

describe('App', () => {
  it('should render', () => {
    expect(
      render(
        <Router>
          <App />
        </Router>,
      ),
    ).toBeTruthy();
  });
});
