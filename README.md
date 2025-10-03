# 📊 Dashboard Comercial Brisanet | Brisanet Commercial Dashboard

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success?style=for-the-badge&logo=github)](https://galafis.github.io/dashboard-brisanet-case/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)](https://plotly.com/)
[![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)

---

## 🌐 [**Acesse o Dashboard Ao Vivo**](https://galafis.github.io/dashboard-brisanet-case/) | [**Access Live Dashboard**](https://galafis.github.io/dashboard-brisanet-case/)

---

## 🇧🇷 Português

### 📋 Sobre o Projeto

Dashboard interativo profissional desenvolvido para análise comercial da Brisanet, simulando a qualidade e funcionalidades de plataformas como **Power BI** e **Looker Studio**. Este projeto demonstra competências avançadas em análise de dados, visualização interativa e desenvolvimento web.

O case comercial envolveu a análise de **15.000 clientes** e **5.000 vendas** realizadas entre janeiro e agosto de 2024, com faturamento total de **R$ 943.985,88**. O dashboard apresenta insights estratégicos sobre performance financeira, distribuição geográfica, perfil de clientes e oportunidades de crescimento.

### ✨ Características Principais

- **🎨 Design Profissional**: Interface moderna e responsiva inspirada em dashboards corporativos
- **📊 Visualizações Interativas**: Gráficos dinâmicos criados com Plotly.js
- **🔍 Análise Multidimensional**: Visões por faturamento, produtos, geografia, clientes e insights estratégicos
- **📈 KPIs em Tempo Real**: Indicadores-chave de performance com destaque visual
- **🗺️ Análise Geográfica**: Distribuição por estados, cidades e regiões
- **👥 Perfil de Clientes**: Segmentação por idade, gênero, renda e comportamento
- **💡 Insights Estratégicos**: Recomendações baseadas em análise de dados
- **📱 Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

### 🛠️ Tecnologias Utilizadas

#### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design system customizado com variáveis CSS e animações
- **JavaScript (ES6+)**: Lógica de negócio e manipulação de dados
- **Plotly.js**: Biblioteca de visualização de dados interativa
- **Font Awesome**: Ícones vetoriais
- **Google Fonts**: Tipografia profissional (Inter, JetBrains Mono)

#### Backend / Análise de Dados
- **Python 3.11**: Linguagem principal de análise
- **Pandas**: Manipulação e análise de dados
- **NumPy**: Computação numérica
- **JSON**: Formato de dados para integração frontend

### 📊 Estrutura de Dados

O projeto analisa quatro bases de dados principais:

1. **base_clientes.csv**: Informações de 10.000 clientes existentes
2. **base_vendas.csv**: Registro de 5.000 vendas realizadas
3. **base_produtos.csv**: Catálogo de produtos e serviços
4. **Informacoes_vendas.csv**: Dados complementares de vendas

### 🔍 Tratamento de Dados

O processo de análise incluiu tratamento rigoroso de inconsistências:

- ✅ Correção de regiões geográficas incorretas
- ✅ Remoção de datas futuras inválidas
- ✅ Consolidação de bases desconexas
- ✅ Validação de integridade referencial
- ✅ Criação de métricas derivadas

### 📈 Principais Insights

#### Performance Financeira
- **Faturamento Total**: R$ 943.985,88
- **Ticket Médio**: R$ 188,80
- **Faturamento Médio Mensal**: R$ 117.998,24

#### Clientes
- **Base Consolidada**: 15.000 clientes
- **Taxa de Churn**: 15,3%
- **Idade Média**: 45,9 anos
- **Renda Média**: R$ 10.694,42

#### Produtos
- **Mais Vendido**: Fibra 300MB
- **Maior Potencial de Upselling**: Migração para planos superiores
- **Oportunidade**: Pacotes convergentes (TV + Fibra)

#### Geografia
- **Estado Líder**: São Paulo
- **Cidade Líder**: Brasília
- **Oportunidade**: Expansão em cidades adjacentes

### 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/galafis/dashboard-brisanet-case.git

# Entre no diretório
cd dashboard-brisanet-case

# Inicie um servidor HTTP local
python -m http.server 8000

# Acesse no navegador
http://localhost:8000
```

### 📁 Estrutura do Projeto

```
dashboard-brisanet-case/
├── index.html              # Página principal do dashboard
├── css/
│   └── style.css          # Estilos customizados
├── js/
│   └── main.js            # Lógica do dashboard
├── data/
│   ├── analises.json      # Dados processados
│   ├── base_clientes.csv  # Base de clientes
│   ├── base_vendas.csv    # Base de vendas
│   ├── base_produtos.csv  # Base de produtos
│   └── Informacoes_vendas.csv
├── analysis/
│   └── data_processing.py # Script de tratamento de dados
├── docs/
│   └── insights_report.md # Relatório completo de insights
├── assets/
│   └── brisanet_logo.png  # Logo da empresa
└── README.md              # Este arquivo
```

### 💡 Recomendações Estratégicas

#### Curto Prazo (0-6 meses)
1. **Programa de Retenção Proativa**: Reduzir churn em 3-5 pontos percentuais
2. **Campanha de Upselling**: Aumentar ARPU em 15-20%
3. **Padronização de Vendas**: Elevar performance média da equipe em 10-15%

#### Médio Prazo (6-12 meses)
4. **Expansão Geográfica**: ROI 25%+ em novos mercados
5. **Produtos Premium**: Margem 30%+ superior
6. **Programa de Fidelidade**: Reduzir churn adicional em 2-3 pontos

#### Longo Prazo (12-24 meses)
7. **Transformação Digital**: Reduzir custos operacionais em 20-30%
8. **Diversificação de Portfólio**: Novas linhas de receita (10-15% do faturamento)
9. **Sustentabilidade e ESG**: Melhoria em valuation de 10-15%

### 📝 Metodologia

A análise foi conduzida utilizando técnicas avançadas de ciência de dados:

- **Limpeza e Tratamento**: Identificação e correção de inconsistências
- **Análise Exploratória**: Estatísticas descritivas e distribuições
- **Segmentação**: Clustering por valor, comportamento e perfil
- **Análise Temporal**: Tendências e sazonalidade
- **Análise Preditiva**: Modelagem de propensão a churn

### 🎯 Objetivos do Projeto

Este dashboard foi desenvolvido como parte de um processo seletivo, demonstrando:

- ✅ Capacidade de análise de dados complexos
- ✅ Habilidades de visualização e storytelling com dados
- ✅ Competência em desenvolvimento web frontend
- ✅ Pensamento estratégico e visão de negócio
- ✅ Atenção a detalhes e qualidade de entrega

### 👨‍💻 Autor

**Gabriel Demetrios Lafis**

Analista de Dados Senior com expertise em Business Intelligence, Data Science e Desenvolvimento Web.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-lafis)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/galafis)

### 📄 Licença

Este projeto foi desenvolvido para fins de demonstração de competências técnicas.

---

## 🇺🇸 English

### 📋 About the Project

Professional interactive dashboard developed for Brisanet's commercial analysis, simulating the quality and functionality of platforms like **Power BI** and **Looker Studio**. This project demonstrates advanced skills in data analysis, interactive visualization, and web development.

The commercial case involved analyzing **15,000 customers** and **5,000 sales** made between January and August 2024, with total revenue of **R$ 943,985.88**. The dashboard presents strategic insights on financial performance, geographic distribution, customer profile, and growth opportunities.

### ✨ Key Features

- **🎨 Professional Design**: Modern and responsive interface inspired by corporate dashboards
- **📊 Interactive Visualizations**: Dynamic charts created with Plotly.js
- **🔍 Multidimensional Analysis**: Views by revenue, products, geography, customers, and strategic insights
- **📈 Real-time KPIs**: Key performance indicators with visual highlights
- **🗺️ Geographic Analysis**: Distribution by states, cities, and regions
- **👥 Customer Profile**: Segmentation by age, gender, income, and behavior
- **💡 Strategic Insights**: Data-driven recommendations
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile

### 🛠️ Technologies Used

#### Frontend
- **HTML5**: Semantic and accessible structure
- **CSS3**: Custom design system with CSS variables and animations
- **JavaScript (ES6+)**: Business logic and data manipulation
- **Plotly.js**: Interactive data visualization library
- **Font Awesome**: Vector icons
- **Google Fonts**: Professional typography (Inter, JetBrains Mono)

#### Backend / Data Analysis
- **Python 3.11**: Main analysis language
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **JSON**: Data format for frontend integration

### 📊 Data Structure

The project analyzes four main databases:

1. **base_clientes.csv**: Information on 10,000 existing customers
2. **base_vendas.csv**: Record of 5,000 sales made
3. **base_produtos.csv**: Product and service catalog
4. **Informacoes_vendas.csv**: Complementary sales data

### 🔍 Data Treatment

The analysis process included rigorous treatment of inconsistencies:

- ✅ Correction of incorrect geographic regions
- ✅ Removal of invalid future dates
- ✅ Consolidation of disconnected databases
- ✅ Referential integrity validation
- ✅ Creation of derived metrics

### 📈 Key Insights

#### Financial Performance
- **Total Revenue**: R$ 943,985.88
- **Average Ticket**: R$ 188.80
- **Average Monthly Revenue**: R$ 117,998.24

#### Customers
- **Consolidated Base**: 15,000 customers
- **Churn Rate**: 15.3%
- **Average Age**: 45.9 years
- **Average Income**: R$ 10,694.42

#### Products
- **Best Seller**: Fiber 300MB
- **Highest Upselling Potential**: Migration to higher plans
- **Opportunity**: Convergent packages (TV + Fiber)

#### Geography
- **Leading State**: São Paulo
- **Leading City**: Brasília
- **Opportunity**: Expansion in adjacent cities

### 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/galafis/dashboard-brisanet-case.git

# Enter the directory
cd dashboard-brisanet-case

# Start a local HTTP server
python -m http.server 8000

# Access in browser
http://localhost:8000
```

### 📁 Project Structure

```
dashboard-brisanet-case/
├── index.html              # Main dashboard page
├── css/
│   └── style.css          # Custom styles
├── js/
│   └── main.js            # Dashboard logic
├── data/
│   ├── analises.json      # Processed data
│   ├── base_clientes.csv  # Customer database
│   ├── base_vendas.csv    # Sales database
│   ├── base_produtos.csv  # Product database
│   └── Informacoes_vendas.csv
├── analysis/
│   └── data_processing.py # Data processing script
├── docs/
│   └── insights_report.md # Complete insights report
├── assets/
│   └── brisanet_logo.png  # Company logo
└── README.md              # This file
```

### 💡 Strategic Recommendations

#### Short Term (0-6 months)
1. **Proactive Retention Program**: Reduce churn by 3-5 percentage points
2. **Upselling Campaign**: Increase ARPU by 15-20%
3. **Sales Standardization**: Elevate team average performance by 10-15%

#### Medium Term (6-12 months)
4. **Geographic Expansion**: 25%+ ROI in new markets
5. **Premium Products**: 30%+ higher margin
6. **Loyalty Program**: Additional 2-3 point churn reduction

#### Long Term (12-24 months)
7. **Digital Transformation**: Reduce operational costs by 20-30%
8. **Portfolio Diversification**: New revenue streams (10-15% of revenue)
9. **Sustainability and ESG**: 10-15% valuation improvement

### 📝 Methodology

The analysis was conducted using advanced data science techniques:

- **Cleaning and Treatment**: Identification and correction of inconsistencies
- **Exploratory Analysis**: Descriptive statistics and distributions
- **Segmentation**: Clustering by value, behavior, and profile
- **Temporal Analysis**: Trends and seasonality
- **Predictive Analysis**: Churn propensity modeling

### 🎯 Project Objectives

This dashboard was developed as part of a selection process, demonstrating:

- ✅ Ability to analyze complex data
- ✅ Data visualization and storytelling skills
- ✅ Frontend web development competence
- ✅ Strategic thinking and business vision
- ✅ Attention to detail and delivery quality

### 👨‍💻 Author

**Gabriel Demetrios Lafis**

Senior Data Analyst with expertise in Business Intelligence, Data Science, and Web Development.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-lafis)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/galafis)

### 📄 License

This project was developed for technical skills demonstration purposes.

---

**Desenvolvido com 💙 por Gabriel Demetrios Lafis | Developed with 💙 by Gabriel Demetrios Lafis**
