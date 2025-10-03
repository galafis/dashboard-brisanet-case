/**
 * Enhanced Tables with Visual Components
 * Supreme Dashboard - Brisanet
 * Author: Gabriel Demetrios Lafis
 */

/**
 * Create enhanced products table with rankings and progress bars
 */
function createEnhancedProductsTable(data) {
    const produtos = data.faturamento_por_produto
        .sort((a, b) => b.faturamento - a.faturamento);
    
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const maxFaturamento = Math.max(...produtos.map(p => p.faturamento));
    
    produtos.forEach((produto, index) => {
        const row = document.createElement('tr');
        
        // Ranking badge
        const rankingBadge = createRankingBadge(index + 1, produtos.length);
        
        // Progress bar
        const progressBar = createProgressBar(
            produto.faturamento,
            maxFaturamento,
            {
                height: '6px',
                color: index === 0 ? '#FFD700' : (index < 3 ? '#3B82F6' : '#FF6B00'),
                showValue: false,
                showPercentage: false
            }
        );
        
        // Change indicator (simulado - você pode calcular real se tiver dados históricos)
        const changePercent = (Math.random() * 30 - 10); // Simula variação de -10% a +20%
        const changeIndicator = changePercent !== 0 ? 
            createChangeIndicator(
                produto.faturamento,
                produto.faturamento / (1 + changePercent/100),
                { showValue: false, showPercentage: true, decimals: 1 }
            ) : '-';
        
        row.innerHTML = `
            <td style="text-align: center;">${rankingBadge}</td>
            <td><strong style="color: #FFFFFF;">${produto.produto}</strong></td>
            <td style="text-align: right;">
                <strong style="color: #FFFFFF; font-size: 15px;">${formatCurrency(produto.faturamento)}</strong>
            </td>
            <td style="text-align: right;">
                <span style="color: #B8C5D6;">${formatNumber(produto.quantidade_vendas)}</span>
            </td>
            <td style="text-align: right;">
                <span style="color: #B8C5D6;">${formatCurrency(produto.faturamento / produto.quantidade_vendas)}</span>
            </td>
            <td style="text-align: center;">
                ${changeIndicator}
            </td>
            <td>
                <div style="min-width: 150px;">
                    ${progressBar}
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Create enhanced geography table with rankings and progress bars
 */
function createEnhancedGeographyTable(data) {
    const estados = data.faturamento_por_estado
        .sort((a, b) => b.faturamento - a.faturamento);
    
    const tableBody = document.getElementById('geography-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const maxFaturamento = Math.max(...estados.map(e => e.faturamento));
    
    estados.forEach((estado, index) => {
        const row = document.createElement('tr');
        
        // Ranking badge
        const rankingBadge = createRankingBadge(index + 1, estados.length);
        
        // Progress bar
        const progressBar = createProgressBar(
            estado.faturamento,
            maxFaturamento,
            {
                height: '6px',
                color: index === 0 ? '#10B981' : (index < 3 ? '#3B82F6' : '#6B7280'),
                showValue: false,
                showPercentage: false
            }
        );
        
        // Change indicator (simulado)
        const changePercent = (Math.random() * 25 - 5); // Simula variação de -5% a +20%
        const changeIndicator = changePercent !== 0 ? 
            createChangeIndicator(
                estado.faturamento,
                estado.faturamento / (1 + changePercent/100),
                { showValue: false, showPercentage: true, decimals: 1 }
            ) : '-';
        
        row.innerHTML = `
            <td style="text-align: center;">${rankingBadge}</td>
            <td><strong style="color: #FFFFFF;">${estado.estado}</strong></td>
            <td style="text-align: right;">
                <strong style="color: #FFFFFF; font-size: 15px;">${formatCurrency(estado.faturamento)}</strong>
            </td>
            <td style="text-align: right;">
                <span style="color: #B8C5D6;">${formatNumber(estado.quantidade_vendas)}</span>
            </td>
            <td style="text-align: right;">
                <span style="color: #B8C5D6;">${formatNumber(estado.quantidade_clientes || 0)}</span>
            </td>
            <td style="text-align: center;">
                ${changeIndicator}
            </td>
            <td>
                <div style="min-width: 150px;">
                    ${progressBar}
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Add export buttons to tables
 */
function addExportButtons() {
    // Products table export
    const productsTableCard = document.querySelector('#products-section .table-card');
    if (productsTableCard) {
        const exportDiv = document.createElement('div');
        exportDiv.className = 'export-buttons';
        exportDiv.innerHTML = `
            <button class="btn-export" onclick="exportTableToCSV('products-table', 'produtos_brisanet')">
                <i class="fas fa-file-csv"></i>
                Exportar CSV
            </button>
            <button class="btn-export" onclick="alert('Funcionalidade em desenvolvimento')">
                <i class="fas fa-file-excel"></i>
                Exportar Excel
            </button>
        `;
        
        const tableHeader = productsTableCard.querySelector('.table-header');
        if (tableHeader) {
            tableHeader.appendChild(exportDiv);
        }
    }
    
    // Geography table export
    const geographyTableCard = document.querySelector('#geography-section .table-card');
    if (geographyTableCard) {
        const exportDiv = document.createElement('div');
        exportDiv.className = 'export-buttons';
        exportDiv.innerHTML = `
            <button class="btn-export" onclick="exportTableToCSV('geography-table', 'geografia_brisanet')">
                <i class="fas fa-file-csv"></i>
                Exportar CSV
            </button>
            <button class="btn-export" onclick="alert('Funcionalidade em desenvolvimento')">
                <i class="fas fa-file-excel"></i>
                Exportar Excel
            </button>
        `;
        
        const tableHeader = geographyTableCard.querySelector('.table-header');
        if (tableHeader) {
            tableHeader.appendChild(exportDiv);
        }
    }
}

/**
 * Add sparklines to KPI cards
 */
function addSparklin esToKPIs(data) {
    // Faturamento sparkline
    if (data.faturamento_mensal && data.faturamento_mensal.length > 0) {
        const faturamentoValues = data.faturamento_mensal.map(m => m.faturamento);
        
        const kpiCards = document.querySelectorAll('.kpi-card');
        if (kpiCards.length > 0) {
            // Add sparkline container to first KPI card (Faturamento Total)
            const firstCard = kpiCards[0];
            const sparklineDiv = document.createElement('div');
            sparklineDiv.id = 'sparkline-faturamento';
            sparklineDiv.className = 'kpi-card-sparkline';
            firstCard.appendChild(sparklineDiv);
            
            // Create sparkline
            setTimeout(() => {
                createSparkline('sparkline-faturamento', faturamentoValues, {
                    color: '#FF6B00',
                    fillColor: 'rgba(255, 107, 0, 0.1)',
                    showLastValue: false
                });
            }, 500);
        }
    }
}

// Export functions
window.createEnhancedProductsTable = createEnhancedProductsTable;
window.createEnhancedGeographyTable = createEnhancedGeographyTable;
window.addExportButtons = addExportButtons;
window.addSparklinesToKPIs = addSparklinesToKPIs;

