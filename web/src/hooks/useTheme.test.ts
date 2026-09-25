import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('usa o tema salvo no localStorage', () => {
    localStorage.setItem('scriptorium:theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('aplica a classe dark no html quando o tema é escuro', () => {
    localStorage.setItem('scriptorium:theme', 'dark');
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('alterna o tema e persiste a escolha', () => {
    localStorage.setItem('scriptorium:theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('scriptorium:theme')).toBe('dark');
  });

  it('volta para claro e remove a classe dark', () => {
    localStorage.setItem('scriptorium:theme', 'dark');
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('scriptorium:theme')).toBe('light');
  });
});
