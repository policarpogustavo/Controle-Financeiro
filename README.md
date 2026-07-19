# Meu Dinheiro — Controle Financeiro (React)

Aplicação de controle financeiro pessoal construída em React (Vite) como peça de portfólio, explorando um stack diferente da versão em HTML/CSS/JS puro.

🔗 **Demo:** https://policarpogustavo.github.io/Controle-Financeiro/

## Funcionalidades

- Cadastro de receitas e despesas (descrição, valor, categoria, data)
- Resumo com saldo, receitas e despesas do período
- Filtro por mês
- Gráfico de despesas por categoria
- Gráfico de receitas x despesas dos últimos 6 meses
- Lista de transações com exclusão
- Persistência local (localStorage) — os dados ficam salvos no navegador
- Tema claro/escuro automático (segue a preferência do sistema)

## Stack

- React 19 + Vite
- CSS puro (sem framework de UI), variáveis de cor com paleta acessível (validada para daltonismo e contraste)
- SVG para o gráfico mensal, sem bibliotecas de gráficos externas

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Build de produção

```bash
npm run build
```
