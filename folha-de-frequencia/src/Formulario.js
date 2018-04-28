import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Form} from 'semantic-ui-react';
import axios from 'axios';

class Formulario extends Component {
    tratarMudanca = (e, { name, value, checked }) => this.setState({ [name]: value || checked });

    constructor(props) {
        super(props);
        this.state = {
            preencherFinaisDeSemana: false,
            cargaHoraria: "8:00",
            variacaoMaxima: "0:30",
            horaDeChegada: "7:30",
            minimoDeAlmoco: "1:00",
            duracaoDoAlmoco: "1:30",
            inicio: "29/03/18",
            fim: "30/04/18"
        };
    }

    enviar() {
        const { 
            cargaHoraria, variacaoMaxima,
            minimoDeAlmoco, duracaoDoAlmoco,
            horaDeChegada, inicio, fim,
            preencherFinaisDeSemana
        } = this.state;

        const parametros = {
            hora_de_chegada: horaDeChegada,
            carga_horaria: cargaHoraria,
            preencher_fim_de_semana: preencherFinaisDeSemana,
            minimo_de_almoco: minimoDeAlmoco,
            variacao_maxima: variacaoMaxima,
            tempo_de_almoco: duracaoDoAlmoco,
            inicio: inicio,
            fim: fim
        }

        axios.get('http://127.0.0.1:5000/folhadefrequencia', {params: parametros})
            .then(resposta => {
                this.props.registrosCarregados(resposta.data);
            })
            .catch(function (error) {
            console.log(error);
            });        
    }

    carregarRegistros(parametros) {

      }

  render() {
    return <Form onSubmit={() => this.enviar()}>
        <Form.Input label="Carga horária" name="cargaHoraria" value={this.state.cargaHoraria} onChange={this.tratarMudanca} />
        <Form.Input label="Variação máxima" name="variacaoMaxima" value={this.state.variacaoMaxima} onChange={this.tratarMudanca} />
        <Form.Input label="Mínimo de almoço" name="minimoDeAlmoco" value={this.state.minimoDeAlmoco} onChange={this.tratarMudanca} />
        <Form.Input label="Duração do almoço" name="duracaoDoAlmoco" value={this.state.duracaoDoAlmoco} onChange={this.tratarMudanca} />    
        <Form.Input label="Hora de chegada" name="horaDeChegada" value={this.state.horaDeChegada} onChange={this.tratarMudanca} />
        <Form.Input label="Início do período" name="inicio" value={this.state.inicio} onChange={this.tratarMudanca} />
        <Form.Input label="Fim do período" name="fim" value={this.state.fim} onChange={this.tratarMudanca} />
        <Form.Checkbox label="Preencher os finais de semana" name="preencherFinaisDeSemana" checked={this.state.preencherFinaisDeSemana} onChange={this.tratarMudanca}/>
        <Button primary type='submit'>Gerar folha de frequência</Button>
    </Form>
  }
}

Formulario.propTypes = {
    aoEnviar: PropTypes.func.isRequired
};

export default Formulario;
