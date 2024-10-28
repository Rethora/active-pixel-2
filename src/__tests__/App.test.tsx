import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

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
