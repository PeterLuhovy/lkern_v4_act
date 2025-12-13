/*
 * ================================================================
 * FILE: Textarea.test.tsx
 * PATH: /packages/ui-components/src/components/Textarea/Textarea.test.tsx
 * DESCRIPTION: Unit tests for Textarea component
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  // ================================================================
  // RENDERING TESTS
  // ================================================================
  describe('Rendering', () => {
    it('renders textarea element', () => {
      renderWithTranslation(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toBeInTheDocument();
      expect(screen.getByTestId('textarea').tagName).toBe('TEXTAREA');
    });

    it('renders with placeholder text', () => {
      renderWithTranslation(<Textarea placeholder="Enter description..." />);
      expect(screen.getByPlaceholderText('Enter description...')).toBeInTheDocument();
    });

    it('renders with specified rows', () => {
      renderWithTranslation(<Textarea data-testid="textarea" rows={6} />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('rows', '6');
    });

    it('applies custom className', () => {
      renderWithTranslation(<Textarea data-testid="textarea" className="custom-class" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
    });

    it('renders with default value', () => {
      renderWithTranslation(<Textarea data-testid="textarea" defaultValue="Initial text" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue('Initial text');
    });
  });

  // ================================================================
  // PROPS & VARIANTS TESTS
  // ================================================================
  describe('Props & Variants', () => {
    it('applies fullWidth class when fullWidth=true', () => {
      renderWithTranslation(<Textarea data-testid="textarea" fullWidth />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.className).toMatch(/textarea--fullWidth/);
    });

    it('does not apply fullWidth class when fullWidth=false', () => {
      renderWithTranslation(<Textarea data-testid="textarea" fullWidth={false} />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.className).not.toMatch(/textarea--fullWidth/);
    });

    it('applies error class when hasError=true', () => {
      renderWithTranslation(<Textarea data-testid="textarea" hasError />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.className).toMatch(/textarea--error/);
    });

    it('applies valid class when isValid=true', () => {
      renderWithTranslation(<Textarea data-testid="textarea" isValid />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.className).toMatch(/textarea--valid/);
    });

    it('does not apply valid class when both hasError and isValid are true', () => {
      renderWithTranslation(<Textarea data-testid="textarea" hasError isValid />);
      const textarea = screen.getByTestId('textarea');
      // Error takes precedence - valid should not be applied
      expect(textarea.className).toMatch(/textarea--error/);
      expect(textarea.className).not.toMatch(/textarea--valid/);
    });

    it('applies maxLength attribute', () => {
      renderWithTranslation(<Textarea data-testid="textarea" maxLength={500} />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });

    it('applies cols attribute', () => {
      renderWithTranslation(<Textarea data-testid="textarea" cols={40} />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('cols', '40');
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================
  describe('Interactions', () => {
    it('allows text input', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'Hello World');
      expect(textarea).toHaveValue('Hello World');
    });

    it('triggers onChange when typing', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<Textarea data-testid="textarea" onChange={handleChange} />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'Test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
      renderWithTranslation(<Textarea data-testid="textarea" disabled />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeDisabled();
    });

    it('does not allow input when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<Textarea data-testid="textarea" disabled onChange={handleChange} />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'Test');
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('triggers onFocus when focused', async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<Textarea data-testid="textarea" onFocus={handleFocus} />);
      const textarea = screen.getByTestId('textarea');

      await user.click(textarea);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('triggers onBlur when focus is lost', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(
        <>
          <Textarea data-testid="textarea" onBlur={handleBlur} />
          <button>Other element</button>
        </>
      );
      const textarea = screen.getByTestId('textarea');
      const button = screen.getByRole('button');

      await user.click(textarea);
      await user.click(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================
  describe('Accessibility', () => {
    it('has aria-invalid="false" by default', () => {
      renderWithTranslation(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('aria-invalid', 'false');
    });

    it('sets aria-invalid="true" when hasError is true', () => {
      renderWithTranslation(<Textarea data-testid="textarea" hasError />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLTextAreaElement>();
      renderWithTranslation(<Textarea ref={ref} data-testid="textarea" />);

      expect(ref.current).not.toBeNull();
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current?.tagName).toBe('TEXTAREA');
    });

    it('supports id attribute for label association', () => {
      renderWithTranslation(
        <>
          <label htmlFor="description-textarea">Description</label>
          <Textarea id="description-textarea" data-testid="textarea" />
        </>
      );

      const textarea = screen.getByLabelText('Description');
      expect(textarea).toBeInTheDocument();
    });

    it('supports aria-label attribute', () => {
      renderWithTranslation(<Textarea aria-label="Enter your comments" />);
      const textarea = screen.getByLabelText('Enter your comments');
      expect(textarea).toBeInTheDocument();
    });

    it('supports aria-describedby attribute', () => {
      renderWithTranslation(
        <>
          <Textarea data-testid="textarea" aria-describedby="help-text" />
          <span id="help-text">Maximum 500 characters</span>
        </>
      );

      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    });
  });

  // ================================================================
  // CSS & STYLING TESTS
  // ================================================================
  describe('CSS & Styling', () => {
    it('has textarea base class', () => {
      renderWithTranslation(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.className).toMatch(/textarea/);
    });

    it('applies multiple variant classes correctly', () => {
      renderWithTranslation(<Textarea data-testid="textarea" fullWidth hasError />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.className).toMatch(/textarea--fullWidth/);
      expect(textarea.className).toMatch(/textarea--error/);
    });
  });
});
