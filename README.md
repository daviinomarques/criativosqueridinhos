# Criativos GS — Sales Page

## Estrutura de arquivos

```
/
├── index.html     ← página de vendas
├── style.css      ← todo o CSS
├── main.js        ← JavaScript compilado (use este no cPanel)
├── main.ts        ← TypeScript fonte (para referência / edição)
└── images/
    ├── hero-thumb.jpg              (thumb do vídeo hero — 16:9, ex 1280×720)
    ├── compare-bad.jpg             (bloco ANTES — 1024×1024)
    ├── compare-good.jpg            (bloco DEPOIS — 1024×1024)
    ├── aula-diabetes.jpg           (card aula 01 — 1024×1024)
    ├── aula-emagrecimento.jpg      (card aula 02 — 1024×1024)
    ├── aula-ed.jpg                 (card aula 03 — 1024×1024)
    ├── aula-rejuvenescimento.jpg   (card aula 04 — 1024×1024)
    ├── aula-dor-articular.jpg      (card aula 05 — 1024×1024)
    └── instrutor.jpg               (foto do instrutor — 1024×1024)
```

## Subir no cPanel

1. Acesse o **Gerenciador de Arquivos** do cPanel
2. Navegue até `public_html` (ou subdiretório desejado)
3. Faça upload de `index.html`, `style.css` e `main.js`
4. Crie a pasta `images/` e faça upload das imagens

## Configurações obrigatórias em main.js

Abra `main.js` e configure **duas variáveis**:

### 1. Link de checkout (linha ~19)
```js
_checkoutBase = ""; // ← cole aqui
// Exemplos:
// "go.hotmart.com/XXXXXXX"
// "pay.kiwify.com.br/XXXXXXX"
// "https://checkout.perfectpay.com.br/pay/XXXXXXX"
```

### 2. Link do vídeo (linha ~103)
```js
const videoUrl = ""; // ← cole aqui
// Exemplos:
// "https://vturb.com.br/v/XXXXXX"
// "https://pandavideo.com.br/embed/?v=XXXXXX"
// "https://www.youtube.com/watch?v=XXXXXX"
```

## UTM Passthrough — como funciona

O sistema captura automaticamente todos os parâmetros UTM da URL da página
e os repassa para o link de checkout.

**Parâmetros suportados:**
`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`,
`utm_id`, `fbclid`, `gclid`, `src`, `sck`, `ref`

**Exemplo de uso:**

URL da landing page:
```
https://seusite.com/?utm_source=facebook&utm_medium=paid&utm_campaign=diabetes_v1&fbclid=ABC123
```

Link de checkout gerado automaticamente:
```
https://go.hotmart.com/XXXXXXX?utm_source=facebook&utm_medium=paid&utm_campaign=diabetes_v1&fbclid=ABC123
```

**Rastreamento no Hotmart / Kiwify:**
- Hotmart: os parâmetros `src` e `sck` são rastreados nativamente
- Kiwify: `utm_source`, `utm_campaign` são exibidos no painel
- Ambas as plataformas também leem `fbclid` para atribuição do Facebook

## Configurações opcionais em index.html

| O que alterar | Onde buscar |
|---|---|
| Nome do instrutor | `[Seu Nome Aqui]` |
| Bio / credenciais | `[X produtos do mercado]` e `[R$ X em faturamento]` |
| Número de alunos | `data-counter="2000"` |
| Preço ancorado | `R$ 97,00` |
| Preço final | `R$ 47` e `3x de R$ 17,07` |
| % desconto | `52% OFF` |
| Garantia | `15 dias` (aparece em vários lugares) |

## Timer e datas

O contador regride automaticamente até **23:59:59** do dia atual.
As datas (`.dyn-date`) se atualizam sozinhas em PT-BR.
Nenhum backend necessário.

## Compilar TypeScript (opcional)

Se quiser editar `main.ts` e recompilar:
```bash
npx tsc main.ts --target ES2017 --strict
```
Ou use o `main.js` diretamente — já está totalmente funcional.
