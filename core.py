from datetime import timedelta
from datetime import datetime
from datetime import date
from datetime import time
import random

def agrupar(iteravel, tamanho_do_grupo):
    return zip(*[iter(iteravel)]*tamanho_do_grupo)

class Registro:

    def __init__(self, dia):
        self.marcacoes = []
        self.dia = dia

    def marcar(self, horario):
        self.marcacoes.append(horario)

    @property
    def eh_fim_de_semana(self):
        return self.dia.weekday() > 4

    @property
    def horario_total(self):
        duracao_dos_periodos = map(lambda periodo: periodo[1] - periodo[0], agrupar(self.marcacoes, 2))
        return sum(duracao_dos_periodos, timedelta(hours=0))

class GeradorDePonto:

    def __init__(self, horario_de_chegada_oficial, carga_horaria, minimo_de_almoco, variacao_maxima, tempo_de_almoco):
        self.carga_horaria = carga_horaria
        self.horario_de_chegada_oficial = horario_de_chegada_oficial
        self.minimo_de_almoco = minimo_de_almoco
        self.tempo_de_almoco = tempo_de_almoco
        self.variacao_maxima = variacao_maxima

    def obter_anotacoes_por_periodo(self, inicio, fim):
        if inicio > fim :
            raise Exception("Início e fim do período devem ser consecutivos")

        dia = inicio
        um_dia = timedelta(days=1)
        while dia <= fim:
            data_da_chegada_oficial = date(dia.year, dia.month, dia.day)
            anotacoes_do_dia = self.__obter_anotacoes_do_dia(data_da_chegada_oficial)
            yield anotacoes_do_dia
            dia += um_dia

    def __obter_anotacoes_do_dia(self, data_da_chegada_oficial):
        variacao_de_permanencia = self.__obter_variacao_aleatoria_de_tempo()
        variacao_da_chegada = self.__obter_variacao_aleatoria_de_tempo()
        duracao_do_almoco = timedelta(seconds=random.randint(self.minimo_de_almoco.total_seconds(), self.tempo_de_almoco.total_seconds()))
        metade_do_expediente = timedelta(seconds=self.carga_horaria.total_seconds() / 2)
        permanencia_da_manha = metade_do_expediente  + variacao_de_permanencia
        horario_de_chegada = datetime.combine(data_da_chegada_oficial, self.horario_de_chegada_oficial) + variacao_da_chegada
        saida_da_manha = horario_de_chegada + permanencia_da_manha
        chegada_da_tarde = saida_da_manha + duracao_do_almoco
        saida_da_tarde = chegada_da_tarde - variacao_de_permanencia + metade_do_expediente
        registro = Registro(data_da_chegada_oficial)
        registro.marcar(horario_de_chegada)
        registro.marcar(saida_da_manha)
        registro.marcar(chegada_da_tarde)
        registro.marcar(saida_da_tarde)
        return registro

    def __obter_variacao_aleatoria_de_tempo(self):
        segundos_da_variacao_maxima = self.variacao_maxima.total_seconds()
        return timedelta(seconds=random.randint(0, segundos_da_variacao_maxima)) * random.choice([-1, 1])