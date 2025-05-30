import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useRouter } from 'next/router';

// API client
import { apiClient } from '@/lib/api-client';

/**
 * Hook personalizado para validação de agentes
 * 
 * Este hook gerencia o estado e as operações relacionadas à validação
 * de agentes gerados automaticamente pelo sistema.
 * 
 * @param {number|string} agentId - ID do agente a ser validado
 * @returns {Object} - Estado e funções para validação de agentes
 */
export const useAgentValidation = (agentId) => {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  
  // Buscar dados do agente
  const {
    data: agent,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['agent', agentId],
    async () => {
      if (!agentId) return null;
      const response = await apiClient.get(`/api/agents/${agentId}`);
      return response.data;
    },
    {
      enabled: !!agentId,
      retry: 1,
      onError: (err) => {
        console.error('Erro ao buscar dados do agente:', err);
      }
    }
  );
  
  // Mutação para validar o agente
  const validateMutation = useMutation(
    async (validationData) => {
      const response = await apiClient.post('/api/agents/validate', validationData);
      return response.data;
    },
    {
      onSuccess: () => {
        // Atualizar dados do agente após validação
        refetch();
      },
      onError: (err) => {
        console.error('Erro ao validar agente:', err);
        throw err;
      }
    }
  );
  
  /**
   * Função para validar um agente
   * 
   * @param {Object} validationData - Dados de validação
   * @param {number} validationData.agentId - ID do agente
   * @param {boolean} validationData.approved - Se o agente foi aprovado
   * @param {string} validationData.feedback - Feedback do usuário
   * @param {Object} validationData.modifications - Modificações a serem aplicadas
   * @returns {Promise} - Promessa resolvida após validação
   */
  const validateAgent = async (validationData) => {
    try {
      setIsValidating(true);
      await validateMutation.mutateAsync(validationData);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsValidating(false);
    }
  };
  
  return {
    agent,
    isLoading,
    error,
    validateAgent,
    isValidating
  };
};
