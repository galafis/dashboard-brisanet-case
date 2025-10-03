/**
 * Dashboard Comercial Brisanet - Main JavaScript
 * Autor: Gabriel Demetrios Lafis
 */

// ============================================================================
// Global Variables
// ============================================================================
let dashboardData = null;
let currentSection = 'overview';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format number as Brazilian currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Format number with thousands separator
 */
function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Format percentage
 */
function formatPercent(value, decimals = 1) {
    return value.toFixed(decimals) + '%';
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// ============================================================================
// Data Loading
// ============================================================================

/**
 * Load dashboard data from JSON
 */
async function loadData() {
    try {
        const response = await fetch('data/analises.json');
        dashboardData = await response.json();
        return dashboardData;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return null;
    }
}

// ============================================================================
// Navigation
// ============================================================================

/**
 * Initialize navigation
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            navigateToSection(section);
        });
    });
}

/**
 * Navigate to a specific section
 */
function navigateToSection(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update active section
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Update page title
    const titles = {
        'overview': { title: 'Visão Geral', subtitle: 'Principais métricas e indicadores' },
        'revenue': { title: 'Faturamento', subtitle: 'Análise detalhada de receitas' },
        'products': { title: 'Produtos', subtitle: 'Performance por produto' },
        'geography': { title: 'Geografia', subtitle: 'Distribuição geográfica' },
        'customers': { title: 'Clientes', subtitle: 'Perfil e comportamento' },
        'insights': { title: 'Insights', subtitle: 'Recomendações estratégicas' }
    };
    
    document.getElementById('page-title').textContent = titles[section].title;
    document.getElementById('page-subtitle').textContent = titles[section].subtitle;
    
    currentSection = section;
}

// ============================================================================
// KPI Updates
// ============================================================================

/**
 * Update KPI cards with data
 */
function updateKPIs(data) {
    const kpis = data.kpis;
    
    // Overview KPIs
    document.getElementById('kpi-revenue').textContent = formatCurrency(kpis.faturamento_total_vendas);
    document.getElementById('kpi-sales').textContent = formatNumber(kpis.total_vendas);
    document.getElementById('kpi-ticket').textContent = formatCurrency(kpis.ticket_medio_vendas);
    document.getElementById('kpi-customers').textContent = formatNumber(kpis.total_clientes_consolidado);
    
    // Customer KPIs
    document.getElementById('kpi-active-customers').textContent = formatNumber(kpis.clientes_ativos);
    document.getElementById('kpi-churn').textContent = formatPercent(kpis.taxa_churn_percentual);
    document.getElementById('kpi-avg-age').textContent = Math.round(kpis.idade_media_clientes) + ' anos';
    document.getElementById('kpi-avg-income').textContent = formatCurrency(kpis.renda_media_clientes);
    
    // Footer info
    document.getElementById('last-update').textContent = formatDate(new Date());
    document.getElementById('period-range').textContent = 
        `${formatDate(kpis.periodo_analise_inicio)} - ${formatDate(kpis.periodo_analise_fim)}`;
}

// ============================================================================
// Chart Creation
// ============================================================================

/**
 * Create revenue monthly chart
 */
function createRevenueMonthlyChart(data) {
    const months = data.faturamento_mensal.map(d => d.ano_mes);
    const revenues = data.faturamento_mensal.map(d => d.faturamento);
    const quantities = data.faturamento_mensal.map(d => d.quantidade_vendas);
    
    const trace1 = {
        x: months,
        y: revenues,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Faturamento',
        line: { color: '#FF6B00', width: 3 },
        marker: { size: 8 },
        hovertemplate: '<b>%{x}</b><br>Faturamento: R$ %{y:,.2f}<extra></extra>'
    };
    
    const trace2 = {
        x: months,
        y: quantities,
        type: 'bar',
        name: 'Quantidade',
        yaxis: 'y2',
        marker: { color: '#3B82F6', opacity: 0.6 },
        hovertemplate: '<b>%{x}</b><br>Vendas: %{y}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        margin: { t: 20, r: 60, b: 60, l: 60 },
        xaxis: {
            gridcolor: '#2A3347',
            showgrid: false
        },
        yaxis: {
            title: 'Faturamento (R$)',
            gridcolor: '#2A3347',
            tickformat: ',.0f'
        },
        yaxis2: {
            title: 'Quantidade de Vendas',
            overlaying: 'y',
            side: 'right',
            gridcolor: '#2A3347',
            showgrid: false
        },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('chart-revenue-monthly', [trace1, trace2], layout, {responsive: true});
    Plotly.newPlot('chart-revenue-detailed', [trace1, trace2], layout, {responsive: true});
}

/**
 * Create customer status chart
 */
function createCustomerStatusChart(data) {
    const statusData = data.status_clientes;
    
    const trace = {
        labels: statusData.map(d => d.status),
        values: statusData.map(d => d.quantidade),
        type: 'pie',
        hole: 0.5,
        marker: {
            colors: ['#10B981', '#EF4444']
        },
        textinfo: 'label+percent',
        textfont: { color: '#FFFFFF', size: 14 },
        hovertemplate: '<b>%{label}</b><br>Quantidade: %{value}<br>%{percent}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: false,
        margin: { t: 20, r: 20, b: 20, l: 20 },
        height: 300
    };
    
    Plotly.newPlot('chart-customer-status', [trace], layout, {responsive: true});
}

/**
 * Create top states chart
 */
function createTopStatesChart(data) {
    const topStates = data.analise_estados.slice(0, 5);
    
    const trace = {
        x: topStates.map(d => d.faturamento_total),
        y: topStates.map(d => d.estado),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#FF6B00',
            opacity: 0.8
        },
        hovertemplate: '<b>%{y}</b><br>Faturamento: R$ %{x:,.2f}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: false,
        margin: { t: 20, r: 20, b: 40, l: 40 },
        xaxis: {
            gridcolor: '#2A3347',
            tickformat: ',.0f'
        },
        yaxis: {
            gridcolor: '#2A3347',
            autorange: 'reversed'
        },
        height: 300
    };
    
    Plotly.newPlot('chart-top-states', [trace], layout, {responsive: true});
}

/**
 * Create segments chart
 */
function createSegmentsChart(data) {
    const segments = data.analise_segmento;
    
    const trace = {
        labels: segments.map(d => d.segmento),
        values: segments.map(d => d.qtd_clientes),
        type: 'pie',
        marker: {
            colors: ['#FF6B00', '#3B82F6', '#10B981', '#F59E0B']
        },
        textinfo: 'label+percent',
        textfont: { color: '#FFFFFF', size: 12 },
        hovertemplate: '<b>%{label}</b><br>Clientes: %{value}<br>%{percent}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        margin: { t: 20, r: 20, b: 60, l: 20 },
        height: 300
    };
    
    Plotly.newPlot('chart-segments', [trace], layout, {responsive: true});
    Plotly.newPlot('chart-customers-segment', [trace], layout, {responsive: true});
}

/**
 * Create products analysis chart
 */
function createProductsAnalysisChart(data) {
    const products = data.analise_produtos;
    
    const trace = {
        x: products.map(d => d.produto),
        y: products.map(d => d.faturamento_total),
        type: 'bar',
        marker: {
            color: '#FF6B00',
            opacity: 0.8
        },
        hovertemplate: '<b>%{x}</b><br>Faturamento: R$ %{y:,.2f}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: false,
        margin: { t: 20, r: 20, b: 80, l: 60 },
        xaxis: {
            gridcolor: '#2A3347',
            tickangle: -45
        },
        yaxis: {
            title: 'Faturamento (R$)',
            gridcolor: '#2A3347',
            tickformat: ',.0f'
        }
    };
    
    Plotly.newPlot('chart-products-analysis', [trace], layout, {responsive: true});
}

/**
 * Create products share chart
 */
function createProductsShareChart(data) {
    const products = data.analise_produtos;
    
    const trace = {
        labels: products.map(d => d.produto),
        values: products.map(d => d.faturamento_total),
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: ['#FF6B00', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        },
        textinfo: 'label+percent',
        textfont: { color: '#FFFFFF', size: 11 },
        hovertemplate: '<b>%{label}</b><br>Faturamento: R$ %{value:,.2f}<br>%{percent}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: true,
        legend: { orientation: 'v', x: 1.1, y: 0.5 },
        margin: { t: 20, r: 120, b: 20, l: 20 }
    };
    
    Plotly.newPlot('chart-products-share', [trace], layout, {responsive: true});
}

/**
 * Create states revenue chart
 */
function createStatesRevenueChart(data) {
    const states = data.analise_estados;
    
    const trace = {
        x: states.map(d => d.estado),
        y: states.map(d => d.faturamento_total),
        type: 'bar',
        marker: {
            color: states.map(d => d.faturamento_total),
            colorscale: 'Oranges',
            showscale: true,
            colorbar: {
                title: 'Faturamento',
                tickformat: ',.0f'
            }
        },
        hovertemplate: '<b>%{x}</b><br>Faturamento: R$ %{y:,.2f}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: false,
        margin: { t: 20, r: 100, b: 60, l: 60 },
        xaxis: {
            gridcolor: '#2A3347',
            tickangle: -45
        },
        yaxis: {
            title: 'Faturamento (R$)',
            gridcolor: '#2A3347',
            tickformat: ',.0f'
        }
    };
    
    Plotly.newPlot('chart-states-revenue', [trace], layout, {responsive: true});
}

/**
 * Create regional distribution chart
 */
function createRegionalDistributionChart(data) {
    // Aggregate by region
    const regionMap = {};
    data.analise_estados.forEach(d => {
        if (!regionMap[d.regiao]) {
            regionMap[d.regiao] = 0;
        }
        regionMap[d.regiao] += d.faturamento_total;
    });
    
    const regions = Object.keys(regionMap);
    const values = Object.values(regionMap);
    
    const trace = {
        labels: regions,
        values: values,
        type: 'pie',
        marker: {
            colors: ['#FF6B00', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
        },
        textinfo: 'label+percent',
        textfont: { color: '#FFFFFF', size: 12 },
        hovertemplate: '<b>%{label}</b><br>Faturamento: R$ %{value:,.2f}<br>%{percent}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: true,
        legend: { orientation: 'v', x: 1.1, y: 0.5 },
        margin: { t: 20, r: 120, b: 20, l: 20 }
    };
    
    Plotly.newPlot('chart-regional-distribution', [trace], layout, {responsive: true});
}

/**
 * Create cities revenue chart
 */
function createCitiesRevenueChart(data) {
    const cities = data.analise_cidades;
    
    const trace = {
        x: cities.map(d => `${d.cidade} (${d.estado})`),
        y: cities.map(d => d.faturamento_total),
        type: 'bar',
        marker: {
            color: '#FF6B00',
            opacity: 0.8
        },
        hovertemplate: '<b>%{x}</b><br>Faturamento: R$ %{y:,.2f}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: false,
        margin: { t: 20, r: 20, b: 120, l: 60 },
        xaxis: {
            gridcolor: '#2A3347',
            tickangle: -45
        },
        yaxis: {
            title: 'Faturamento (R$)',
            gridcolor: '#2A3347',
            tickformat: ',.0f'
        },
        height: 400
    };
    
    Plotly.newPlot('chart-cities-revenue', [trace], layout, {responsive: true});
}

/**
 * Create age distribution chart
 */
function createAgeDistributionChart(data) {
    const ageData = data.analise_idade;
    
    const trace = {
        x: ageData.map(d => d.faixa_etaria),
        y: ageData.map(d => d.quantidade),
        type: 'bar',
        marker: {
            color: '#3B82F6',
            opacity: 0.8
        },
        hovertemplate: '<b>%{x}</b><br>Clientes: %{y}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: false,
        margin: { t: 20, r: 20, b: 60, l: 60 },
        xaxis: {
            gridcolor: '#2A3347',
            title: 'Faixa Etária'
        },
        yaxis: {
            title: 'Quantidade de Clientes',
            gridcolor: '#2A3347'
        }
    };
    
    Plotly.newPlot('chart-age-distribution', [trace], layout, {responsive: true});
}

/**
 * Create gender distribution chart
 */
function createGenderDistributionChart(data) {
    const genderData = data.analise_genero;
    
    const trace = {
        labels: genderData.map(d => d.genero),
        values: genderData.map(d => d.quantidade),
        type: 'pie',
        marker: {
            colors: ['#3B82F6', '#EF4444', '#10B981']
        },
        textinfo: 'label+percent',
        textfont: { color: '#FFFFFF', size: 12 },
        hovertemplate: '<b>%{label}</b><br>Clientes: %{value}<br>%{percent}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        margin: { t: 20, r: 20, b: 60, l: 20 }
    };
    
    Plotly.newPlot('chart-gender-distribution', [trace], layout, {responsive: true});
}

/**
 * Create top sellers chart
 */
function createTopSellersChart(data) {
    const sellers = data.analise_vendedores;
    
    const trace = {
        x: sellers.map(d => d.faturamento_total),
        y: sellers.map(d => d.vendedor),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#10B981',
            opacity: 0.8
        },
        hovertemplate: '<b>%{y}</b><br>Faturamento: R$ %{x:,.2f}<extra></extra>'
    };
    
    const layout = {
        plot_bgcolor: '#1A1F2E',
        paper_bgcolor: '#1A1F2E',
        font: { color: '#B8C5D6', family: 'Inter' },
        showlegend: false,
        margin: { t: 20, r: 20, b: 40, l: 100 },
        xaxis: {
            gridcolor: '#2A3347',
            tickformat: ',.0f'
        },
        yaxis: {
            gridcolor: '#2A3347',
            autorange: 'reversed'
        }
    };
    
    Plotly.newPlot('chart-top-sellers', [trace], layout, {responsive: true});
}

/**
 * Update products table
 */
function updateProductsTable(data) {
    const products = data.analise_produtos;
    const total = products.reduce((sum, p) => sum + p.faturamento_total, 0);
    const tbody = document.querySelector('#products-table tbody');
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><strong>${p.produto}</strong></td>
            <td>${formatCurrency(p.faturamento_total)}</td>
            <td>${formatNumber(p.qtd_vendas)}</td>
            <td>${formatCurrency(p.ticket_medio)}</td>
            <td>${formatPercent((p.faturamento_total / total) * 100)}</td>
        </tr>
    `).join('');
}

/**
 * Update revenue metrics
 */
function updateRevenueMetrics(data) {
    const revenues = data.faturamento_mensal.map(d => d.faturamento);
    const avg = revenues.reduce((a, b) => a + b, 0) / revenues.length;
    const max = Math.max(...revenues);
    const min = Math.min(...revenues);
    
    // Calculate growth (last vs first)
    const growth = ((revenues[revenues.length - 1] - revenues[0]) / revenues[0]) * 100;
    
    document.getElementById('metric-avg-monthly').textContent = formatCurrency(avg);
    document.getElementById('metric-max-monthly').textContent = formatCurrency(max);
    document.getElementById('metric-min-monthly').textContent = formatCurrency(min);
    document.getElementById('metric-growth').textContent = formatPercent(growth) + ' no período';
}

// ============================================================================
// Action Handlers
// ============================================================================

function refreshData() {
    location.reload();
}

function exportDashboard() {
    alert('Funcionalidade de exportação em desenvolvimento');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize dashboard
 */
async function init() {
    console.log('Inicializando dashboard...');
    
    // Load data
    const data = await loadData();
    
    if (!data) {
        console.error('Falha ao carregar dados');
        return;
    }
    
    console.log('Dados carregados:', data);
    
    // Update KPIs
    updateKPIs(data);
    
    // Create charts
    createRevenueMonthlyChart(data);
    createCustomerStatusChart(data);
    createTopStatesChart(data);
    createSegmentsChart(data);
    createProductsAnalysisChart(data);
    createProductsShareChart(data);
    createStatesRevenueChart(data);
    createRegionalDistributionChart(data);
    createCitiesRevenueChart(data);
    createAgeDistributionChart(data);
    createGenderDistributionChart(data);
    createTopSellersChart(data);
    
    // Update tables
    updateProductsTable(data);
    updateRevenueMetrics(data);
    
    // Initialize navigation
    initNavigation();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 500);
    
    console.log('Dashboard inicializado com sucesso!');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
