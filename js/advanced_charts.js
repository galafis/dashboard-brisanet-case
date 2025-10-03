/**
 * Advanced Visualizations - Heatmaps, Treemaps, Sunburst
 * Supreme Dashboard - Brisanet
 * Author: Gabriel Demetrios Lafis
 */

/**
 * Create heatmap of product performance over months
 */
function createProductPerformanceHeatmap(data) {
    const elementId = 'chart-heatmap-products';
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Prepare data for heatmap
    const produtos = data.faturamento_por_produto.slice(0, 10); // Top 10
    const meses = data.faturamento_mensal || [];
    
    // Simulate monthly data per product (in real scenario, this would come from data)
    const z = [];
    const y = produtos.map(p => p.produto);
    const x = meses.map(m => m.mes);
    
    // Generate heatmap data (simulated - ideally from real data)
    produtos.forEach(produto => {
        const row = meses.map(() => {
            // Simulate variation around product's average
            const base = produto.faturamento / meses.length;
            const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
            return base * (1 + variation);
        });
        z.push(row);
    });
    
    const trace = {
        x: x,
        y: y,
        z: z,
        type: 'heatmap',
        colorscale: [
            [0, '#1E2536'],
            [0.25, '#3B82F6'],
            [0.5, '#10B981'],
            [0.75, '#F59E0B'],
            [1, '#FF6B00']
        ],
        hoverongaps: false,
        hovertemplate: '<b>%{y}</b><br>' +
                      'Mês: %{x}<br>' +
                      'Faturamento: R$ %{z:,.0f}<br>' +
                      '<extra></extra>',
        colorbar: {
            title: 'Faturamento',
            titleside: 'right',
            tickmode: 'linear',
            tick0: 0,
            dtick: 50000,
            tickformat: ',.0f',
            tickfont: {
                color: '#B8C5D6',
                family: 'Inter, sans-serif',
                size: 11
            },
            titlefont: {
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                size: 12
            },
            bgcolor: '#1A1F2E',
            bordercolor: '#2A3347',
            borderwidth: 1
        }
    };
    
    const layout = {
        title: {
            text: 'Performance de Produtos por Mês',
            font: {
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                size: 16,
                weight: 700
            }
        },
        xaxis: {
            title: 'Mês',
            color: '#B8C5D6',
            gridcolor: '#2A3347',
            tickfont: {
                color: '#B8C5D6',
                size: 11
            }
        },
        yaxis: {
            title: 'Produto',
            color: '#B8C5D6',
            gridcolor: '#2A3347',
            tickfont: {
                color: '#B8C5D6',
                size: 11
            }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: '#1A1F2E',
        margin: { l: 150, r: 100, t: 60, b: 80 },
        height: 500
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };
    
    Plotly.newPlot(elementId, [trace], layout, config);
}

/**
 * Create treemap of revenue distribution
 */
function createRevenueTreemap(data) {
    const elementId = 'chart-treemap-revenue';
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const produtos = data.faturamento_por_produto;
    
    const trace = {
        type: 'treemap',
        labels: produtos.map(p => p.produto),
        parents: produtos.map(() => ''),
        values: produtos.map(p => p.faturamento),
        text: produtos.map(p => formatCurrency(p.faturamento)),
        textposition: 'middle center',
        textfont: {
            color: '#FFFFFF',
            family: 'Inter, sans-serif',
            size: 13,
            weight: 700
        },
        hovertemplate: '<b>%{label}</b><br>' +
                      'Faturamento: %{text}<br>' +
                      'Participação: %{percentParent}<br>' +
                      '<extra></extra>',
        marker: {
            colors: produtos.map((_, i) => {
                const colors = ['#FF6B00', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                return colors[i % colors.length];
            }),
            line: {
                color: '#1E2536',
                width: 2
            }
        }
    };
    
    const layout = {
        title: {
            text: 'Distribuição Hierárquica do Faturamento',
            font: {
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                size: 16,
                weight: 700
            }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 60, b: 0 },
        height: 500
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };
    
    Plotly.newPlot(elementId, [trace], layout, config);
}

/**
 * Create sunburst chart for hierarchical data
 */
function createSunburstChart(data) {
    const elementId = 'chart-sunburst';
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Prepare hierarchical data: Total > Estados > Produtos
    const labels = ['Total'];
    const parents = [''];
    const values = [data.kpis.faturamento_total_vendas];
    const colors = ['#FF6B00'];
    
    // Add top 5 states
    const topStates = data.faturamento_por_estado.slice(0, 5);
    topStates.forEach(estado => {
        labels.push(estado.estado);
        parents.push('Total');
        values.push(estado.faturamento);
        colors.push('#3B82F6');
    });
    
    // Add top 5 products
    const topProducts = data.faturamento_por_produto.slice(0, 5);
    topProducts.forEach(produto => {
        labels.push(produto.produto);
        parents.push('Total');
        values.push(produto.faturamento);
        colors.push('#10B981');
    });
    
    const trace = {
        type: 'sunburst',
        labels: labels,
        parents: parents,
        values: values,
        branchvalues: 'total',
        hovertemplate: '<b>%{label}</b><br>' +
                      'Faturamento: R$ %{value:,.0f}<br>' +
                      'Participação: %{percentParent}<br>' +
                      '<extra></extra>',
        marker: {
            colors: colors,
            line: {
                color: '#1E2536',
                width: 2
            }
        },
        textfont: {
            color: '#FFFFFF',
            family: 'Inter, sans-serif',
            size: 12,
            weight: 600
        }
    };
    
    const layout = {
        title: {
            text: 'Visão Hierárquica do Negócio',
            font: {
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                size: 16,
                weight: 700
            }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 60, b: 0 },
        height: 500
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };
    
    Plotly.newPlot(elementId, [trace], layout, config);
}

/**
 * Create waterfall chart showing revenue composition
 */
function createWaterfallChart(data) {
    const elementId = 'chart-waterfall';
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Prepare waterfall data
    const topProducts = data.faturamento_por_produto.slice(0, 5);
    const othersValue = data.faturamento_por_produto
        .slice(5)
        .reduce((sum, p) => sum + p.faturamento, 0);
    
    const x = [...topProducts.map(p => p.produto), 'Outros', 'Total'];
    const y = [...topProducts.map(p => p.faturamento), othersValue, 0];
    const measure = [...topProducts.map(() => 'relative'), 'relative', 'total'];
    
    const trace = {
        type: 'waterfall',
        orientation: 'v',
        x: x,
        y: y,
        measure: measure,
        text: y.map((v, i) => i < y.length - 1 ? formatCurrency(v) : ''),
        textposition: 'outside',
        textfont: {
            color: '#FFFFFF',
            family: 'Inter, sans-serif',
            size: 12,
            weight: 600
        },
        connector: {
            line: {
                color: '#6B7280',
                width: 2,
                dash: 'dot'
            }
        },
        increasing: {
            marker: {
                color: '#10B981'
            }
        },
        decreasing: {
            marker: {
                color: '#EF4444'
            }
        },
        totals: {
            marker: {
                color: '#FF6B00'
            }
        },
        hovertemplate: '<b>%{x}</b><br>' +
                      'Valor: %{y:,.0f}<br>' +
                      '<extra></extra>'
    };
    
    const layout = {
        title: {
            text: 'Composição do Faturamento Total',
            font: {
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                size: 16,
                weight: 700
            }
        },
        xaxis: {
            title: 'Produto',
            color: '#B8C5D6',
            gridcolor: '#2A3347',
            tickfont: {
                color: '#B8C5D6',
                size: 11
            }
        },
        yaxis: {
            title: 'Faturamento (R$)',
            color: '#B8C5D6',
            gridcolor: '#2A3347',
            tickformat: ',.0f',
            tickfont: {
                color: '#B8C5D6',
                size: 11
            }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: '#1A1F2E',
        margin: { l: 80, r: 40, t: 60, b: 100 },
        height: 500
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };
    
    Plotly.newPlot(elementId, [trace], layout, config);
}

/**
 * Create gauge charts for KPIs
 */
function createGaugeCharts(data) {
    const kpis = data.kpis;
    
    // Churn Rate Gauge
    createGaugeChart('gauge-churn', kpis.taxa_churn_percentual, {
        title: 'Taxa de Churn',
        max: 30,
        ranges: [
            { range: [0, 10], color: '#10B981' },
            { range: [10, 20], color: '#F59E0B' },
            { range: [20, 30], color: '#EF4444' }
        ],
        suffix: '%'
    });
    
    // Customer Satisfaction Gauge (simulated - 85%)
    createGaugeChart('gauge-satisfaction', 85, {
        title: 'Satisfação do Cliente',
        max: 100,
        ranges: [
            { range: [0, 60], color: '#EF4444' },
            { range: [60, 80], color: '#F59E0B' },
            { range: [80, 100], color: '#10B981' }
        ],
        suffix: '%'
    });
}

/**
 * Create a single gauge chart
 */
function createGaugeChart(elementId, value, options) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const trace = {
        type: 'indicator',
        mode: 'gauge+number',
        value: value,
        number: {
            suffix: options.suffix || '',
            font: {
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                size: 32,
                weight: 700
            }
        },
        gauge: {
            axis: {
                range: [null, options.max],
                tickwidth: 2,
                tickcolor: '#B8C5D6',
                tickfont: {
                    color: '#B8C5D6',
                    size: 11
                }
            },
            bar: {
                color: '#FF6B00',
                thickness: 0.75
            },
            bgcolor: '#1A1F2E',
            borderwidth: 2,
            bordercolor: '#2A3347',
            steps: options.ranges.map(r => ({
                range: r.range,
                color: r.color,
                thickness: 0.25
            })),
            threshold: {
                line: {
                    color: '#FFFFFF',
                    width: 4
                },
                thickness: 0.75,
                value: value
            }
        }
    };
    
    const layout = {
        title: {
            text: options.title,
            font: {
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                size: 14,
                weight: 700
            }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { l: 40, r: 40, t: 60, b: 20 },
        height: 250
    };
    
    const config = {
        responsive: true,
        displayModeBar: false
    };
    
    Plotly.newPlot(elementId, [trace], layout, config);
}

// Export functions
window.createProductPerformanceHeatmap = createProductPerformanceHeatmap;
window.createRevenueTreemap = createRevenueTreemap;
window.createSunburstChart = createSunburstChart;
window.createWaterfallChart = createWaterfallChart;
window.createGaugeCharts = createGaugeCharts;

