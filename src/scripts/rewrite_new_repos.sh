#!/bin/bash

# Script para reescrever a autoria dos commits nos novos repositórios
# Autor: Hélio Guilherme Dias Silva

NEW_NAME="Hélio Guilherme Dias Silva"
NEW_EMAIL="helio@nowgo.com.br"  # Email confirmado pelo usuário
# TOKEN deve ser fornecido como variável de ambiente ou argumento
# Exemplo: TOKEN=seu_token_aqui ./rewrite_new_repos.sh

REPOS_DIR="/home/ubuntu/new_github_repos"
LOG_FILE="/home/ubuntu/new_repos_rewrite_log.txt"

echo "Iniciando reescrita de autoria em $(date)" > $LOG_FILE
echo "Nova autoria: $NEW_NAME <$NEW_EMAIL>" >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE

# Função para reescrever a autoria em um repositório
rewrite_repo() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    echo "Processando repositório: $repo_name" | tee -a $LOG_FILE
    
    # Verificar se o diretório existe e é um repositório git
    if [ ! -d "$repo_dir/.git" ]; then
        echo "  ERRO: $repo_dir não é um repositório git válido" | tee -a $LOG_FILE
        return 1
    fi
    
    cd "$repo_dir"
    
    # Verificar se há commits no repositório
    if ! git log -1 &>/dev/null; then
        echo "  AVISO: Repositório $repo_name está vazio ou não tem commits" | tee -a $LOG_FILE
        return 0
    fi
    
    # Criar script de filtro para reescrever a autoria
    cat > /tmp/git_filter_script.sh << EOF
#!/bin/sh
git filter-branch --env-filter '
    export GIT_AUTHOR_NAME="$NEW_NAME"
    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
    export GIT_COMMITTER_NAME="$NEW_NAME"
    export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
' --tag-name-filter cat -- --all
EOF
    
    chmod +x /tmp/git_filter_script.sh
    
    # Executar o script de filtro
    echo "  Reescrevendo autoria..." | tee -a $LOG_FILE
    if /tmp/git_filter_script.sh >> $LOG_FILE 2>&1; then
        echo "  ✅ Autoria reescrita com sucesso para $repo_name" | tee -a $LOG_FILE
        return 0
    else
        echo "  ❌ Falha ao reescrever autoria para $repo_name" | tee -a $LOG_FILE
        return 1
    fi
}

# Função para fazer push forçado para o GitHub
push_repo() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    echo "Enviando alterações para GitHub: $repo_name" | tee -a $LOG_FILE
    
    cd "$repo_dir"
    
    # Verificar se o token foi fornecido
    if [ -z "$TOKEN" ]; then
        echo "  ❌ TOKEN não fornecido. Configure o token antes de executar o push." | tee -a $LOG_FILE
        return 1
    fi
    
    # Configurar credenciais temporárias
    git config credential.helper 'store --file=/tmp/git_credentials'
    echo "https://Helioguilhermediassilva:$TOKEN@github.com" > /tmp/git_credentials
    
    # Fazer push forçado
    if git push -f origin --all >> $LOG_FILE 2>&1; then
        echo "  ✅ Push realizado com sucesso para $repo_name" | tee -a $LOG_FILE
        
        # Push das tags também
        if git push -f origin --tags >> $LOG_FILE 2>&1; then
            echo "  ✅ Tags enviadas com sucesso para $repo_name" | tee -a $LOG_FILE
        else
            echo "  ⚠️ Aviso: Falha ao enviar tags para $repo_name" | tee -a $LOG_FILE
        fi
        
        return 0
    else
        echo "  ❌ Falha ao fazer push para $repo_name" | tee -a $LOG_FILE
        return 1
    fi
}

# Processar todos os repositórios
echo "Encontrados os seguintes repositórios:" | tee -a $LOG_FILE
ls -1 $REPOS_DIR | tee -a $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE

for repo in $(ls -d $REPOS_DIR/*); do
    if [ -d "$repo/.git" ]; then
        rewrite_repo "$repo"
        push_repo "$repo"
        echo "----------------------------------------" >> $LOG_FILE
    fi
done

echo "Processo concluído em $(date)" | tee -a $LOG_FILE
echo "Verifique o arquivo de log em $LOG_FILE para detalhes"

# Limpar credenciais temporárias
rm -f /tmp/git_credentials
rm -f /tmp/git_filter_script.sh

echo "Processo finalizado!"
