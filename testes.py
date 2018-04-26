import unittest
from core import GeradorDePonto
from datetime import time
from datetime import datetime
from datetime import timedelta

class TestesDoGerador(unittest.TestCase):
    horario_de_chegada_oficial = time(hour=7, minute=30)
    carga_horaria = timedelta(hours=8)
    minimo_de_minutos_de_almoco = 60
    minutos_de_almoco = 120
    variacao_maxima = 30
    inicio_do_periodo = datetime(2018, 4, 1)
    fim_do_periodo = datetime(2018, 4, 30)
    eh_fim_de_semana = lambda self, dia: dia[0].weekday() > 4
    tem_registros = lambda self, registro: len(registro) > 1
    preencher_fim_de_semana = False
    
    def test_nao_deve_gerar_registros_pro_fim_de_semana_quando_setado(self):
        preencher_fim_de_semana = False
        gerador = GeradorDePonto(self.horario_de_chegada_oficial, self.carga_horaria, preencher_fim_de_semana, self.minimo_de_minutos_de_almoco, self.variacao_maxima, self.minutos_de_almoco)
        nao_tem_registros = lambda registro: len(registro) == 1

        registros = gerador.obter_anotacoes_por_periodo(self.inicio_do_periodo, self.fim_do_periodo)
        
        assert all(map(self.eh_fim_de_semana, filter(nao_tem_registros, registros)))

    def test_deve_gerar_registros_pro_fim_de_semana_quando_setado(self):
        preencher_fim_de_semana = True
        gerador = GeradorDePonto(self.horario_de_chegada_oficial, self.carga_horaria, preencher_fim_de_semana, self.minimo_de_minutos_de_almoco, self.variacao_maxima, self.minutos_de_almoco)

        registros = gerador.obter_anotacoes_por_periodo(self.inicio_do_periodo, self.fim_do_periodo)
        
        assert all(map(self.tem_registros, filter(self.eh_fim_de_semana, registros)))

    def test_deve_gerar_todos_os_dias_dentro_do_periodo(self):
        inicio = datetime(2018, 4, 1)
        fim = datetime(2018, 4, 30)
        gerador = GeradorDePonto(self.horario_de_chegada_oficial, self.carga_horaria, self.preencher_fim_de_semana, self.minimo_de_minutos_de_almoco, self.variacao_maxima, self.minutos_de_almoco)
        esta_dentro_do_periodo = lambda registro: registro[0] >= inicio and registro[0] <= fim

        registros = gerador.obter_anotacoes_por_periodo(inicio, fim)

        assert all(map(esta_dentro_do_periodo, registros))

    def test_todos_os_registros_nao_ultrapassam_a_carga_horaria(self):
        carga_horaria = timedelta(hours=8)
        calcular_duracao_do_expediente = lambda registro: registro[2] - registro[1] + registro[4] - registro[3]
        gerador = GeradorDePonto(self.horario_de_chegada_oficial, carga_horaria, self.preencher_fim_de_semana, self.minimo_de_minutos_de_almoco, self.variacao_maxima, self.minutos_de_almoco)

        registros = gerador.obter_anotacoes_por_periodo(self.inicio_do_periodo, self.fim_do_periodo)

        dias_trabalhados = filter(self.tem_registros, registros)
        assert all(map(lambda registro: calcular_duracao_do_expediente(registro) == carga_horaria, dias_trabalhados))

    def test_todos_os_registros_estao_dentro_da_variacao_maxima(self):
        variacao_maxima = 30
        horario_de_chegada_oficial = time(hour=7, minute=30)
        gerador = GeradorDePonto(horario_de_chegada_oficial, self.carga_horaria, self.preencher_fim_de_semana, self.minimo_de_minutos_de_almoco, variacao_maxima, self.minutos_de_almoco)
        
        registros = gerador.obter_anotacoes_por_periodo(self.inicio_do_periodo, self.fim_do_periodo)

        dias_trabalhados = filter(self.tem_registros, registros)
        assert all(map(lambda registro: self.esta_dentro_da_variacao(registro[0], horario_de_chegada_oficial, registro[1], variacao_maxima), dias_trabalhados))

    @staticmethod
    def esta_dentro_da_variacao(dia, horario_oficial_de_chegada, horario_com_variacao, variacao):
        horario_original = datetime(dia.year, dia.month, dia.day, horario_oficial_de_chegada.hour, horario_oficial_de_chegada.minute)
        variacao_realizada = horario_com_variacao - horario_original
        return abs(variacao_realizada.total_seconds()) <= timedelta(minutes=variacao).total_seconds()

if __name__ == "__main__":
    unittest.main()