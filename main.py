from prettytable import PrettyTable
from datetime import datetime
from datetime import timedelta
import random
import argparse
import csv

hoje = datetime.now()
parser = argparse.ArgumentParser(description='Gera uma folha de ponto aleatória')
parser.add_argument('--carga_horaria', required=False, type=int, default=8, help="Carga horaria em horas")
parser.add_argument('--minutos_de_almoco', required=False, type=int, default=60, help="Minutos de almoço")
parser.add_argument('--arquivo_de_saida', required=False, type=str, default='folha_de_frequencia.csv', help="Nome do arquivo csv de saída")
parser.add_argument('--variacao_maxima', required=False, type=int, default=30, help="Variacao máxima em minutos nos horários")
parser.add_argument('--minimo_de_almoco', required=False, type=int, default=60, help="Mínimo de almoço em minutos")
parser.add_argument('--hora_de_chegada', required=True, type=str, default="07:30", help="Horário de chegada oficial (ex: 07:00)")
parser.add_argument('--preencher_fim_de_semana', required=False, action='store_true', default=False, help="Bloquear o preenchimento dos finais de semana")
parser.add_argument('--inicio', required=True, type=str, help="Data de início da folha de presença (ex: 01/04/18)")
parser.add_argument('--fim', required=True, type=str, help="Data de fim da folha de presença (ex: 25/04/18)")

args = parser.parse_args()

INICIO_DO_CALENDARIO = datetime.strptime(args.inicio, '%d/%m/%y')
FIM_DO_CALENDARIO = datetime.strptime(args.fim, '%d/%m/%y')
HORA_DA_CHEGADA, MINUTO_DA_CHEGADA = map(lambda parte: int(parte), args.hora_de_chegada.split(':'))
DIAS_DA_SEMANA = {5: 'SÁBADO', 6: 'DOMINGO'}

def obter_anotacoes(chegada_oficial):
    variacao_de_permanencia = timedelta(minutes=random.randint(0, args.variacao_maxima)) * random.choice([-1, 1])
    variacao_da_chegada = timedelta(minutes=random.randint(0, args.variacao_maxima)) * random.choice([-1, 1])
    duracao_do_almoco = timedelta(minutes=random.randint(args.minimo_de_almoco, args.minutos_de_almoco))
    metade_do_expediente = timedelta(hours=args.carga_horaria / 2)
    permanencia_da_manha = metade_do_expediente  + variacao_de_permanencia
    horario_de_chegada = chegada_oficial + variacao_da_chegada
    saida_da_manha = horario_de_chegada + permanencia_da_manha
    chegada_da_tarde = saida_da_manha + duracao_do_almoco
    saida_da_tarde = chegada_da_tarde - variacao_de_permanencia + metade_do_expediente
    total = saida_da_manha - horario_de_chegada + saida_da_tarde - chegada_da_tarde
    return (horario_de_chegada, saida_da_manha, chegada_da_tarde, saida_da_tarde, total)

def formatar_hora(data):
    return data.strftime('%H:%M')

cabecalho = ["Data", "Entrada matutino", "Saída matutino", "Entrada vespertino", "Saída vespertino", "Horas extras", "Assinatura"]
tabela = PrettyTable(cabecalho)
tabela.padding_width = 1
dia = INICIO_DO_CALENDARIO
um_dia = timedelta(days=1)

with open(args.arquivo_de_saida, 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile)
    spamwriter.writerow(cabecalho)    
    while dia <= FIM_DO_CALENDARIO:
        dia_formatado = dia.strftime('%d/%m')
        anotacoes_do_dia = obter_anotacoes(datetime(dia.year, dia.month, dia.day, HORA_DA_CHEGADA, MINUTO_DA_CHEGADA))
        linha = []
        if dia.weekday() < 5 or args.preencher_fim_de_semana:
            linha = [dia_formatado, formatar_hora(anotacoes_do_dia[0]), formatar_hora(anotacoes_do_dia[1]), formatar_hora(anotacoes_do_dia[2]), formatar_hora(anotacoes_do_dia[3]), "" , ""]
            tabela.add_row(linha)
            spamwriter.writerow(linha)
        else:
            dia_da_semana = DIAS_DA_SEMANA[dia.weekday()]
            linha = [dia_formatado] + [dia_da_semana] * 6
            tabela.add_row(linha)
            spamwriter.writerow(linha)
        dia += um_dia    

linhas_da_tabela = tabela.get_string()
print(linhas_da_tabela)