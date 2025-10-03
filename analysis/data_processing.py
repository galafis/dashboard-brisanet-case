#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
Script de Tratamento e Análise de Dados - Case Brisanet
Autor: Gabriel Demetrios Lafis
Data: 2024

Este script realiza o tratamento completo dos dados comerciais da Brisanet,
identificando e corrigindo inconsistências, unificando bases e gerando insights.
"""

import pandas as pd
import numpy as np
from datetime import datetime
import json
import warnings
warnings.filterwarnings('ignore')

# ==============================================================================
# CONFIGURAÇÕES E MAPEAMENTOS
# ==============================================================================

# Mapeamento correto de estados para regiões
ESTADO_REGIAO = {
    # Norte
    'AC': 'Norte', 'AP': 'Norte', 'AM': 'Norte', 'PA': 'Norte', 
    'RO': 'Norte', 'RR': 'Norte', 'TO': 'Norte',
    # Nordeste
    'AL': 'Nordeste', 'BA': 'Nordeste', 'CE': 'Nordeste', 'MA': 'Nordeste',
    'PB': 'Nordeste', 'PE': 'Nordeste', 'PI': 'Nordeste', 'RN': 'Nordeste', 'SE': 'Nordeste',
    # Centro-Oeste
    'DF': 'Centro-Oeste', 'GO': 'Centro-Oeste', 'MT': 'Centro-Oeste', 'MS': 'Centro-Oeste',
    # Sudeste
    'ES': 'Sudeste', 'MG': 'Sudeste', 'RJ': 'Sudeste', 'SP': 'Sudeste',
    # Sul
    'PR': 'Sul', 'RS': 'Sul', 'SC': 'Sul'
}

# Mapeamento de produtos
PRODUTOS = {
    1: 'Fibra 300MB',
    2: 'Fibra 600MB',
    3: 'Fibra 1GB',
    4: 'Móvel Controle',
    5: 'Móvel Pós',
    6: 'TV + Fibra'
}

# Valores médios de planos (para referência)
VALORES_PLANOS = {
    'Fibra 300MB': 89.9,
    'Fibra 600MB': 119.9,
    'Fibra 1GB': 159.9,
    'Móvel Controle': 49.9,
    'Móvel Pós': 89.9,
    'TV + Fibra': 199.9
}

# ==============================================================================
# FUNÇÕES DE TRATAMENTO
# ==============================================================================

def corrigir_regioes(df):
    """Corrige as regiões baseado no estado"""
    if 'regiao' in df.columns:
        df['regiao_original'] = df['regiao'].copy()
    else:
        df['regiao_original'] = np.nan
    df['regiao'] = df['estado'].map(ESTADO_REGIAO)
    return df

def converter_datas(df, coluna_data):
    """Converte datas do formato DD/MM/YYYY para datetime"""
    df[coluna_data] = pd.to_datetime(df[coluna_data], format='%d/%m/%Y', errors='coerce')
    return df

def ajustar_datas_futuro(df, coluna_data):
    """Ajusta datas futuras para o ano anterior (2024)"""
    mask_futuro = df[coluna_data].dt.year == 2025
    df.loc[mask_futuro, coluna_data] = df.loc[mask_futuro, coluna_data] - pd.DateOffset(years=1)
    return df

def calcular_metricas_cliente(df):
    """Calcula métricas adicionais por cliente"""
    df['tempo_cliente_dias'] = (datetime.now() - df['data_entrada']).dt.days
    df['tempo_cliente_meses'] = df['tempo_cliente_dias'] / 30.44
    
    # Para clientes cancelados, calcular tempo até cancelamento
    mask_cancelado = df['status'] == 'Cancelado'
    df.loc[mask_cancelado, 'tempo_ate_cancelamento_dias'] = \
        (df.loc[mask_cancelado, 'data_cancelamento'] - df.loc[mask_cancelado, 'data_entrada']).dt.days
    
    return df

# ==============================================================================
# CARREGAMENTO E TRATAMENTO DOS DADOS
# ==============================================================================

print("="*80)
print("INICIANDO TRATAMENTO DE DADOS - CASE BRISANET")
print("="*80)

# Carregar dados
print("\n1. Carregando dados...")
clientes = pd.read_csv('/home/ubuntu/upload/base_clientes.csv', sep=';')
vendas = pd.read_csv('/home/ubuntu/upload/base_vendas.csv', sep=';')
produtos = pd.read_csv('/home/ubuntu/upload/base_produtos.csv', sep=';')
info_vendas = pd.read_csv('/home/ubuntu/upload/Informacoes_vendas.csv', sep=';')

print(f"   - Base de clientes: {len(clientes)} registros")
print(f"   - Base de vendas: {len(vendas)} registros")
print(f"   - Base de produtos: {len(produtos)} registros")
print(f"   - Informações de vendas: {len(info_vendas)} registros")

# ==============================================================================
# TRATAMENTO DA BASE DE CLIENTES
# ==============================================================================

print("\n2. Tratando base de clientes...")

# Corrigir regiões
clientes = corrigir_regioes(clientes)
print(f"   ✓ Regiões corrigidas baseado nos estados")

# Converter datas
clientes = converter_datas(clientes, 'data_entrada')
clientes = converter_datas(clientes, 'data_cancelamento')
print(f"   ✓ Datas convertidas para formato datetime")

# Calcular métricas
clientes = calcular_metricas_cliente(clientes)
print(f"   ✓ Métricas de tempo calculadas")

# ==============================================================================
# TRATAMENTO DA BASE DE VENDAS
# ==============================================================================

print("\n3. Tratando base de vendas...")

# Converter datas
vendas = converter_datas(vendas, 'data_venda')

# Ajustar datas futuras (2025 -> 2024)
vendas = ajustar_datas_futuro(vendas, 'data_venda')
print(f"   ✓ Datas ajustadas (2025 -> 2024)")

# Adicionar nome do produto
vendas = vendas.merge(produtos, on='id_produto', how='left')
print(f"   ✓ Nomes de produtos adicionados")

# ==============================================================================
# TRATAMENTO DA BASE DE INFORMAÇÕES DE VENDAS
# ==============================================================================

print("\n4. Tratando informações de vendas...")

# Adicionar região correta
info_vendas = corrigir_regioes(info_vendas)
print(f"   ✓ Regiões corrigidas")

# ==============================================================================
# UNIFICAÇÃO DAS BASES
# ==============================================================================

print("\n5. Unificando bases de dados...")

# Unificar vendas com informações de clientes novos
vendas_completas = vendas.merge(
    info_vendas,
    on='id_cliente',
    how='left',
    suffixes=('_venda', '_cliente')
)
print(f"   ✓ Vendas unificadas com informações de clientes: {len(vendas_completas)} registros")

# Criar base consolidada de todos os clientes (existentes + novos)
# Preparar clientes existentes
clientes_existentes = clientes.copy()
clientes_existentes['tipo_cliente'] = 'Existente'
clientes_existentes['tem_venda_nova'] = False

# Preparar clientes novos (das vendas)
clientes_novos = info_vendas.copy()
clientes_novos['tipo_cliente'] = 'Novo'
clientes_novos['tem_venda_nova'] = True
clientes_novos['data_entrada'] = pd.NaT  # Não temos data de entrada para novos
clientes_novos['valor'] = clientes_novos['plano'].map(VALORES_PLANOS)
clientes_novos['data_cancelamento'] = pd.NaT
clientes_novos['tempo_cliente_dias'] = 0
clientes_novos['tempo_cliente_meses'] = 0
clientes_novos['tempo_ate_cancelamento_dias'] = np.nan
clientes_novos['regiao_original'] = np.nan

# Padronizar colunas
colunas_comuns = ['id_cliente', 'nome_cliente', 'estado', 'cidade', 'regiao', 
                  'segmento', 'plano', 'valor', 'status', 'idade', 'genero', 
                  'renda_estimada', 'vendedor', 'tipo_cliente', 'tem_venda_nova']

clientes_existentes_padrao = clientes_existentes[colunas_comuns]
clientes_novos_padrao = clientes_novos[colunas_comuns]

# Unificar
base_consolidada = pd.concat([clientes_existentes_padrao, clientes_novos_padrao], ignore_index=True)
print(f"   ✓ Base consolidada criada: {len(base_consolidada)} clientes totais")

# ==============================================================================
# ANÁLISES E MÉTRICAS
# ==============================================================================

print("\n6. Gerando análises e métricas...")

# Análise de faturamento por mês (vendas)
vendas_completas['ano_mes'] = vendas_completas['data_venda'].dt.to_period('M')
faturamento_mensal = vendas_completas.groupby('ano_mes').agg({
    'valor': 'sum',
    'id_venda': 'count'
}).reset_index()
faturamento_mensal.columns = ['ano_mes', 'faturamento', 'quantidade_vendas']
faturamento_mensal['ano_mes'] = faturamento_mensal['ano_mes'].astype(str)
print(f"   ✓ Faturamento mensal calculado: {len(faturamento_mensal)} meses")

# Análise por produto
analise_produtos = vendas_completas.groupby('nome_produto').agg({
    'valor': ['sum', 'mean', 'count'],
    'id_venda': 'count'
}).reset_index()
analise_produtos.columns = ['produto', 'faturamento_total', 'ticket_medio', 'qtd_vendas', 'qtd_vendas_2']
analise_produtos = analise_produtos.drop('qtd_vendas_2', axis=1)
analise_produtos = analise_produtos.sort_values('faturamento_total', ascending=False)
print(f"   ✓ Análise por produto concluída")

# Análise por estado
analise_estados = vendas_completas.groupby(['estado_venda']).agg({
    'valor': ['sum', 'mean', 'count']
}).reset_index()
analise_estados.columns = ['estado', 'faturamento_total', 'ticket_medio', 'qtd_vendas']
# Adicionar região
analise_estados['regiao'] = analise_estados['estado'].map(ESTADO_REGIAO)
analise_estados = analise_estados.sort_values('faturamento_total', ascending=False)
print(f"   ✓ Análise por estado concluída")

# Análise por cidade (top 20)
analise_cidades = vendas_completas.groupby(['cidade_venda', 'estado_venda']).agg({
    'valor': ['sum', 'count']
}).reset_index()
analise_cidades.columns = ['cidade', 'estado', 'faturamento_total', 'qtd_vendas']
analise_cidades = analise_cidades.sort_values('faturamento_total', ascending=False).head(20)
print(f"   ✓ Análise por cidade (top 20) concluída")

# Análise por segmento
analise_segmento = base_consolidada.groupby('segmento').agg({
    'id_cliente': 'count',
    'valor': 'mean',
    'renda_estimada': 'mean',
    'idade': 'mean'
}).reset_index()
analise_segmento.columns = ['segmento', 'qtd_clientes', 'valor_medio_plano', 'renda_media', 'idade_media']
print(f"   ✓ Análise por segmento concluída")

# Análise de clientes ativos vs cancelados
status_clientes = clientes.groupby('status').agg({
    'id_cliente': 'count',
    'valor': 'sum'
}).reset_index()
status_clientes.columns = ['status', 'quantidade', 'receita_total']
print(f"   ✓ Análise de status de clientes concluída")

# Taxa de churn
total_clientes = len(clientes)
clientes_cancelados = len(clientes[clientes['status'] == 'Cancelado'])
taxa_churn = (clientes_cancelados / total_clientes) * 100
print(f"   ✓ Taxa de churn calculada: {taxa_churn:.2f}%")

# Análise por vendedor (top 10)
analise_vendedores = vendas_completas.groupby('vendedor_venda').agg({
    'valor': ['sum', 'count', 'mean']
}).reset_index()
analise_vendedores.columns = ['vendedor', 'faturamento_total', 'qtd_vendas', 'ticket_medio']
analise_vendedores = analise_vendedores.sort_values('faturamento_total', ascending=False).head(10)
print(f"   ✓ Análise por vendedor (top 10) concluída")

# Análise por gênero
analise_genero = base_consolidada.groupby('genero').agg({
    'id_cliente': 'count',
    'valor': 'mean',
    'renda_estimada': 'mean'
}).reset_index()
analise_genero.columns = ['genero', 'quantidade', 'valor_medio_plano', 'renda_media']
print(f"   ✓ Análise por gênero concluída")

# Análise de faixa etária
base_consolidada['faixa_etaria'] = pd.cut(
    base_consolidada['idade'],
    bins=[0, 25, 35, 45, 55, 65, 100],
    labels=['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
)
analise_idade = base_consolidada.groupby('faixa_etaria').agg({
    'id_cliente': 'count',
    'valor': 'mean'
}).reset_index()
analise_idade.columns = ['faixa_etaria', 'quantidade', 'valor_medio_plano']
print(f"   ✓ Análise por faixa etária concluída")

# ==============================================================================
# MÉTRICAS CHAVE (KPIs)
# ==============================================================================

print("\n7. Calculando KPIs principais...")

kpis = {
    'faturamento_total_vendas': float(vendas_completas['valor'].sum()),
    'faturamento_medio_mensal': float(faturamento_mensal['faturamento'].mean()),
    'ticket_medio_vendas': float(vendas_completas['valor'].mean()),
    'total_vendas': int(len(vendas_completas)),
    'total_clientes_existentes': int(len(clientes)),
    'total_clientes_novos': int(len(info_vendas)),
    'total_clientes_consolidado': int(len(base_consolidada)),
    'clientes_ativos': int(len(clientes[clientes['status'] == 'Ativo'])),
    'clientes_cancelados': int(len(clientes[clientes['status'] == 'Cancelado'])),
    'taxa_churn_percentual': float(taxa_churn),
    'idade_media_clientes': float(base_consolidada['idade'].mean()),
    'renda_media_clientes': float(base_consolidada['renda_estimada'].mean()),
    'valor_medio_plano': float(base_consolidada['valor'].mean()),
    'produto_mais_vendido': str(analise_produtos.iloc[0]['produto']),
    'estado_maior_faturamento': str(analise_estados.iloc[0]['estado']),
    'cidade_maior_faturamento': str(analise_cidades.iloc[0]['cidade']),
    'periodo_analise_inicio': str(vendas_completas['data_venda'].min().date()),
    'periodo_analise_fim': str(vendas_completas['data_venda'].max().date())
}

print(f"   ✓ KPIs calculados: {len(kpis)} métricas")

# ==============================================================================
# EXPORTAÇÃO DOS DADOS TRATADOS
# ==============================================================================

print("\n8. Exportando dados tratados...")

# Criar diretório de saída
import os
os.makedirs('/home/ubuntu/processed_data', exist_ok=True)

# Exportar CSVs
clientes.to_csv('/home/ubuntu/processed_data/clientes_tratado.csv', index=False, sep=';')
vendas_completas.to_csv('/home/ubuntu/processed_data/vendas_completas.csv', index=False, sep=';')
base_consolidada.to_csv('/home/ubuntu/processed_data/base_consolidada.csv', index=False, sep=';')

print(f"   ✓ CSVs exportados para /home/ubuntu/processed_data/")

# Exportar análises para JSON
analises_json = {
    'kpis': kpis,
    'faturamento_mensal': faturamento_mensal.to_dict('records'),
    'analise_produtos': analise_produtos.to_dict('records'),
    'analise_estados': analise_estados.to_dict('records'),
    'analise_cidades': analise_cidades.to_dict('records'),
    'analise_segmento': analise_segmento.to_dict('records'),
    'status_clientes': status_clientes.to_dict('records'),
    'analise_vendedores': analise_vendedores.to_dict('records'),
    'analise_genero': analise_genero.to_dict('records'),
    'analise_idade': analise_idade.to_dict('records')
}

with open('/home/ubuntu/processed_data/analises.json', 'w', encoding='utf-8') as f:
    json.dump(analises_json, f, ensure_ascii=False, indent=2)

print(f"   ✓ Análises exportadas para JSON")

# ==============================================================================
# RESUMO FINAL
# ==============================================================================

print("\n" + "="*80)
print("RESUMO DO TRATAMENTO")
print("="*80)
print(f"\n📊 DADOS PROCESSADOS:")
print(f"   • Clientes existentes: {len(clientes):,}")
print(f"   • Clientes novos: {len(info_vendas):,}")
print(f"   • Total consolidado: {len(base_consolidada):,}")
print(f"   • Vendas processadas: {len(vendas_completas):,}")

print(f"\n💰 FATURAMENTO:")
print(f"   • Total de vendas: R$ {kpis['faturamento_total_vendas']:,.2f}")
print(f"   • Média mensal: R$ {kpis['faturamento_medio_mensal']:,.2f}")
print(f"   • Ticket médio: R$ {kpis['ticket_medio_vendas']:,.2f}")

print(f"\n👥 CLIENTES:")
print(f"   • Ativos: {kpis['clientes_ativos']:,} ({100-taxa_churn:.1f}%)")
print(f"   • Cancelados: {kpis['clientes_cancelados']:,} ({taxa_churn:.1f}%)")
print(f"   • Idade média: {kpis['idade_media_clientes']:.1f} anos")
print(f"   • Renda média: R$ {kpis['renda_media_clientes']:,.2f}")

print(f"\n🏆 DESTAQUES:")
print(f"   • Produto mais vendido: {kpis['produto_mais_vendido']}")
print(f"   • Estado com maior faturamento: {kpis['estado_maior_faturamento']}")
print(f"   • Cidade com maior faturamento: {kpis['cidade_maior_faturamento']}")

print(f"\n📅 PERÍODO:")
print(f"   • Início: {kpis['periodo_analise_inicio']}")
print(f"   • Fim: {kpis['periodo_analise_fim']}")

print("\n" + "="*80)
print("✅ TRATAMENTO CONCLUÍDO COM SUCESSO!")
print("="*80)
