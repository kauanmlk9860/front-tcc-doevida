import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import './FormattedInput.css';

const FormattedInput = forwardRef(({ 
  type = 'text',
  placeholder,
  className = '',
  onKeyPress,
  disabled,
  icon,
  formatType, // 'cpf', 'cnpj', 'cep', 'phone'
  onValidationChange,
  ...props 
}, ref) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();

  // Expor métodos para o componente pai
  useImperativeHandle(ref, () => ({
    get value() {
      return inputRef.current?.value || '';
    },
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur()
  }));

  // Funções de formatação
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Funções de validação
  const validateCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validação do dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  const validateCNPJ = (cnpj) => {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(numbers)) return false;
    
    // Validação do dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (digit1 !== parseInt(numbers.charAt(12))) return false;
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return digit2 === parseInt(numbers.charAt(13));
  };

  const validateCEP = (cep) => {
    const numbers = cep.replace(/\D/g, '');
    return numbers.length === 8;
  };

  const validatePhone = (phone) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  };

  // Aplicar formatação baseada no tipo
  const applyFormat = (inputValue) => {
    switch (formatType) {
      case 'cpf':
        return formatCPF(inputValue);
      case 'cnpj':
        return formatCNPJ(inputValue);
      case 'cep':
        return formatCEP(inputValue);
      case 'phone':
        return formatPhone(inputValue);
      default:
        return inputValue;
    }
  };

  // Validar baseado no tipo
  const validateInput = (inputValue) => {
    if (!inputValue.trim()) return { isValid: true, message: '' };
    
    switch (formatType) {
      case 'cpf':
        const isValidCPF = validateCPF(inputValue);
        return {
          isValid: isValidCPF,
          message: isValidCPF ? '' : 'CPF inválido'
        };
      case 'cnpj':
        const isValidCNPJ = validateCNPJ(inputValue);
        return {
          isValid: isValidCNPJ,
          message: isValidCNPJ ? '' : 'CNPJ inválido'
        };
      case 'cep':
        const isValidCEP = validateCEP(inputValue);
        return {
          isValid: isValidCEP,
          message: isValidCEP ? '' : 'CEP deve ter 8 dígitos'
        };
      case 'phone':
        const isValidPhone = validatePhone(inputValue);
        return {
          isValid: isValidPhone,
          message: isValidPhone ? '' : 'Telefone deve ter 10 ou 11 dígitos'
        };
      default:
        return { isValid: true, message: '' };
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = applyFormat(inputValue);
    
    setValue(formattedValue);
    
    // Validar apenas se o campo não estiver vazio
    if (formattedValue.trim()) {
      const validation = validateInput(formattedValue);
      setError(validation.message);
      
      if (onValidationChange) {
        onValidationChange(validation.isValid, validation.message);
      }
    } else {
      setError('');
      if (onValidationChange) {
        onValidationChange(true, '');
      }
    }
    
    // Atualizar o valor do input
    if (inputRef.current) {
      inputRef.current.value = formattedValue;
    }
  };

  const handleBlur = () => {
    if (value.trim()) {
      const validation = validateInput(value);
      setError(validation.message);
      
      if (onValidationChange) {
        onValidationChange(validation.isValid, validation.message);
      }
    }
  };

  return (
    <div className="formatted-input-container">
      <div className={`formatted-input-wrapper ${error ? 'has-error' : ''} ${icon ? 'has-icon' : ''}`}>
        {icon && (
          <div className="formatted-input-icon">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={`input formatted-input ${className}`}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={onKeyPress}
          disabled={disabled}
          value={value}
          {...props}
        />
      </div>
      {error && (
        <div className="formatted-input-error">
          {error}
        </div>
      )}
    </div>
  );
});

FormattedInput.displayName = 'FormattedInput';

export default FormattedInput;
