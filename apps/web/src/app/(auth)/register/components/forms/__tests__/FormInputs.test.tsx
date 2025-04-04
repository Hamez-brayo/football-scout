import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput, FormTextArea, FormSelect, FormCheckbox } from '../FormInputs';

describe('Form Input Components', () => {
  describe('FormInput', () => {
    const defaultProps = {
      label: 'Test Input',
      name: 'test',
      value: '',
      onChange: jest.fn(),
    };

    it('renders input with label', () => {
      render(<FormInput {...defaultProps} />);
      
      expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('shows required indicator', () => {
      render(<FormInput {...defaultProps} required />);
      
      const label = screen.getByText('Test Input');
      expect(label.parentElement).toContainElement(screen.getByText('*'));
    });

    it('handles value changes', () => {
      render(<FormInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('displays error message', () => {
      render(<FormInput {...defaultProps} error="Invalid input" />);
      
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveClass('border-red-300');
    });

    it('applies disabled state', () => {
      render(<FormInput {...defaultProps} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('bg-gray-100', 'cursor-not-allowed');
    });

    it('supports different input types', () => {
      render(<FormInput {...defaultProps} type="email" />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  describe('FormTextArea', () => {
    const defaultProps = {
      label: 'Test TextArea',
      name: 'test',
      value: '',
      onChange: jest.fn(),
    };

    it('renders textarea with label', () => {
      render(<FormTextArea {...defaultProps} />);
      
      expect(screen.getByLabelText('Test TextArea')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
    });

    it('handles value changes', () => {
      render(<FormTextArea {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'new text' } });
      
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('supports custom rows', () => {
      render(<FormTextArea {...defaultProps} rows={6} />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
    });
  });

  describe('FormSelect', () => {
    const defaultProps = {
      label: 'Test Select',
      name: 'test',
      value: '',
      onChange: jest.fn(),
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    };

    it('renders select with options', () => {
      render(<FormSelect {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('includes default empty option', () => {
      render(<FormSelect {...defaultProps} />);
      
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('handles value changes', () => {
      render(<FormSelect {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'option1' } });
      
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('displays error state', () => {
      render(<FormSelect {...defaultProps} error="Invalid selection" />);
      
      expect(screen.getByText('Invalid selection')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveClass('border-red-300');
    });
  });

  describe('FormCheckbox', () => {
    const defaultProps = {
      label: 'Test Checkbox',
      name: 'test',
      value: 'false',
      onChange: jest.fn(),
    };

    it('renders checkbox with label', () => {
      render(<FormCheckbox {...defaultProps} />);
      
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    });

    it('handles checked state', () => {
      render(<FormCheckbox {...defaultProps} value="true" />);
      
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('handles value changes', () => {
      render(<FormCheckbox {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('displays error message', () => {
      render(<FormCheckbox {...defaultProps} error="Required field" />);
      
      expect(screen.getByText('Required field')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toHaveClass('border-red-300');
    });
  });

  describe('Accessibility', () => {
    it('maintains label-input associations', () => {
      render(
        <div>
          <FormInput label="Name" name="name" value="" onChange={jest.fn()} />
          <FormTextArea label="Description" name="description" value="" onChange={jest.fn()} />
          <FormSelect
            label="Category"
            name="category"
            value=""
            onChange={jest.fn()}
            options={[{ value: 'test', label: 'Test' }]}
          />
          <FormCheckbox label="Agree" name="agree" value="false" onChange={jest.fn()} />
        </div>
      );

      const inputs = [
        screen.getByLabelText('Name'),
        screen.getByLabelText('Description'),
        screen.getByLabelText('Category'),
        screen.getByLabelText('Agree'),
      ];

      inputs.forEach(input => {
        expect(input).toHaveAttribute('id');
        expect(input.getAttribute('id')).toBe(input.getAttribute('name'));
      });
    });

    it('supports keyboard interaction', () => {
      render(
        <div>
          <FormInput label="Name" name="name" value="" onChange={jest.fn()} />
          <FormTextArea label="Description" name="description" value="" onChange={jest.fn()} />
          <FormSelect
            label="Category"
            name="category"
            value=""
            onChange={jest.fn()}
            options={[{ value: 'test', label: 'Test' }]}
          />
          <FormCheckbox label="Agree" name="agree" value="false" onChange={jest.fn()} />
        </div>
      );

      const inputs = screen.getAllByRole('textbox');
      const select = screen.getByRole('combobox');
      const checkbox = screen.getByRole('checkbox');

      inputs[0].focus();
      expect(document.activeElement).toBe(inputs[0]);

      fireEvent.keyDown(inputs[0], { key: 'Tab' });
      expect(document.activeElement).toBe(inputs[1]);

      fireEvent.keyDown(inputs[1], { key: 'Tab' });
      expect(document.activeElement).toBe(select);

      fireEvent.keyDown(select, { key: 'Tab' });
      expect(document.activeElement).toBe(checkbox);
    });
  });
}); 