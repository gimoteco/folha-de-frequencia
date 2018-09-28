from prettytable import PrettyTable
from datetime import datetime, time
from datetime import timedelta
from folha_de_frequencia import GeradorDePonto
from folha_de_frequencia.helpers import formatar_hora
from folha_de_frequencia.helpers import converter_hora_em_texto_para_timedelta
from folha_de_frequencia.helpers import converter_hora_em_texto_para_time
from folha_de_frequencia.helpers import converter_data
from io import StringIO
import random
import argparse
import csv
import pyperclip

parser = argparse.ArgumentParser(description='Gera uma folha de ponto aleatória')
parser.add_argument('--carga_horaria', required=False, type=str, default="08:00", help="Carga horaria em horas")
parser.add_argument('--tempo_de_almoco', required=False, type=str, default="1:00", help="Tempo de almoço (Padrão: 1:00)")
parser.add_argument('--csv', required=False, type=str, default=None, help="Nome do arquivo csv de saída")
parser.add_argument('--variacao_maxima', required=False, type=str, default="0:30", help="Variacao máxima em minutos nos horários")
parser.add_argument('--minimo_de_almoco', required=False, type=str, default="1:00", help="Mínimo de almoço em minutos")
parser.add_argument('--hora_de_chegada', required=True, type=str, default="07:30", help="Horário de chegada oficial (ex: 07:00)")
parser.add_argument('--preencher_fim_de_semana', required=False, action='store_true', default=False, help="Bloquear o preenchimento dos finais de semana")
parser.add_argument('--enviar_para_area_de_transferencia', required=False, action='store_true', default=False, help="Copiar tabela para area de transferência")
parser.add_argument('--inicio', required=True, type=str, help="Data de início da folha de presença (ex: 01/04/18)")
parser.add_argument('--fim', required=True, type=str, help="Data de fim da folha de presença (ex: 25/04/18)")

args = parser.parse_args()

DIAS_DA_SEMANA = {5: 'SÁBADO', 6: 'DOMINGO'}
INICIO_DO_CALENDARIO = converter_data(args.inicio)
FIM_DO_CALENDARIO = converter_data(args.fim)
CARGA_HORARIA = converter_hora_em_texto_para_timedelta(args.carga_horaria)
VARIACAO_MAXIMA = converter_hora_em_texto_para_timedelta(args.variacao_maxima)
TEMPO_DE_ALMOCO = converter_hora_em_texto_para_timedelta(args.tempo_de_almoco)
MINIMO_DE_ALMOCO = converter_hora_em_texto_para_timedelta(args.minimo_de_almoco)
hora_da_chegada = converter_hora_em_texto_para_time(args.hora_de_chegada)

gerador = GeradorDePonto(hora_da_chegada, CARGA_HORARIA, MINIMO_DE_ALMOCO, VARIACAO_MAXIMA, TEMPO_DE_ALMOCO, args.preencher_fim_de_semana)
registros = gerador.obter_anotacoes_por_periodo(INICIO_DO_CALENDARIO, FIM_DO_CALENDARIO)

cabecalho = ["Data", "Entrada matutino", "Saída matutino", "Entrada vespertino", "Saída vespertino"]
tabela = PrettyTable(cabecalho)

conteudo_em_csv = StringIO()
spamwriter = csv.writer(conteudo_em_csv)
spamwriter.writerow(cabecalho)

for registro in registros:
    dia = registro.dia
    dia_formatado = dia.strftime('%d/%m')
    linha = [dia_formatado, *(map(lambda marcacao: formatar_hora(marcacao), registro.marcacoes) if any(registro.marcacoes) else ["", "", "", ""])]
    tabela.add_row(linha)
    spamwriter.writerow(linha)

linhas_da_tabela = tabela.get_string()

if args.csv:
    with open(args.csv, 'w', newline='') as arquivo_do_csv:
        arquivo_do_csv.write(conteudo_em_csv.getvalue())

if args.enviar_para_area_de_transferencia:
    pyperclip.copy(linhas_da_tabela)

print(linhas_da_tabela)
