from prettytable import PrettyTable
from datetime import datetime, time
from datetime import timedelta
from core import GeradorDePonto
from io import StringIO
import random
import argparse
import csv
import pyperclip

def formatar_hora(data):
    return data.strftime('%H:%M')

def converter_hora_em_texto_para_timedelta(hora):
    HORAS, MINUTOS = map(lambda parte: int(parte), hora.split(':'))
    return timedelta(hours=HORAS, minutes=MINUTOS)

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

INICIO_DO_CALENDARIO = datetime.strptime(args.inicio, '%d/%m/%y')
FIM_DO_CALENDARIO = datetime.strptime(args.fim, '%d/%m/%y')
HORA_DA_CHEGADA, MINUTO_DA_CHEGADA = map(lambda parte: int(parte), args.hora_de_chegada.split(':'))
CARGA_HORARIA = converter_hora_em_texto_para_timedelta(args.carga_horaria)
VARIACAO_MAXIMA = converter_hora_em_texto_para_timedelta(args.variacao_maxima)
TEMPO_DE_ALMOCO = converter_hora_em_texto_para_timedelta(args.tempo_de_almoco)
MINIMO_DE_ALMOCO = converter_hora_em_texto_para_timedelta(args.minimo_de_almoco)
DIAS_DA_SEMANA = {5: 'SÁBADO', 6: 'DOMINGO'}
hora_da_chegada = time(hour=HORA_DA_CHEGADA, minute=MINUTO_DA_CHEGADA)
gerador = GeradorDePonto(hora_da_chegada, CARGA_HORARIA, args.preencher_fim_de_semana, MINIMO_DE_ALMOCO, VARIACAO_MAXIMA, TEMPO_DE_ALMOCO)
registros = gerador.obter_anotacoes_por_periodo(INICIO_DO_CALENDARIO, FIM_DO_CALENDARIO)

cabecalho = ["Data", "Entrada matutino", "Saída matutino", "Entrada vespertino", "Saída vespertino"]
tabela = PrettyTable(cabecalho)

conteudo_em_csv = StringIO()
spamwriter = csv.writer(conteudo_em_csv)
spamwriter.writerow(cabecalho)

for registro in registros:
    dia = registro.dia
    dia_formatado = dia.strftime('%d/%m')
    anotacoes_do_dia = registro.marcacoes
    if dia.weekday() < 5 or args.preencher_fim_de_semana:
        linha = [dia_formatado, formatar_hora(anotacoes_do_dia[0]), formatar_hora(anotacoes_do_dia[1]), formatar_hora(anotacoes_do_dia[2]), formatar_hora(anotacoes_do_dia[3])]
        tabela.add_row(linha)
        spamwriter.writerow(linha)
    else:
        dia_da_semana = DIAS_DA_SEMANA[dia.weekday()]
        linha = [dia_formatado] + [dia_da_semana] * 4
        tabela.add_row(linha)
        spamwriter.writerow(linha)

linhas_da_tabela = tabela.get_string()

if args.csv:
    with open(args.csv, 'w', newline='') as arquivo_do_csv:
        arquivo_do_csv.write(conteudo_em_csv.getvalue())

if args.enviar_para_area_de_transferencia:
    pyperclip.copy(linhas_da_tabela)

print(linhas_da_tabela)