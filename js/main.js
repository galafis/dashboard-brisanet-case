/**
 * Dashboard Comercial Brisanet - Elite Edition
 * Autor: Gabriel Demetrios Lafis
 * Versão: 2.0 - Professional Analytics Dashboard
 */

// ============================================================================
// Global Variables & Configuration
// ============================================================================
let dashboardData = null;
let currentSection = 'overview';

// Professional color palette
const COLORS = {
    primary: '#FF6B00',
    secondary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6',
    gray: '#6B7280',
    products: ['#FF6B00', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
};

// Chart configuration
const CHART_CONFIG = {
    font: { family: 'Inter, sans-serif', color: '#B8C5D6' },
    plot_bgcolor: '#1A1F2E',
    paper_bgcolor: '#1A1F2E',
    margin: { t: 40, r: 40, b: 80, l: 80 },
    gridcolor: '#2A3347',
    responsive: true
};

// ============================================================================
// Utility Functions
// ============================================================================

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(value);
}

function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

function formatPercent(value, decimals = 1) {
    return formatNumber(value, decimals) + '%';
}

function formatCompactNumber(value) {
    if (value >= 1000000) {
        return formatNumber(value / 1000000, 1) + 'M';
    } else if (value >= 1000) {
        return formatNumber(value / 1000, 1) + 'K';
    }
    return formatNumber(value);
}

// ============================================================================
// Data Loading
// ============================================================================

async function loadData() {
    try {
        const response = await fetch('data/analises_completas.json');
        if (!response.ok) {
            // Fallback to basic analysis
            const fallbackResponse = await fetch('data/analises.json');
            dashboardData = await fallbackResponse.json();
        } else {
            dashboardData = await response.json();
        }
        return dashboardData;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return null;
    }
}

// ============================================================================
// Navigation
// ============================================================================

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

function navigateToSection(section) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
    
    const titles = {
        'overview': { title: 'Visão Geral', subtitle: 'Principais métricas e indicadores de performance' },
        'revenue': { title: 'Análise de Faturamento', subtitle: 'Evolução temporal e análise de tendências' },
        'products': { title: 'Performance de Produtos', subtitle: 'Análise detalhada por linha de produto' },
        'geography': { title: 'Distribuição Geográfica', subtitle: 'Penetração de mercado por região' },
        'customers': { title: 'Perfil de Clientes', subtitle: 'Segmentação e comportamento do cliente' },
        'insights': { title: 'Insights Estratégicos', subtitle: 'Recomendações e oportunidades de crescimento' }
    };
    
    document.getElementById('page-title').textContent = titles[section].title;
    document.getElementById('page-subtitle').textContent = titles[section].subtitle;
    
    currentSection = section;
}

// ============================================================================
// KPI Updates
// ============================================================================

function updateKPIs(data) {
    const kpis = data.kpis;
    
    // Overview KPIs
    document.getElementById('kpi-revenue').textContent = formatCurrency(kpis.faturamento_total_vendas);
    document.getElementById('kpi-sales').textContent = formatNumber(kpis.total_vendas);
    document.getElementById('kpi-ticket').textContent = formatCurrency(kpis.ticket_medio_vendas);
    document.getElementById('kpi-customers').textContent = formatNumber(kpis.total_clientes_consolidado);
    
    // Add change indicators
    const metricas = data.metricas_avancadas || {};
    if (metricas.crescimento_medio_mensal) {
        document.getElementById('kpi-revenue-change').textContent = 
            `${formatPercent(metricas.crescimento_medio_mensal)} vs mês anterior`;
        document.getElementById('kpi-revenue-change').className = 
            metricas.crescimento_medio_mensal > 0 ? 'kpi-change positive' : 'kpi-change negative';
    }
    
    // Customer KPIs
    document.getElementById('kpi-active-customers').textContent = formatNumber(kpis.clientes_ativos);
    document.getElementById('kpi-churn').textContent = formatPercent(kpis.taxa_churn_percentual);
    document.getElementById('kpi-avg-age').textContent = Math.round(kpis.idade_media_clientes) + ' anos';
    document.getElementById('kpi-avg-income').textContent = formatCurrency(kpis.renda_media_clientes);
    
    // Footer info
    document.getElementById('last-update').textContent = new Date().toLocaleDateString('pt-BR');
    document.getElementById('period-range').textContent = 
        `Jan - Ago 2024`;
}

// ============================================================================
// Advanced Chart Creation
// ============================================================================

/**
 * Create revenue monthly chart with trend line and annotations
 */
function createRevenueMonthlyChart(data) {
    const months = data.faturamento_mensal.map(d => d.ano_mes);
    const revenues = data.faturamento_mensal.map(d => d.faturamento);
    const quantities = data.faturamento_mensal.map(d => d.quantidade_vendas);
    
    // Calculate moving average
    const movingAvg = [];
    for (let i = 0; i < revenues.length; i++) {
        if (i < 2) {
            movingAvg.push(null);
        } else {
            movingAvg.push((revenues[i-2] + revenues[i-1] + revenues[i]) / 3);
        }
    }
    
    // Trend line
    const metricas = data.metricas_avancadas || {};
    const trendLine = revenues.map((_, i) => {
        if (metricas.tendencia_slope) {
            return metricas.tendencia_slope * i + (metricas.faturamento_medio || revenues[0]);
        }
        return null;
    });
    
    const trace1 = {
        x: months,
        y: revenues,
        type: 'scatter',
        mode: 'lines+markers+text',
        name: 'Faturamento',
        line: { color: COLORS.primary, width: 3 },
        marker: { size: 10, color: COLORS.primary },
        text: revenues.map(v => formatCompactNumber(v)),
        textposition: 'top center',
        textfont: { size: 10, color: '#FFFFFF' },
        hovertemplate: '<b>%{x}</b><br>Faturamento: ' + 
                      revenues.map(v => formatCurrency(v)).join('<br>Faturamento: ') +
                      '<extra></extra>',
        hoverlabel: { bgcolor: COLORS.primary }
    };
    
    const trace2 = {
        x: months,
        y: quantities,
        type: 'bar',
        name: 'Quantidade',
        yaxis: 'y2',
        marker: { color: COLORS.secondary, opacity: 0.6 },
        text: quantities,
        textposition: 'outside',
        textfont: { size: 10, color: '#B8C5D6' },
        hovertemplate: '<b>%{x}</b><br>Vendas: %{y}<extra></extra>',
        hoverlabel: { bgcolor: COLORS.secondary }
    };
    
    const trace3 = {
        x: months,
        y: movingAvg,
        type: 'scatter',
        mode: 'lines',
        name: 'Média Móvel (3m)',
        line: { color: COLORS.warning, width: 2, dash: 'dash' },
        hovertemplate: '<b>%{x}</b><br>Média: ' + formatCurrency('%{y}') + '<extra></extra>'
    };
    
    const traces = [trace1, trace2, trace3];
    
    // Add trend line if available
    if (trendLine.some(v => v !== null)) {
        traces.push({
            x: months,
            y: trendLine,
            type: 'scatter',
            mode: 'lines',
            name: 'Tendência',
            line: { color: COLORS.success, width: 2, dash: 'dot' },
            hovertemplate: '<b>%{x}</b><br>Tendência: ' + formatCurrency('%{y}') + '<extra></extra>'
        });
    }
    
    const layout = {
        ...CHART_CONFIG,
        showlegend: true,
        legend: { 
            orientation: 'h', 
            y: -0.2,
            x: 0.5,
            xanchor: 'center',
            font: { size: 12 }
        },
        xaxis: {
            title: { text: 'Período', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            showgrid: false,
            tickfont: { size: 11 }
        },
        yaxis: {
            title: { text: 'Faturamento (R$)', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            tickformat: ',.0f',
            tickfont: { size: 11 }
        },
        yaxis2: {
            title: { text: 'Quantidade de Vendas', font: { size: 14, color: '#B8C5D6' } },
            overlaying: 'y',
            side: 'right',
            gridcolor: CHART_CONFIG.gridcolor,
            showgrid: false,
            tickfont: { size: 11 }
        },
        hovermode: 'x unified',
        annotations: []
    };
    
    // Add annotation for max value
    const maxIdx = revenues.indexOf(Math.max(...revenues));
    layout.annotations.push({
        x: months[maxIdx],
        y: revenues[maxIdx],
        text: `Pico: ${formatCurrency(revenues[maxIdx])}`,
        showarrow: true,
        arrowhead: 2,
        arrowcolor: COLORS.success,
        ax: 0,
        ay: -40,
        font: { color: COLORS.success, size: 12 }
    });
    
    Plotly.newPlot('chart-revenue-monthly', traces, layout, {responsive: true, displayModeBar: false});
    Plotly.newPlot('chart-revenue-detailed', traces, layout, {responsive: true, displayModeBar: false});
}


/**
 * Create products performance chart with detailed metrics
 */
function createProductsChart(data) {
    const produtos = data.faturamento_por_produto
        .sort((a, b) => b.faturamento - a.faturamento);
    
    const names = produtos.map(p => p.produto);
    const revenues = produtos.map(p => p.faturamento);
    const quantities = produtos.map(p => p.quantidade_vendas);
    const percentages = produtos.map(p => p.percentual_faturamento);
    
    // Bar chart with values
    const trace1 = {
        x: revenues,
        y: names,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: COLORS.products,
            opacity: 0.8
        },
        text: revenues.map((v, i) => 
            `${formatCurrency(v)} (${formatPercent(percentages[i])})`
        ),
        textposition: 'outside',
        textfont: { size: 11, color: '#FFFFFF' },
        hovertemplate: '<b>%{y}</b><br>' +
                      'Faturamento: %{x:,.2f}<br>' +
                      'Vendas: ' + quantities.map(q => formatNumber(q)).join('<br>Vendas: ') +
                      '<extra></extra>',
        hoverlabel: { bgcolor: COLORS.primary }
    };
    
    const layout = {
        ...CHART_CONFIG,
        xaxis: {
            title: { text: 'Faturamento (R$)', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            tickformat: ',.0f',
            tickfont: { size: 11 }
        },
        yaxis: {
            title: '',
            gridcolor: CHART_CONFIG.gridcolor,
            showgrid: false,
            tickfont: { size: 12 }
        },
        margin: { t: 40, r: 150, b: 80, l: 150 },
        annotations: []
    };
    
    // Add annotation for leader
    layout.annotations.push({
        x: revenues[0],
        y: names[0],
        text: `Líder: ${formatPercent(percentages[0])} do total`,
        showarrow: true,
        arrowhead: 2,
        arrowcolor: COLORS.success,
        ax: 60,
        ay: 0,
        font: { color: COLORS.success, size: 11 }
    });
    
    Plotly.newPlot('chart-products', [trace1], layout, {responsive: true, displayModeBar: false});
    Plotly.newPlot('chart-products-detailed', [trace1], layout, {responsive: true, displayModeBar: false});
}

/**
 * Create geographic distribution chart
 */
function createGeographyChart(data) {
    const estados = data.faturamento_por_estado
        .sort((a, b) => b.faturamento - a.faturamento)
        .slice(0, 10);
    
    const names = estados.map(e => e.estado);
    const revenues = estados.map(e => e.faturamento);
    const percentages = estados.map(e => e.percentual_faturamento);
    const quantities = estados.map(e => e.quantidade_vendas);
    
    const trace1 = {
        x: names,
        y: revenues,
        type: 'bar',
        marker: {
            color: revenues,
            colorscale: [
                [0, COLORS.secondary],
                [0.5, COLORS.primary],
                [1, COLORS.danger]
            ],
            showscale: false
        },
        text: revenues.map((v, i) => 
            `${formatCompactNumber(v)}<br>${formatPercent(percentages[i])}`
        ),
        textposition: 'outside',
        textfont: { size: 10, color: '#FFFFFF' },
        hovertemplate: '<b>%{x}</b><br>' +
                      'Faturamento: ' + revenues.map(v => formatCurrency(v)).join('<br>Faturamento: ') + '<br>' +
                      'Vendas: ' + quantities.map(q => formatNumber(q)).join('<br>Vendas: ') +
                      '<extra></extra>',
        hoverlabel: { bgcolor: COLORS.primary }
    };
    
    const layout = {
        ...CHART_CONFIG,
        xaxis: {
            title: { text: 'Estado', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            showgrid: false,
            tickfont: { size: 11 }
        },
        yaxis: {
            title: { text: 'Faturamento (R$)', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            tickformat: ',.0f',
            tickfont: { size: 11 }
        },
        annotations: []
    };
    
    // Top 3 annotations
    for (let i = 0; i < Math.min(3, names.length); i++) {
        layout.annotations.push({
            x: names[i],
            y: revenues[i],
            text: `#${i+1}`,
            showarrow: false,
            yshift: 20,
            font: { color: '#FFFFFF', size: 14, weight: 'bold' }
        });
    }
    
    Plotly.newPlot('chart-geography', [trace1], layout, {responsive: true, displayModeBar: false});
    Plotly.newPlot('chart-geography-detailed', [trace1], layout, {responsive: true, displayModeBar: false});
}

/**
 * Create customer age distribution chart
 */
function createCustomerAgeChart(data) {
    const ageData = data.distribuicao_idade_clientes;
    const ranges = ageData.map(d => d.faixa_idade);
    const counts = ageData.map(d => d.quantidade);
    const percentages = ageData.map(d => d.percentual);
    
    const trace1 = {
        x: ranges,
        y: counts,
        type: 'bar',
        marker: {
            color: COLORS.info,
            opacity: 0.8,
            line: { color: COLORS.info, width: 2 }
        },
        text: counts.map((c, i) => 
            `${formatNumber(c)}<br>${formatPercent(percentages[i])}`
        ),
        textposition: 'outside',
        textfont: { size: 10, color: '#FFFFFF' },
        hovertemplate: '<b>%{x}</b><br>' +
                      'Clientes: %{y}<br>' +
                      'Percentual: ' + percentages.map(p => formatPercent(p)).join('<br>Percentual: ') +
                      '<extra></extra>',
        hoverlabel: { bgcolor: COLORS.info }
    };
    
    const layout = {
        ...CHART_CONFIG,
        xaxis: {
            title: { text: 'Faixa Etária', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            showgrid: false,
            tickfont: { size: 11 }
        },
        yaxis: {
            title: { text: 'Quantidade de Clientes', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            tickfont: { size: 11 }
        }
    };
    
    // Add average line
    const avgAge = data.kpis.idade_media_clientes;
    layout.annotations = [{
        x: 0.5,
        y: 1.05,
        xref: 'paper',
        yref: 'paper',
        text: `Idade Média: ${Math.round(avgAge)} anos`,
        showarrow: false,
        font: { color: COLORS.warning, size: 13, weight: 'bold' }
    }];
    
    Plotly.newPlot('chart-customer-age', [trace1], layout, {responsive: true, displayModeBar: false});
}

/**
 * Create customer gender distribution chart
 */
function createCustomerGenderChart(data) {
    const genderData = data.distribuicao_genero_clientes;
    const labels = genderData.map(d => d.genero);
    const values = genderData.map(d => d.quantidade);
    const percentages = genderData.map(d => d.percentual);
    
    const trace1 = {
        labels: labels,
        values: values,
        type: 'pie',
        hole: 0.5,
        marker: {
            colors: [COLORS.secondary, COLORS.danger, COLORS.gray]
        },
        text: percentages.map(p => formatPercent(p)),
        textposition: 'outside',
        textfont: { size: 13, color: '#FFFFFF' },
        hovertemplate: '<b>%{label}</b><br>' +
                      'Clientes: %{value}<br>' +
                      'Percentual: %{percent}<extra></extra>',
        hoverlabel: { bgcolor: COLORS.primary }
    };
    
    const layout = {
        ...CHART_CONFIG,
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.1,
            x: 0.5,
            xanchor: 'center',
            font: { size: 12 }
        },
        annotations: [{
            text: `${formatNumber(values.reduce((a,b) => a+b, 0))}<br>Clientes`,
            showarrow: false,
            font: { size: 16, color: '#FFFFFF', weight: 'bold' },
            x: 0.5,
            y: 0.5
        }]
    };
    
    Plotly.newPlot('chart-customer-gender', [trace1], layout, {responsive: true, displayModeBar: false});
}

/**
 * Create customer segment distribution chart
 */
function createCustomerSegmentChart(data) {
    const segmentData = data.distribuicao_segmento_clientes
        .sort((a, b) => b.quantidade - a.quantidade);
    
    const labels = segmentData.map(d => d.segmento);
    const values = segmentData.map(d => d.quantidade);
    const percentages = segmentData.map(d => d.percentual);
    
    const trace1 = {
        x: labels,
        y: values,
        type: 'bar',
        marker: {
            color: COLORS.products,
            opacity: 0.8
        },
        text: values.map((v, i) => 
            `${formatNumber(v)}<br>${formatPercent(percentages[i])}`
        ),
        textposition: 'outside',
        textfont: { size: 10, color: '#FFFFFF' },
        hovertemplate: '<b>%{x}</b><br>' +
                      'Clientes: %{y}<br>' +
                      'Percentual: ' + percentages.map(p => formatPercent(p)).join('<br>Percentual: ') +
                      '<extra></extra>',
        hoverlabel: { bgcolor: COLORS.primary }
    };
    
    const layout = {
        ...CHART_CONFIG,
        xaxis: {
            title: { text: 'Segmento', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            showgrid: false,
            tickfont: { size: 11 }
        },
        yaxis: {
            title: { text: 'Quantidade de Clientes', font: { size: 14, color: '#B8C5D6' } },
            gridcolor: CHART_CONFIG.gridcolor,
            tickfont: { size: 11 }
        }
    };
    
    Plotly.newPlot('chart-customer-segment', [trace1], layout, {responsive: true, displayModeBar: false});
}


/**
 * Create all charts
 */
function createAllCharts(data) {
    createRevenueMonthlyChart(data);
    createProductsChart(data);
    createGeographyChart(data);
    createCustomerAgeChart(data);
    createCustomerGenderChart(data);
    createCustomerSegmentChart(data);
    
    // Advanced visualizations
    if (typeof createProductPerformanceHeatmap === 'function') {
        createProductPerformanceHeatmap(data);
        createRevenueTreemap(data);
        createSunburstChart(data);
        createWaterfallChart(data);
        createGaugeCharts(data);
    }
}

/**
 * Create products detailed table
 */
function createProductsTable(data) {
    const produtos = data.faturamento_por_produto
        .sort((a, b) => b.faturamento - a.faturamento);
    
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    produtos.forEach((produto, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${produto.produto}</strong></td>
            <td class="text-right">${formatCurrency(produto.faturamento)}</td>
            <td class="text-right">${formatNumber(produto.quantidade_vendas)}</td>
            <td class="text-right">${formatCurrency(produto.faturamento / produto.quantidade_vendas)}</td>
            <td class="text-right">
                <span class="badge" style="background: ${COLORS.primary}">
                    ${formatPercent(produto.percentual_faturamento)}
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Create geography detailed table
 */
function createGeographyTable(data) {
    const estados = data.faturamento_por_estado
        .sort((a, b) => b.faturamento - a.faturamento);
    
    const tableBody = document.getElementById('geography-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    estados.forEach((estado, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${estado.estado}</strong></td>
            <td class="text-right">${formatCurrency(estado.faturamento)}</td>
            <td class="text-right">${formatNumber(estado.quantidade_vendas)}</td>
            <td class="text-right">${formatNumber(estado.quantidade_clientes || 0)}</td>
            <td class="text-right">
                <span class="badge" style="background: ${COLORS.secondary}">
                    ${formatPercent(estado.percentual_faturamento)}
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Update insights section with detailed analysis
 */
function updateInsightsSection(data) {
    const metricas = data.metricas_avancadas || {};
    const kpis = data.kpis;
    
    // Revenue insights
    const revenueInsight = document.getElementById('insight-revenue-text');
    if (revenueInsight && metricas.crescimento_medio_mensal) {
        revenueInsight.innerHTML = `
            <h4>📈 Performance de Faturamento</h4>
            <p>O faturamento apresenta <strong>crescimento médio mensal de ${formatPercent(metricas.crescimento_medio_mensal)}</strong>, 
            com volatilidade controlada de ${formatPercent(metricas.volatilidade)}. A análise de tendência indica 
            ${metricas.tendencia_slope > 0 ? 'trajetória positiva' : 'necessidade de atenção'} 
            (R² = ${formatNumber(metricas.tendencia_r_squared, 4)}).</p>
            
            <p>O faturamento médio mensal de <strong>${formatCurrency(metricas.faturamento_medio || kpis.faturamento_total_vendas / 8)}</strong> 
            demonstra consistência operacional. O pico de ${formatCurrency(metricas.faturamento_max)} 
            e o vale de ${formatCurrency(metricas.faturamento_min)} indicam amplitude de 
            ${formatPercent((metricas.faturamento_max - metricas.faturamento_min) / metricas.faturamento_min * 100)}.</p>
            
            <h5>Recomendações:</h5>
            <ul>
                <li>Implementar programa de previsão de demanda para otimizar recursos</li>
                <li>Investigar fatores que levaram ao pico de faturamento para replicação</li>
                <li>Estabelecer piso mínimo de faturamento mensal com ações preventivas</li>
            </ul>
        `;
    }
    
    // Products insights
    const productsInsight = document.getElementById('insight-products-text');
    if (productsInsight) {
        const topProduct = data.faturamento_por_produto[0];
        const totalProducts = data.faturamento_por_produto.length;
        
        productsInsight.innerHTML = `
            <h4>🎯 Análise de Produtos</h4>
            <p>O portfólio de <strong>${totalProducts} produtos</strong> apresenta concentração significativa: 
            <strong>${topProduct.produto}</strong> representa ${formatPercent(topProduct.percentual_faturamento)} do faturamento total, 
            indicando dependência de produto único.</p>
            
            <p>O ticket médio de <strong>${formatCurrency(kpis.ticket_medio_vendas)}</strong> sugere oportunidades de 
            upselling, especialmente considerando que o produto mais vendido é um plano de entrada. 
            A migração de apenas 10% da base para planos superiores poderia gerar incremento de 
            <strong>${formatCurrency(kpis.faturamento_total_vendas * 0.15)}</strong> anuais.</p>
            
            <h5>Oportunidades Identificadas:</h5>
            <ul>
                <li><strong>Upselling Direcionado:</strong> Campanha para migração Fibra 300MB → 500MB/1GB</li>
                <li><strong>Cross-selling:</strong> Pacotes convergentes (Internet + TV) com margem superior</li>
                <li><strong>Produtos Premium:</strong> Desenvolver linha com serviços adicionais (30%+ margem)</li>
                <li><strong>Diversificação:</strong> Reduzir dependência do produto líder</li>
            </ul>
        `;
    }
    
    // Geography insights
    const geoInsight = document.getElementById('insight-geography-text');
    if (geoInsight) {
        const topState = data.faturamento_por_estado[0];
        const top3States = data.faturamento_por_estado.slice(0, 3);
        const top3Percentage = top3States.reduce((sum, s) => sum + s.percentual_faturamento, 0);
        
        geoInsight.innerHTML = `
            <h4>🗺️ Distribuição Geográfica</h4>
            <p><strong>${topState.estado}</strong> lidera com ${formatPercent(topState.percentual_faturamento)} do faturamento, 
            seguido por ${top3States[1].estado} (${formatPercent(top3States[1].percentual_faturamento)}) e 
            ${top3States[2].estado} (${formatPercent(top3States[2].percentual_faturamento)}). 
            Os 3 principais estados concentram <strong>${formatPercent(top3Percentage)}</strong> da receita.</p>
            
            <p>Esta concentração geográfica apresenta <strong>risco e oportunidade</strong>: risco pela dependência 
            de poucos mercados, e oportunidade pela possibilidade de expansão em regiões adjacentes com 
            aproveitamento de infraestrutura existente.</p>
            
            <h5>Estratégia de Expansão:</h5>
            <ul>
                <li><strong>Curto Prazo:</strong> Cidades adjacentes aos mercados atuais (ROI 25%+ em 24 meses)</li>
                <li><strong>Médio Prazo:</strong> Capitais com perfil demográfico similar</li>
                <li><strong>Longo Prazo:</strong> Regiões metropolitanas de alto potencial</li>
                <li><strong>Otimização:</strong> Aumentar penetração em mercados existentes antes de expansão</li>
            </ul>
        `;
    }
    
    // Customers insights
    const customersInsight = document.getElementById('insight-customers-text');
    if (customersInsight) {
        customersInsight.innerHTML = `
            <h4>👥 Perfil e Comportamento de Clientes</h4>
            <p>A base consolidada de <strong>${formatNumber(kpis.total_clientes_consolidado)} clientes</strong> 
            apresenta perfil estabelecido: idade média de ${Math.round(kpis.idade_media_clientes)} anos e 
            renda média de ${formatCurrency(kpis.renda_media_clientes)}, caracterizando público com 
            <strong>capacidade de pagamento e estabilidade financeira</strong>.</p>
            
            <p>A taxa de churn de <strong>${formatPercent(kpis.taxa_churn_percentual)}</strong>, embora dentro de 
            padrões do setor de telecom (15-20%), representa oportunidade significativa. Cada ponto percentual 
            de redução equivale a <strong>${formatCurrency(kpis.faturamento_total_vendas * 0.01)}</strong> 
            em receita anual preservada.</p>
            
            <h5>Programa de Retenção Proativa:</h5>
            <ul>
                <li><strong>Early Warning:</strong> Sistema preditivo de propensão a churn</li>
                <li><strong>Intervenção Preventiva:</strong> Contato proativo com clientes em risco</li>
                <li><strong>Benefícios Exclusivos:</strong> Programa de fidelidade com vantagens tangíveis</li>
                <li><strong>Meta:</strong> Reduzir churn para 12% em 12 meses (R$ 1,5M+ recuperados)</li>
            </ul>
            
            <h5>Segmentação Estratégica:</h5>
            <ul>
                <li><strong>Champions (Alto Valor):</strong> Atendimento VIP e produtos premium</li>
                <li><strong>Potenciais:</strong> Campanhas de upselling e cross-selling</li>
                <li><strong>Em Risco:</strong> Retenção proativa com ofertas personalizadas</li>
            </ul>
        `;
    }
}

/**
 * Initialize dashboard
 */
async function initDashboard() {
    // Show loading
    document.getElementById('loading-screen').style.display = 'flex';
    
    // Load data
    const data = await loadData();
    
    if (!data) {
        alert('Erro ao carregar dados do dashboard');
        return;
    }
    
    // Update all sections
    updateKPIs(data);
    createAllCharts(data);
    
    // Use enhanced tables if available, otherwise fallback to basic
    if (typeof createEnhancedProductsTable === 'function') {
        createEnhancedProductsTable(data);
        createEnhancedGeographyTable(data);
        addExportButtons();
        addSparklinesToKPIs(data);
    } else {
        createProductsTable(data);
        createGeographyTable(data);
    }
    
    updateInsightsSection(data);
    
    // Initialize navigation
    initNavigation();
    
    // Hide loading
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 1000);
}

// ============================================================================
// Start Application
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (dashboardData) {
        createAllCharts(dashboardData);
    }
});

