import json
import base64
import re

# Lê o arquivo HTML
with open('user_read_only_context/text_attachments/AIA_APP_Modificado-qSZeV.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Extrai o base64 entre atob(' e ')
match = re.search(r"atob$$'([^']+)'$$", html_content)

if match:
    base64_data = match.group(1)
    
    # Decodifica o base64
    decoded_bytes = base64.b64decode(base64_data)
    
    # Converte de Latin-1 para UTF-8 (escape/unescape do JavaScript)
    decoded_str = decoded_bytes.decode('latin-1')
    
    # Parse JSON
    data = json.loads(decoded_str)
    
    print(f"Total de blocos de infrações: {len(data)}")
    
    total_infracoes = sum(len(bloco['infracoes']) for bloco in data)
    print(f"Total de infrações: {total_infracoes}")
    
    # Salva em um arquivo JSON limpo
    with open('scripts/infracoes-completas.json', 'w', encoding='utf-8') as out:
        json.dump(data, out, ensure_ascii=False, indent=2)
    
    print("Dados extraídos com sucesso para scripts/infracoes-completas.json")
else:
    print("Não foi possível encontrar os dados base64 no HTML")
