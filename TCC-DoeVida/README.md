# 🩸 DoeVida - Plataforma de Doação de Sangue

<div align="center">

![DoeVida Logo](https://img.shields.io/badge/DoeVida-Salvando%20Vidas-990410?style=for-the-badge&logo=heart&logoColor=white)

**Uma plataforma moderna e intuitiva que conecta doadores de sangue com hospitais, facilitando o processo de doação e salvando vidas.**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

---

<<<<<<< HEAD
## 🌟 Sobre o Projeto

**DoeVida** é uma aplicação web desenvolvida como Trabalho de Conclusão de Curso (TCC) que revoluciona o processo de doação de sangue no Brasil. Nossa missão é **conectar doadores e hospitais** de forma eficiente, moderna e segura.

### 💡 Por que DoeVida?

- 🎯 **Facilita** o agendamento de doações
- 🏥 **Conecta** doadores com hospitais próximos
- 📊 **Acompanha** o histórico de doações
- 🔒 **Garante** segurança e privacidade dos dados
- 📱 **Responsivo** para todos os dispositivos

---

## ✨ Funcionalidades Principais

### 👤 Para Doadores
- ✅ **Cadastro Inteligente** com validação de CPF e dados pessoais
- 🩸 **Perfil Completo** com tipo sanguíneo e histórico
- 📅 **Agendamento Fácil** de doações
- 📸 **Upload de Foto** com drag & drop
- 🔐 **Login Seguro** com toggle de senha
- 📱 **Interface Responsiva** para mobile

### 🏥 Para Hospitais
- 🏢 **Cadastro Institucional** com validação de CNPJ
- ⏰ **Gestão de Horários** de funcionamento
- 👥 **Controle de Capacidade** de doadores
- 🤝 **Gestão de Convênios** aceitos
- 📊 **Dashboard** para acompanhamento

### 🎨 Experiência do Usuário
- 🌊 **Transições Suaves** entre páginas
- 🎯 **Formatação Automática** de campos (CPF, CNPJ, CEP)
- ⚠️ **Validação em Tempo Real** com feedback visual
- 🎨 **Design Moderno** com fonte Poppins
- ♿ **Acessibilidade** completa
- 🚪 **Modal de Confirmação** para logout

---

## 🛠️ Tecnologias Utilizadas

### Frontend
```javascript
{
  "framework": "React 19.1.1",
  "bundler": "Vite (Rolldown)",
  "routing": "React Router DOM 7.9.3",
  "styling": "CSS3 Moderno + Variáveis CSS",
  "typography": "Google Fonts (Poppins)",
  "icons": "SVG Customizados",
  "animations": "CSS Transitions & Keyframes"
}
```

### Componentes Desenvolvidos
- 🔧 **FormattedInput** - Inputs com formatação automática
- 📸 **PhotoUpload** - Upload de fotos com drag & drop
- 🔑 **PasswordInput** - Input de senha com toggle de visibilidade
- 🚪 **LogoutModal** - Modal de confirmação elegante
- 🎬 **AnimatedRoutes** - Transições entre páginas
- 🎨 **InputIcons** - Biblioteca de ícones SVG

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/kauanmlk9860/front-tcc-doevida.git
cd front-tcc-doevida/TCC-DoeVida
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
VITE_API_URL=http://localhost:8080/v1/doevida
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

### Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa o linter ESLint
```

---

## 📁 Estrutura do Projeto

```
TCC-DoeVida/
├── 📂 src/
│   ├── 📂 components/          # Componentes reutilizáveis
│   │   ├── 🔧 FormattedInput/  # Input com formatação
│   │   ├── 📸 PhotoUpload/     # Upload de fotos
│   │   ├── 🔑 PasswordInput/   # Input de senha
│   │   ├── 🚪 LogoutModal/     # Modal de logout
│   │   ├── 🎬 AnimatedRoutes/  # Roteamento animado
│   │   └── 🎨 InputIcons/      # Ícones SVG
│   ├── 📂 pages/               # Páginas da aplicação
│   │   ├── 🏠 Home/            # Página inicial
│   │   ├── 👤 Login/           # Login de doadores
│   │   ├── 📝 Cadastro/        # Cadastro de doadores
│   │   ├── 🏥 Hospital_Login/  # Login de hospitais
│   │   ├── 🏢 Hospital_cadastro/ # Cadastro de hospitais
│   │   ├── 📅 Protocolo_agendamento/ # Agendamento
│   │   ├── 🔒 Recuperar_senha/ # Recuperação de senha
│   │   ├── 🔄 Redefinir_senha/ # Redefinição de senha
│   │   └── ℹ️ Saiba_mais/      # Informações sobre doação
│   ├── 📂 services/            # Serviços e APIs
│   ├── 📂 assets/              # Imagens e recursos
│   └── 📄 main.jsx             # Ponto de entrada
├── 📄 package.json             # Dependências do projeto
├── 📄 vite.config.js           # Configuração do Vite
└── 📄 README.md                # Este arquivo
```

---

## 🎨 Design System

### Paleta de Cores
```css
:root {
  --brand: #990410;           /* Vermelho principal */
  --brand-dark: #7c0a14;     /* Vermelho escuro */
  --surface: #ffffff;         /* Fundo branco */
  --text-primary: #333333;    /* Texto principal */
  --text-secondary: #666666;  /* Texto secundário */
  --success: #28a745;         /* Verde de sucesso */
  --error: #dc3545;           /* Vermelho de erro */
}
```

### Tipografia
- **Fonte Principal**: Poppins (Google Fonts)
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)

### Componentes de Interface
- **Inputs**: Fundo vermelho com texto branco
- **Botões**: Estilo moderno com transições suaves
- **Modais**: Design elegante com backdrop blur
- **Ícones**: SVG customizados em branco/preto

---

## 🔒 Validações Implementadas

### Formatação Automática
- **CPF**: `000.000.000-00` com validação de dígito verificador
- **CNPJ**: `00.000.000/0000-00` com validação completa
- **CEP**: `00000-000` com validação de 8 dígitos
- **Telefone**: `(00) 00000-0000` para celular e fixo

### Validação de Arquivos
- **Tipos aceitos**: PNG, JPG, JPEG, GIF, WEBP
- **Tamanho máximo**: 5MB por arquivo
- **Preview em tempo real** da imagem selecionada

### Segurança
- **Validação client-side** para melhor UX
- **Sanitização** de dados de entrada
- **Proteção** contra XSS básico

---

## 🌐 Funcionalidades Avançadas

### Transições e Animações
- ✨ **Transições suaves** entre páginas
- 🎬 **Animações CSS** otimizadas
- 📱 **Responsividade** em todos os dispositivos
- ♿ **Respeita** `prefers-reduced-motion`

### Upload de Arquivos
- 📸 **Drag & Drop** intuitivo
- 👁️ **Preview** em tempo real
- ⚠️ **Validação** de tipo e tamanho
- 🗑️ **Remoção** fácil de arquivos

### Experiência do Usuário
- 🔍 **Feedback visual** em tempo real
- ⚡ **Performance otimizada**
- 🎯 **Acessibilidade** completa
- 📱 **Mobile-first** design

---

## 👥 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

---

## 📄 Licença

Este projeto é um Trabalho de Conclusão de Curso (TCC) desenvolvido para fins acadêmicos.

---

## 👨‍💻 Desenvolvedor

<div align="center">

**Desenvolvido com ❤️ por [Kauan MLK](https://github.com/kauanmlk9860)**

*"Cada linha de código foi escrita pensando em salvar vidas"*

[![GitHub](https://img.shields.io/badge/GitHub-kauanmlk9860-181717?style=flat&logo=github&logoColor=white)](https://github.com/kauanmlk9860)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-0A66C2?style=flat&logo=linkedin&logoColor=white)](#)

</div>

---

## 📞 Contato e Suporte

- 📧 **Email**: [seu-email@exemplo.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/kauanmlk9860/front-tcc-doevida/issues)
- 📖 **Documentação**: [Wiki do Projeto](https://github.com/kauanmlk9860/front-tcc-doevida/wiki)

---

<div align="center">

**🩸 DoeVida - Transformando vidas através da tecnologia 🩸**

*Feito com React ⚛️ e muito ❤️*

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐

</div>
=======
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---
>>>>>>> 42406b126c1138fe7e225114ce1bb9661d48a660
