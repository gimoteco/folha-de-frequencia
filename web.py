from flask import Flask, render_template, jsonify, request
from core import GeradorDePonto
from datetime import time, datetime, timedelta
from helpers import converter_hora_em_texto_para_timedelta
from helpers import converter_hora_em_texto_para_time
from helpers import converter_data
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

def mapear_registro(registro):
    return {'dia': registro.dia, 'marcacoes': registro.marcacoes}

def str2bool(v):
  return v.lower() in ("yes", "true", "t", "1")

@app.route('/folhadefrequencia', methods=['GET'])
def obter_ponto():
    hora_de_chegada = converter_hora_em_texto_para_time(request.args.get('hora_de_chegada'))
    carga_horaria = converter_hora_em_texto_para_timedelta(request.args.get('carga_horaria'))
    preencher_fds = str2bool(request.args.get('preencher_fim_de_semana'))
    minimo_de_almoco = converter_hora_em_texto_para_timedelta(request.args.get('minimo_de_almoco'))
    variacao_maxima = converter_hora_em_texto_para_timedelta(request.args.get('variacao_maxima'))
    tempo_de_almoco = converter_hora_em_texto_para_timedelta(request.args.get('tempo_de_almoco'))

    gerador = GeradorDePonto(hora_de_chegada, carga_horaria, minimo_de_almoco, variacao_maxima, tempo_de_almoco, preencher_fds)
    inicio = converter_data(request.args.get('inicio'))
    fim = converter_data(request.args.get('fim'))

    registros = gerador.obter_anotacoes_por_periodo(inicio, fim)
    registros = map(mapear_registro, registros)
    return jsonify(list(registros))

if __name__ == '__main__':
    app.run()
