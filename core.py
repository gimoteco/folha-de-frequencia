from datetime import timedelta
from datetime import datetime
import random

class GeradorDePonto:

    def __init__(self, horario_de_chegada_oficial, carga_horaria, preencher_fim_de_semana, minimo_de_minutos_de_almoco, variacao_maxima, minutos_de_almoco):
        self.carga_horaria = carga_horaria
        self.horario_de_chegada_oficial = horario_de_chegada_oficial
        self.preencher_fim_de_semana = preencher_fim_de_semana
        self.minimo_de_minutos_de_almoco = minimo_de_minutos_de_almoco
        self.minutos_de_almoco = minutos_de_almoco
        self.variacao_maxima = variacao_maxima

    def obter_anotacoes_por_periodo(self, inicio, fim):
        dia = inicio
        um_dia = timedelta(days=1)
        while dia <= fim:
            data_da_chegada_oficial = datetime(dia.year, dia.month, dia.day, self.horario_de_chegada_oficial.hour, self.horario_de_chegada_oficial.minute)
            anotacoes_do_dia = self.obter_anotacoes(data_da_chegada_oficial)
            registros_do_dia = (dia, )
            eh_dia_de_semana = dia.weekday() < 5
            if eh_dia_de_semana or self.preencher_fim_de_semana:
                registros_do_dia = registros_do_dia + anotacoes_do_dia
            dia += um_dia
            yield registros_do_dia

    def obter_anotacoes(self, data_da_chegada_oficial):
        variacao_de_permanencia = self.obter_variacao_aleatoria_de_tempo()
        variacao_da_chegada = self.obter_variacao_aleatoria_de_tempo()
        duracao_do_almoco = timedelta(minutes=random.randint(self.minimo_de_minutos_de_almoco, self.minutos_de_almoco))
        metade_do_expediente = timedelta(hours=self.carga_horaria / 2)
        permanencia_da_manha = metade_do_expediente  + variacao_de_permanencia
        horario_de_chegada = data_da_chegada_oficial + variacao_da_chegada
        saida_da_manha = horario_de_chegada + permanencia_da_manha
        chegada_da_tarde = saida_da_manha + duracao_do_almoco
        saida_da_tarde = chegada_da_tarde - variacao_de_permanencia + metade_do_expediente
        total = saida_da_manha - horario_de_chegada + saida_da_tarde - chegada_da_tarde
        return (horario_de_chegada, saida_da_manha, chegada_da_tarde, saida_da_tarde, total)

    def obter_variacao_aleatoria_de_tempo(self):
        return timedelta(minutes=random.randint(0, self.variacao_maxima)) * random.choice([-1, 1])