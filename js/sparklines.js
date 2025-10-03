/**
 * Sparklines and Advanced Visual Components
 * Elite Dashboard - Brisanet
 * Author: Gabriel Demetrios Lafis
 */

/**
 * Create a sparkline (mini line chart) in an element
 */
function createSparkline(elementId, data, options = {}) {
    const defaultOptions = {
        color: '#FF6B00',
        fillColor: 'rgba(255, 107, 0, 0.1)',
        height: 40,
        showDots: false,
        showLastValue: true
    };
    
    const opts = { ...defaultOptions, ...options };
    
    const trace = {
        x: data.map((_, i) => i),
        y: data,
        type: 'scatter',
        mode: opts.showDots ? 'lines+markers' : 'lines',
        line: {
            color: opts.color,
            width: 2
        },
        fill: 'tozeroy',
        fillcolor: opts.fillColor,
        marker: {
            size: 4,
            color: opts.color
        },
        hoverinfo: 'y'
    };
    
    const layout = {
        height: opts.height,
        margin: { l: 0, r: opts.showLastValue ? 30 : 0, t: 0, b: 0 },
        xaxis: {
            visible: false,
            showgrid: false
        },
        yaxis: {
            visible: false,
            showgrid: false
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        showlegend: false,
        hovermode: 'closest'
    };
    
    const config = {
        displayModeBar: false,
        responsive: true
    };
    
    Plotly.newPlot(elementId, [trace], layout, config);
    
    // Add last value annotation if requested
    if (opts.showLastValue && data.length > 0) {
        const lastValue = data[data.length - 1];
        const element = document.getElementById(elementId);
        if (element) {
            const valueSpan = document.createElement('span');
            valueSpan.className = 'sparkline-value';
            valueSpan.textContent = typeof lastValue === 'number' ? 
                lastValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 
                lastValue;
            valueSpan.style.cssText = `
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 11px;
                font-weight: 600;
                color: ${opts.color};
            `;
            element.style.position = 'relative';
            element.appendChild(valueSpan);
        }
    }
}

/**
 * Create a progress bar with value
 */
function createProgressBar(value, max, options = {}) {
    const defaultOptions = {
        height: '8px',
        color: '#FF6B00',
        backgroundColor: '#2A3347',
        showValue: true,
        showPercentage: true
    };
    
    const opts = { ...defaultOptions, ...options };
    const percentage = (value / max) * 100;
    
    let html = '<div class="progress-bar-container" style="width: 100%; background: ' + opts.backgroundColor + '; border-radius: 4px; height: ' + opts.height + '; overflow: hidden;">';
    html += '<div class="progress-bar-fill" style="width: ' + percentage + '%; height: 100%; background: ' + opts.color + '; transition: width 0.3s ease;"></div>';
    html += '</div>';
    
    if (opts.showValue || opts.showPercentage) {
        html += '<div class="progress-bar-label" style="font-size: 11px; color: #B8C5D6; margin-top: 4px;">';
        if (opts.showValue) {
            html += '<span>' + value.toLocaleString('pt-BR') + '</span>';
        }
        if (opts.showValue && opts.showPercentage) {
            html += '<span style="margin: 0 4px;">•</span>';
        }
        if (opts.showPercentage) {
            html += '<span>' + percentage.toFixed(1) + '%</span>';
        }
        html += '</div>';
    }
    
    return html;
}

/**
 * Create a change indicator (up/down arrow with percentage)
 */
function createChangeIndicator(currentValue, previousValue, options = {}) {
    const defaultOptions = {
        showArrow: true,
        showPercentage: true,
        showValue: false,
        decimals: 1
    };
    
    const opts = { ...defaultOptions, ...options };
    
    if (previousValue === 0 || previousValue === null || previousValue === undefined) {
        return '<span class="change-indicator neutral">-</span>';
    }
    
    const change = currentValue - previousValue;
    const changePercent = (change / previousValue) * 100;
    const isPositive = change > 0;
    const isNeutral = change === 0;
    
    let className = 'change-indicator ';
    className += isNeutral ? 'neutral' : (isPositive ? 'positive' : 'negative');
    
    let html = '<span class="' + className + '">';
    
    if (opts.showArrow && !isNeutral) {
        html += isPositive ? '▲ ' : '▼ ';
    }
    
    if (opts.showValue) {
        html += (isPositive ? '+' : '') + change.toLocaleString('pt-BR', {
            minimumFractionDigits: opts.decimals,
            maximumFractionDigits: opts.decimals
        });
        if (opts.showPercentage) {
            html += ' (';
        }
    }
    
    if (opts.showPercentage) {
        html += (isPositive ? '+' : '') + changePercent.toFixed(opts.decimals) + '%';
        if (opts.showValue) {
            html += ')';
        }
    }
    
    html += '</span>';
    
    return html;
}

/**
 * Create a ranking badge
 */
function createRankingBadge(rank, total, options = {}) {
    const defaultOptions = {
        showTotal: false,
        size: 'medium' // small, medium, large
    };
    
    const opts = { ...defaultOptions, ...options };
    
    let color = '#6B7280';
    if (rank === 1) color = '#FFD700'; // Gold
    else if (rank === 2) color = '#C0C0C0'; // Silver
    else if (rank === 3) color = '#CD7F32'; // Bronze
    else if (rank <= 5) color = '#3B82F6'; // Blue
    
    const sizeClass = 'badge-' + opts.size;
    
    let html = '<span class="ranking-badge ' + sizeClass + '" style="background: ' + color + '; color: white; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">';
    html += '#' + rank;
    if (opts.showTotal) {
        html += ' / ' + total;
    }
    html += '</span>';
    
    return html;
}

/**
 * Create a heatmap cell
 */
function createHeatmapCell(value, min, max, options = {}) {
    const defaultOptions = {
        colorScale: ['#1E2536', '#FF6B00'], // from dark to orange
        showValue: true,
        decimals: 0
    };
    
    const opts = { ...defaultOptions, ...options };
    
    // Normalize value between 0 and 1
    const normalized = (value - min) / (max - min);
    
    // Interpolate color
    const color = interpolateColor(opts.colorScale[0], opts.colorScale[1], normalized);
    
    // Determine text color based on brightness
    const textColor = normalized > 0.5 ? '#FFFFFF' : '#B8C5D6';
    
    let html = '<div class="heatmap-cell" style="background: ' + color + '; color: ' + textColor + '; padding: 8px; text-align: center; border-radius: 4px; font-weight: 600; font-size: 13px;">';
    if (opts.showValue) {
        html += value.toLocaleString('pt-BR', {
            minimumFractionDigits: opts.decimals,
            maximumFractionDigits: opts.decimals
        });
    }
    html += '</div>';
    
    return html;
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1, color2, factor) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));
    
    return rgbToHex(r, g, b);
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Create a mini donut chart
 */
function createMiniDonut(elementId, value, max, options = {}) {
    const defaultOptions = {
        color: '#FF6B00',
        backgroundColor: '#2A3347',
        size: 60,
        showPercentage: true
    };
    
    const opts = { ...defaultOptions, ...options };
    const percentage = (value / max) * 100;
    
    const data = [{
        values: [value, max - value],
        labels: ['Valor', 'Restante'],
        type: 'pie',
        hole: 0.7,
        marker: {
            colors: [opts.color, opts.backgroundColor]
        },
        textinfo: 'none',
        hoverinfo: 'label+value'
    }];
    
    const layout = {
        height: opts.size,
        width: opts.size,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        paper_bgcolor: 'transparent',
        showlegend: false,
        annotations: opts.showPercentage ? [{
            text: percentage.toFixed(0) + '%',
            font: {
                size: 14,
                color: '#FFFFFF',
                family: 'Inter, sans-serif',
                weight: 700
            },
            showarrow: false,
            x: 0.5,
            y: 0.5
        }] : []
    };
    
    const config = {
        displayModeBar: false,
        responsive: true
    };
    
    Plotly.newPlot(elementId, data, layout, config);
}

/**
 * Export table data to CSV
 */
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let row of rows) {
        let cols = row.querySelectorAll('td, th');
        let csvRow = [];
        for (let col of cols) {
            csvRow.push('"' + col.textContent.replace(/"/g, '""') + '"');
        }
        csv.push(csvRow.join(','));
    }
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export functions for use in main.js
window.createSparkline = createSparkline;
window.createProgressBar = createProgressBar;
window.createChangeIndicator = createChangeIndicator;
window.createRankingBadge = createRankingBadge;
window.createHeatmapCell = createHeatmapCell;
window.createMiniDonut = createMiniDonut;
window.exportTableToCSV = exportTableToCSV;

