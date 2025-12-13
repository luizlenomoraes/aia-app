# AIA Eletrônico SEMA-AP (PWA)

Este é um aplicativo web progressivo (PWA) desenvolvido com React e Vite para fiscalização ambiental offline.

## Como usar este código

Este projeto foi migrado de Next.js para **Vite** para garantir funcionalidade offline simplificada.

### 1. Limpeza
Certifique-se de ter apagado as pastas antigas do Next.js (`app/`, `lib/`, `styles/`) para evitar conflitos.

### 2. Instalação Local
Se você baixou o código para seu computador:

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Para rodar em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Para gerar a versão final (Build) para hospedagem:
   ```bash
   npm run build
   ```

### 3. Hospedagem (Netlify Drop)
1. Rode `npm run build`.
2. Uma pasta chamada `dist` será criada.
3. Arraste essa pasta `dist` para o site do Netlify Drop.

### 4. Imagem do Logo
Certifique-se de que o arquivo `logo.png` esteja na raiz do projeto (junto com o `index.html`) ou na pasta `public/` antes de fazer o build.
