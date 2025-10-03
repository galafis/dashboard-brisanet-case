"""
Advanced Metrics and Statistical Analysis
Autor: Gabriel Demetrios Lafis
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime

# Carregar dados
vendas = pd.read_csv('/home/ubuntu/dashboard-brisanet-case/data/base_vendas.csv')
clientes = pd.read_csv('/home/ubuntu/dashboard-brisanet-case/data/base_clientes.csv')
produtos = pd.read_csv('/home/ubuntu/dashboard-brisanet-case/data/base_produtos.csv')
info_vendas = pd.read_csv('/home/ubuntu/dashboard-brisanet-case/data/Informacoes_vendas.csv')

# Carregar análises existentes
with open('/home/ubuntu/dashboard-brisanet-case/data/analises.json', 'r', encoding='utf-8') as f:
    analises_base = json.load(f)

# ============================================================================
# MÉTRICAS AVANÇADAS
# ============================================================================

def calcular_metricas_avancadas():
    """Calcula métricas estatísticas avançadas"""
    
    # Merge completo
    vendas_completas = vendas.merge(info_vendas, on='ID_Venda', how='left')
    vendas_completas = vendas_completas.merge(clientes, left_on='ID_Cliente', right_on='ID', how='left')
    vendas_completas = vendas_completas.merge(produtos, left_on='ID_Produto', right_on='ID', how='left')
    
    # Converter data
    vendas_completas['Data_Venda'] = pd.to_datetime(vendas_completas['Data_Venda'])
    vendas_completas['ano_mes'] = vendas_completas['Data_Venda'].dt.to_period('M').astype(str)
    
    # Faturamento mensal com estatísticas
    fat_mensal = vendas_completas.groupby('ano_mes').agg({
        'Valor_Venda': ['sum', 'mean', 'std', 'min', 'max', 'count']
    }).reset_index()
    
    fat_mensal.columns = ['ano_mes', 'faturamento', 'ticket_medio', 'desvio_padrao', 
                          'valor_min', 'valor_max', 'quantidade_vendas']
    
    # Calcular crescimento mês a mês
    fat_mensal['crescimento_percentual'] = fat_mensal['faturamento'].pct_change() * 100
    fat_mensal['crescimento_absoluto'] = fat_mensal['faturamento'].diff()
    
    # Calcular média móvel (3 meses)
    fat_mensal['media_movel_3m'] = fat_mensal['faturamento'].rolling(window=3).mean()
    
    # Tendência linear
    from scipy import stats
    x = np.arange(len(fat_mensal))
    y = fat_mensal['faturamento'].values
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
    fat_mensal['tendencia'] = slope * x + intercept
    
    return {
        'faturamento_mensal_detalhado': fat_mensal.to_dict('records'),
        'tendencia_slope': float(slope),
        'tendencia_r_squared': float(r_value ** 2),
        'crescimento_medio_mensal': float(fat_mensal['crescimento_percentual'].mean()),
        'volatilidade': float(fat_mensal['faturamento'].std() / fat_mensal['faturamento'].mean() * 100)
    }

def analise_produtos_detalhada():
    """Análise detalhada por produto com métricas avançadas"""
    
    vendas_completas = vendas.merge(info_vendas, on='ID_Venda', how='left')
    vendas_completas = vendas_completas.merge(produtos, left_on='ID_Produto', right_on='ID', how='left')
    
    analise = vendas_completas.groupby('Produto').agg({
        'Valor_Venda': ['sum', 'mean', 'std', 'count', 'min', 'max']
    }).reset_index()
    
    analise.columns = ['produto', 'faturamento_total', 'ticket_medio', 'desvio_padrao',
                       'qtd_vendas', 'valor_min', 'valor_max']
    
    # Calcular participação
    total_fat = analise['faturamento_total'].sum()
    analise['participacao_percentual'] = (analise['faturamento_total'] / total_fat * 100)
    analise['participacao_acumulada'] = analise['participacao_percentual'].cumsum()
    
    # Calcular coeficiente de variação
    analise['coef_variacao'] = (analise['desvio_padrao'] / analise['ticket_medio'] * 100)
    
    # Classificação ABC
    analise['classificacao_abc'] = analise['participacao_acumulada'].apply(
        lambda x: 'A' if x <= 80 else ('B' if x <= 95 else 'C')
    )
    
    # Ordenar por faturamento
    analise = analise.sort_values('faturamento_total', ascending=False)
    
    return analise.to_dict('records')

def analise_geografica_detalhada():
    """Análise geográfica com métricas de penetração"""
    
    vendas_completas = vendas.merge(info_vendas, on='ID_Venda', how='left')
    vendas_completas = vendas_completas.merge(clientes, left_on='ID_Cliente', right_on='ID', how='left')
    
    # Por estado
    analise_estado = vendas_completas.groupby('Estado').agg({
        'Valor_Venda': ['sum', 'mean', 'count'],
        'ID_Cliente': 'nunique'
    }).reset_index()
    
    analise_estado.columns = ['estado', 'faturamento_total', 'ticket_medio', 
                              'qtd_vendas', 'qtd_clientes']
    
    # Calcular métricas
    analise_estado['faturamento_por_cliente'] = (
        analise_estado['faturamento_total'] / analise_estado['qtd_clientes']
    )
    analise_estado['vendas_por_cliente'] = (
        analise_estado['qtd_vendas'] / analise_estado['qtd_clientes']
    )
    
    # Participação
    total_fat = analise_estado['faturamento_total'].sum()
    analise_estado['participacao_percentual'] = (
        analise_estado['faturamento_total'] / total_fat * 100
    )
    
    # Ordenar
    analise_estado = analise_estado.sort_values('faturamento_total', ascending=False)
    
    # Por cidade (top 20)
    analise_cidade = vendas_completas.groupby(['Cidade', 'Estado']).agg({
        'Valor_Venda': ['sum', 'mean', 'count'],
        'ID_Cliente': 'nunique'
    }).reset_index()
    
    analise_cidade.columns = ['cidade', 'estado', 'faturamento_total', 
                              'ticket_medio', 'qtd_vendas', 'qtd_clientes']
    
    analise_cidade['faturamento_por_cliente'] = (
        analise_cidade['faturamento_total'] / analise_cidade['qtd_clientes']
    )
    
    analise_cidade = analise_cidade.sort_values('faturamento_total', ascending=False).head(20)
    
    return {
        'por_estado': analise_estado.to_dict('records'),
        'por_cidade': analise_cidade.to_dict('records')
    }

def analise_clientes_detalhada():
    """Análise detalhada de clientes com segmentação"""
    
    vendas_completas = vendas.merge(info_vendas, on='ID_Venda', how='left')
    vendas_completas = vendas_completas.merge(clientes, left_on='ID_Cliente', right_on='ID', how='left')
    
    # RFV por cliente (Recência, Frequência, Valor)
    data_ref = vendas_completas['Data_Venda'].max()
    
    rfv = vendas_completas.groupby('ID_Cliente').agg({
        'Data_Venda': lambda x: (pd.to_datetime(data_ref) - pd.to_datetime(x).max()).days,
        'ID_Venda': 'count',
        'Valor_Venda': 'sum'
    }).reset_index()
    
    rfv.columns = ['ID_Cliente', 'recencia_dias', 'frequencia', 'valor_total']
    
    # Calcular quartis para segmentação
    rfv['score_recencia'] = pd.qcut(rfv['recencia_dias'], 4, labels=[4, 3, 2, 1], duplicates='drop')
    rfv['score_frequencia'] = pd.qcut(rfv['frequencia'], 4, labels=[1, 2, 3, 4], duplicates='drop')
    rfv['score_valor'] = pd.qcut(rfv['valor_total'], 4, labels=[1, 2, 3, 4], duplicates='drop')
    
    rfv['score_rfv'] = (rfv['score_recencia'].astype(int) + 
                        rfv['score_frequencia'].astype(int) + 
                        rfv['score_valor'].astype(int))
    
    # Segmentar clientes
    def segmentar_cliente(score):
        if score >= 10:
            return 'Champions'
        elif score >= 8:
            return 'Loyal'
        elif score >= 6:
            return 'Potential'
        elif score >= 4:
            return 'At Risk'
        else:
            return 'Lost'
    
    rfv['segmento_rfv'] = rfv['score_rfv'].apply(segmentar_cliente)
    
    # Estatísticas por segmento
    segmentos = rfv.groupby('segmento_rfv').agg({
        'ID_Cliente': 'count',
        'valor_total': ['sum', 'mean'],
        'frequencia': 'mean',
        'recencia_dias': 'mean'
    }).reset_index()
    
    segmentos.columns = ['segmento', 'qtd_clientes', 'valor_total', 'valor_medio',
                         'frequencia_media', 'recencia_media']
    
    # Análise por faixa de valor
    vendas_por_cliente = vendas_completas.groupby('ID_Cliente')['Valor_Venda'].sum()
    
    faixas_valor = pd.cut(vendas_por_cliente, 
                          bins=[0, 100, 300, 500, 1000, float('inf')],
                          labels=['0-100', '100-300', '300-500', '500-1000', '1000+'])
    
    analise_faixas = faixas_valor.value_counts().reset_index()
    analise_faixas.columns = ['faixa_valor', 'qtd_clientes']
    analise_faixas['percentual'] = (analise_faixas['qtd_clientes'] / 
                                    analise_faixas['qtd_clientes'].sum() * 100)
    
    return {
        'segmentos_rfv': segmentos.to_dict('records'),
        'distribuicao_valor': analise_faixas.to_dict('records'),
        'estatisticas_rfv': {
            'recencia_media': float(rfv['recencia_dias'].mean()),
            'frequencia_media': float(rfv['frequencia'].mean()),
            'valor_medio_cliente': float(rfv['valor_total'].mean()),
            'valor_mediano_cliente': float(rfv['valor_total'].median())
        }
    }

def analise_temporal_avancada():
    """Análise temporal com padrões e sazonalidade"""
    
    vendas_completas = vendas.merge(info_vendas, on='ID_Venda', how='left')
    vendas_completas['Data_Venda'] = pd.to_datetime(vendas_completas['Data_Venda'])
    
    # Por dia da semana
    vendas_completas['dia_semana'] = vendas_completas['Data_Venda'].dt.day_name()
    por_dia_semana = vendas_completas.groupby('dia_semana').agg({
        'Valor_Venda': ['sum', 'mean', 'count']
    }).reset_index()
    por_dia_semana.columns = ['dia_semana', 'faturamento', 'ticket_medio', 'qtd_vendas']
    
    # Por semana do mês
    vendas_completas['semana_mes'] = ((vendas_completas['Data_Venda'].dt.day - 1) // 7 + 1)
    por_semana = vendas_completas.groupby('semana_mes').agg({
        'Valor_Venda': ['sum', 'mean', 'count']
    }).reset_index()
    por_semana.columns = ['semana_mes', 'faturamento', 'ticket_medio', 'qtd_vendas']
    
    return {
        'por_dia_semana': por_dia_semana.to_dict('records'),
        'por_semana_mes': por_semana.to_dict('records')
    }

# ============================================================================
# EXECUTAR ANÁLISES
# ============================================================================

print("Calculando métricas avançadas...")

metricas_avancadas = calcular_metricas_avancadas()
produtos_detalhado = analise_produtos_detalhada()
geografica_detalhada = analise_geografica_detalhada()
clientes_detalhado = analise_clientes_detalhada()
temporal_avancada = analise_temporal_avancada()

# Combinar com análises base
analises_completas = {
    **analises_base,
    'metricas_avancadas': metricas_avancadas,
    'produtos_detalhado': produtos_detalhado,
    'geografica_detalhada': geografica_detalhada,
    'clientes_detalhado': clientes_detalhado,
    'temporal_avancada': temporal_avancada
}

# Salvar
output_path = '/home/ubuntu/dashboard-brisanet-case/data/analises_completas.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(analises_completas, f, ensure_ascii=False, indent=2)

print(f"Análises completas salvas em: {output_path}")
print("\nResumo das métricas avançadas:")
print(f"- Tendência de crescimento: {metricas_avancadas['tendencia_slope']:.2f} por mês")
print(f"- R² da tendência: {metricas_avancadas['tendencia_r_squared']:.4f}")
print(f"- Crescimento médio mensal: {metricas_avancadas['crescimento_medio_mensal']:.2f}%")
print(f"- Volatilidade: {metricas_avancadas['volatilidade']:.2f}%")
print(f"\nSegmentos RFV identificados: {len(clientes_detalhado['segmentos_rfv'])}")
print(f"Produtos analisados: {len(produtos_detalhado)}")

