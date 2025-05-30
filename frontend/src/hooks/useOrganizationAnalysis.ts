import React from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

// Hook personalizado para integração com o backend de análise organizacional
export function useOrganizationAnalysis() {
  const t = useTranslations('OrganizationAnalysis');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Função para enviar dados de análise organizacional
  const submitAnalysis = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/api/organization/analyze`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar análise organizacional:', error);
      throw new Error(error.response?.data?.message || t('error.submission'));
    }
  };
  
  // Mutation para enviar análise
  const mutation = useMutation({
    mutationFn: submitAnalysis,
    onSuccess: (data) => {
      console.log('Análise organizacional enviada com sucesso:', data);
    },
    onError: (error) => {
      console.error('Erro na mutação de análise organizacional:', error);
    }
  });
  
  // Função para obter resultados de análise por ID
  const getAnalysisResults = async (analysisId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/organization/analysis/${analysisId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter resultados da análise:', error);
      throw new Error(error.response?.data?.message || t('error.fetching'));
    }
  };
  
  // Função para obter histórico de análises
  const getAnalysisHistory = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/organization/analysis/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter histórico de análises:', error);
      throw new Error(error.response?.data?.message || t('error.history'));
    }
  };
  
  // Query para obter histórico de análises
  const historyQuery = useQuery({
    queryKey: ['analysisHistory'],
    queryFn: getAnalysisHistory,
    enabled: false, // Não executa automaticamente
  });
  
  return {
    // Função para enviar análise
    submitAnalysis: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    
    // Função para obter resultados específicos
    getAnalysisResults,
    
    // Histórico de análises
    getAnalysisHistory: historyQuery.refetch,
    analysisHistory: historyQuery.data,
    isHistoryLoading: historyQuery.isLoading,
    historyError: historyQuery.error
  };
}
