import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('some quando só há um idioma oferecido (português por enquanto)', () => {
    const { container } = render(<LanguageSwitcher />);
    expect(container).toBeEmptyDOMElement();
    const menu = render(<LanguageSwitcher variant="menu" />);
    expect(menu.container).toBeEmptyDOMElement();
  });
});
