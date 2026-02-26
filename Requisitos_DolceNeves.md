**Dolce Neves**  Gourmet Sweets  |  Documento de Requisitos — v1.0

![ref1]

**Dolce Neves**

G O U R M E T   S W E E T S

Documento de Levantamento de Requisitos  •  v1.0  •  Fevereiro 2026

|**Produto**|Plataforma digital — site vitrine + sistema de pedidos + gestão interna|
| :-: | :- |
|**Stack**|Next.js (Vercel) + Supabase + WhatsApp API  |  Domínio: dolceneves.com.br|
|**Horizonte**|3 sprints de ~3 semanas  |  MVP completo em 9 semanas|
|**Clientes-alvo**|Pessoa Física (festas/presentes)  •  Empresas (eventos)  •  Revendedores|
|**Processo atual**|Sem processo digital definido — oportunidade zero a héro|

# **1. Contexto do Negócio**
A Dolce Neves opera atualmente sem processo digital definido. Os pedidos chegam de forma orgânica por indicações, sem registro, sem controle de agenda e sem ferramenta de precificação. O principal risco é perder vendas por ausência de visibilidade online e acumular prejuízo por precificação incorreta — especialmente em datas de alta demanda como Páscoa, Natal e festas de fim de ano.

Este documento define os requisitos para construir uma plataforma completa que resolve esses problemas em três pilares:

- Vitrine digital com alta conversão (site + cardápio + pedidos via WhatsApp)
- Gestão interna (precificação, agenda, controle de capacidade)
- Fidelização e autoridade de marca (QR Code, calculadora de festas, cupons)

# **2. Stakeholders**

|**Stakeholder**|**Papel**|**Principal interesse**|
| :- | :- | :- |
|**Dono(a) da Dolce Neves**|Product Owner / Admin|Controlar pedidos, precificar corretamente, não perder datas|
|**Cliente PF**|Usuário Final|Escolher doces facilmente e pedir via WhatsApp|
|**Empresa / Evento**|Usuário B2B|Solicitar grandes volumes com orçamento rápido|
|**Revendedor**|Parceiro Comercial|Consultar tabela de preços e fazer pedidos recorrentes|
|**Desenvolvedor**|Responsável Técnico|Stack simples, sem servidor próprio, custo zero|

# **3. Módulos do Sistema**

|**#**|**Módulo**|**Descrição**|
| :-: | :- | :- |
|**M1**|**Landing Page Vitrine**|Site público com galeria de produtos, depoimentos, botão WhatsApp flutuante e SEO local otimizado para buscas na cidade.|
|**M2**|**Cardápio & Monte sua Caixa**|Catálogo interativo com seleção de produtos, interface drag-and-drop para personalizar caixas e geração de pedido formatado para WhatsApp.|
|**M3**|**Ficha Técnica & Precificação**|Área interna para cadastrar ingredientes e calcular custo unitário por produto com sugestão de preço de venda baseado em margem.|
|**M4**|**Agenda de Encomendas**|CRUD de pedidos com calendário visual, alerta de capacidade máxima por data e visão semanal de entregas.|
|**M5**|**Fidelização**|Geração de QR Code por lote/pedido, página de feedback, cupom de desconto e calculadora de quantidade para festas.|

# **4. User Stories & Critérios de Aceite**
## **M1 — Landing Page Vitrine**

|**US-01  |**  Como visitante do site, quero visualizar fotos e descrições dos produtos da Dolce Neves, para que eu possa me sentir confiante para fazer um pedido.|
| :- |
|<p>**Critérios de Aceite:**</p><p>1. A página exibe no mínimo 8 fotos de alta qualidade dos produtos</p><p>2. Cada produto tem nome, descrição e preço (ou faixa de preço)</p><p>3. O site carrega em menos de 3 segundos em conexão móvel (LCP < 2,5 s)</p><p>4. A nota do Lighthouse para Performance é >= 85</p>|

|**US-02  |**  Como visitante do site, quero clicar em um botão de WhatsApp flutuante, para que eu possa iniciar um pedido sem sair da página.|
| :- |
|<p>**Critérios de Aceite:**</p><p>5. O botão fica fixo no canto inferior direito em todas as telas</p><p>6. Ao clicar, abre o WhatsApp com mensagem pré-formatada: 'Olá! Vi o site da Dolce Neves e gostaria de fazer um pedido.'</p><p>7. O número de WhatsApp é configurável pelo admin sem alterar código</p>|

|**US-03  |**  Como dono(a) da Dolce Neves, quero que o site apareça nas buscas de 'doces personalizados' na minha cidade, para que eu receba clientes orgânicos sem pagar anúncios.|
| :- |
|<p>**Critérios de Aceite:**</p><p>8. O site possui meta tags Open Graph e Twitter Card corretamente preenchidas</p><p>9. Arquivo sitemap.xml gerado automaticamente e enviado ao Google Search Console</p><p>10. Página /sobre com nome, cidade e história da Dolce Neves (NAP: Name, Address, Phone)</p><p>11. Google Structured Data (LocalBusiness schema) implementado</p>|

## **M2 — Cardápio & Monte sua Caixa**

|**US-04  |**  Como cliente, quero navegar pelo cardápio e ver os sabores disponíveis, para que eu possa escolher o que quero antes de contatar a loja.|
| :- |
|<p>**Critérios de Aceite:**</p><p>12. O cardápio exibe produtos agrupados por categoria (ex: Trufas, Bombons, Kits Presenteáveis)</p><p>13. Cada item tem foto, nome, ingredientes e preço unitário</p><p>14. Filtro por categoria funcional sem reload de página</p><p>15. O cardápio é editável pelo admin sem deploy (dados no Supabase)</p>|

|**US-05  |**  Como cliente, quero montar minha caixa de doces arrastando sabores, para que eu possa personalizar meu pedido de forma visual e divertida.|
| :- |
|<p>**Critérios de Aceite:**</p><p>16. A interface exibe uma caixa com slots configuráveis (9, 16 ou 25 unidades)</p><p>17. O cliente arrasta sabores da lista para os slots (drag-and-drop funcional no mobile/touch)</p><p>18. O sistema impede adicionar mais itens do que o limite da caixa escolhida</p><p>19. Ao finalizar, exibe resumo e botão 'Enviar pedido pelo WhatsApp' com mensagem formatada</p>|

|**US-06  |**  Como empresa ou revendedor, quero solicitar um orçamento para grande volume, para que eu receba uma resposta personalizada da Dolce Neves.|
| :- |
|<p>**Critérios de Aceite:**</p><p>20. Formulário de pedido corporativo: nome, empresa, quantidade, data do evento, contato</p><p>21. Ao submeter, gera mensagem WhatsApp com todos os dados preenchidos</p><p>22. Admin recebe os dados também no painel interno (Supabase)</p>|

## **M3 — Ficha Técnica & Precificação**

|**US-07  |**  Como dono(a) da Dolce Neves, quero cadastrar ingredientes com seus custos atuais, para que eu tenha uma base de insumos centralizada e atualizada.|
| :- |
|<p>**Critérios de Aceite:**</p><p>23. Tela de ingredientes: nome, unidade de medida (g, ml, un), custo por unidade, fornecedor</p><p>24. Ao editar o preço de um ingrediente, o sistema recalcula todas as fichas que o utilizam</p><p>25. Suporta no mínimo 200 ingredientes cadastrados</p>|

|**US-08  |**  Como dono(a) da Dolce Neves, quero montar a ficha técnica de cada produto, para que eu saiba o custo exato de produção e o preço justo de venda.|
| :- |
|<p>**Critérios de Aceite:**</p><p>26. A ficha vincula ingredientes com quantidades para um produto específico</p><p>27. O sistema calcula Custo Total = soma (ingrediente x quantidade)</p><p>28. Admin informa a margem desejada (%) e o sistema exibe o Preço de Venda Sugerido</p><p>29. Inclui custo de embalagem e mão-de-obra (horas × R$/hora)</p><p>30. Relatório exportável em PDF com a ficha completa</p>|

## **M4 — Agenda de Encomendas**

|**US-09  |**  Como dono(a) da Dolce Neves, quero registrar um novo pedido com data de entrega, para que eu tenha controle de tudo que preciso produzir.|
| :- |
|<p>**Critérios de Aceite:**</p><p>31. Formulário: cliente, telefone, produtos, quantidade, data de entrega, observações, valor total</p><p>32. Pedido salvo no Supabase e visível no calendário</p><p>33. Status: Pendente, Em Produção, Pronto, Entregue, Cancelado</p><p>34. Possível editar ou cancelar pedido existente</p>|

|**US-10  |**  Como dono(a) da Dolce Neves, quero receber alerta ao aceitar pedido em data com capacidade máxima atingida, para que eu evite overbooking em datas críticas como Páscoa e Natal.|
| :- |
|<p>**Critérios de Aceite:**</p><p>35. Admin define capacidade máxima de unidades por dia (configurável)</p><p>36. Ao cadastrar pedido, o sistema verifica se a soma de unidades naquele dia ultrapassa a capacidade</p><p>37. Se ultrapassar: 'Atenção: você já tem X unidades comprometidas nesta data. Capacidade máxima: Y'</p><p>38. Admin pode ignorar o aviso com confirmação explícita ou alterar a data</p>|

## **M5 — Fidelização**

|**US-11  |**  Como dono(a) da Dolce Neves, quero gerar QR Codes para colocar nas embalagens dos meus doces, para que meus clientes acessem uma página de agradecimento e feedback.|
| :- |
|<p>**Critérios de Aceite:**</p><p>39. Gera QR Code vinculado a um pedido específico</p><p>40. Ao escanear, cliente acessa página: 'Obrigado, [nome]! Avalie seu pedido da Dolce Neves.'</p><p>41. Formulário de NPS (nota 1-5 + comentário livre)</p><p>42. Opcionalmente exibe cupom de desconto para próxima compra</p><p>43. QR Code disponível para download em PNG</p>|

|**US-12  |**  Como visitante do site, quero calcular quantos doces preciso para minha festa, para que eu possa planejar minha compra com confiança.|
| :- |
|<p>**Critérios de Aceite:**</p><p>44. Calculadora pergunta: número de convidados, duração do evento, tipo de ocasião</p><p>45. Sistema sugere: quantidade de doces, variedades recomendadas e kits</p><p>46. Botão 'Fazer pedido com esta sugestão' abre WhatsApp com resumo formatado</p><p>47. Lógica de cálculo ajustável pelo admin (ex: 3 doces/pessoa para casamentos)</p>|

# **5. Requisitos Não-Funcionais**

|**⚡  Performance**|
| :- |
|- Tempo de carregamento inicial (FCP) < 2,5 segundos em 3G|
|- Lighthouse Performance Score >= 85 em mobile|
|- Imagens servidas em formato WebP com lazy loading ativado|
|- Next.js Image Optimization ativado — fotos dos doces otimizadas automaticamente|

|**🔒  Segurança**|
| :- |
|- Autenticação do admin via Supabase Auth (email + senha)|
|- Row Level Security (RLS) habilitado em todas as tabelas do Supabase|
|- HTTPS obrigatório (fornecido automaticamente pela Vercel)|
|- Dados de clientes não expostos publicamente — somente ao admin autenticado|

|**📱  Responsividade & Mobile-First**|
| :- |
|- Design mobile-first — 80%+ do tráfego esperado é via smartphone|
|- Interface testada nos breakpoints: 375px, 768px e 1280px|
|- Botão de WhatsApp com área de toque mínima de 44x44px (acessível com polegar)|
|- Drag-and-drop da caixa de doces funcional via touch em iOS e Android|

|**💰  Custo Operacional (Meta: R$ 40,00 total)**|
| :- |
|- Custo mensal zero no plano inicial — Vercel Free + Supabase Free|
|- Domínio dolceneves.com.br: investimento único de R$ 40,00/ano|
|- Sem servidor próprio — infraestrutura 100% gerenciada pelos provedores|
|- Limite de crescimento antes de upgrade: ~50.000 page views/mês e 500 MB de banco|

# **6. Matriz MoSCoW — Priorização**

|**MUST HAVE**|<p>- Landing page com SEO local (Dolce Neves + cidade)</p><p>- Botão WhatsApp flutuante com mensagem pré-formatada</p><p>- Cardápio digital editável pelo admin</p><p>- Interface Monte sua Caixa com drag-and-drop</p><p>- Ficha técnica de ingredientes com custo automático</p><p>- Agenda de pedidos (CRUD) com calendário visual</p><p>- Alerta de overbooking por data</p><p>- Autenticação do admin via Supabase Auth</p>|
| :-: | :- |
|**SHOULD HAVE**|<p>- Calculadora de quantidade para festas</p><p>- Geração de QR Code para embalagens</p><p>- Formulário de pedido corporativo / atacado</p><p>- Exportação de ficha técnica em PDF</p><p>- Notificação de novo pedido por e-mail para o admin</p>|
|**COULD HAVE**|<p>- Página de feedback pós-compra via QR Code</p><p>- Cupom de desconto gerado automaticamente</p><p>- Dashboard com gráfico de faturamento mensal</p><p>- Integração com Mercado Pago para PIX automático</p>|
|**WON'T HAVE (v1)**|<p>- App mobile nativo iOS/Android</p><p>- Integração com iFood / Rappi</p><p>- Estoque de ingredientes em tempo real</p><p>- Chatbot automatizado no WhatsApp</p>|

# **7. Plano de Sprints — 9 Semanas**

|**Sprint**|**Tema**|**Entregas-chave**|**Duração**|
| :-: | :-: | :-: | :-: |
|**Sprint 1**|**Visibilidade & Conversão**|Landing Page SEO + Cardápio digital + Botão WhatsApp + Deploy Vercel + Domínio ativo|~3 semanas|
|**Sprint 2**|**Pedidos & Gestão**|Monte sua Caixa (drag-and-drop) + Ficha Técnica + Agenda + Alerta de overbooking|~3 semanas|
|**Sprint 3**|**Experiência & Fidelização**|QR Code nas embalagens + Calculadora de festas + Pedido corporativo + Dashboard|~3 semanas|

# **8. Modelo de Dados — Supabase**

|**Tabela**|**Campos principais**|
| :- | :- |
|**products**|id, name, category, description, price, image\_url, active|
|**ingredients**|id, name, unit, cost\_per\_unit, supplier|
|**product\_ingredients**|product\_id, ingredient\_id, quantity|
|**orders**|id, client\_name, phone, items (jsonb), total\_price, delivery\_date, status, notes|
|**daily\_capacity**|date, max\_units, current\_units|
|**qr\_codes**|id, order\_id, url\_slug, discount\_code, feedback (jsonb)|

# **9. Restrições e Premissas**

|**Restrições Técnicas e Financeiras**|
| :- |
|- Orçamento inicial: R$ 40,00 (domínio dolceneves.com.br). Infraestrutura: Vercel Free + Supabase Free|
|- Sem integração com pagamento no MVP — pedidos fechados e pagos via WhatsApp (Pix manual)|
|- Um único administrador — multiplos usuários admin não fazem parte do escopo v1|
|- Plataforma web responsiva — sem app nativo na fase inicial|

|**Premissas do Projeto**|
| :- |
|- A Dolce Neves possui número de WhatsApp Business ativo no lançamento|
|- O cliente consegue fornecer fotos dos produtos com qualidade mínima (câmera smartphone >= 12MP)|
|- Conteúdo textual — nomes de produtos, descrições e preços — entregue antes do Sprint 1|
|- O desenvolvedor é responsável pelo deploy, configuração de DNS e onboarding inicial da plataforma|

# **10. Glossário**

|**Termo**|**Definição**|
| :- | :- |
|**MoSCoW**|Método de priorização: Must Have, Should Have, Could Have, Won't Have|
|**MVP**|Minimum Viable Product — versão mínima funcional para validar o negócio|
|**Overbooking**|Aceitar mais pedidos do que a capacidade de produção permite em uma data|
|**Ficha Técnica**|Documento com ingredientes, quantidades e custo unitário de um produto|
|**NPS**|Net Promoter Score — métrica de satisfação do cliente (nota 1 a 5 ou 1 a 10)|
|**RLS**|Row Level Security — controle de acesso por linha de tabela no Supabase|
|**LCP**|Largest Contentful Paint — métrica de performance do Google Lighthouse|
|**NAP**|Name, Address, Phone — dados usados pelo Google para ranqueamento de SEO local|


![ref2]

*Dolce Neves  •  Gourmet Sweets  •  Documento de Requisitos v1.0  •  Fevereiro 2026*

[ref1]: Aspose.Words.cbdc038f-d883-4946-9939-3b166b9da908.001.jpeg
[ref2]: Aspose.Words.cbdc038f-d883-4946-9939-3b166b9da908.002.jpeg
