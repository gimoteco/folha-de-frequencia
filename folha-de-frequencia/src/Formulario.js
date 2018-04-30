import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Accordion, Icon} from 'semantic-ui-react';
import axios from 'axios';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import 'moment/locale/pt-br';
import DatePicker from 'react-datepicker';

import 'rc-time-picker/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';

class Formulario extends Component {
    FORMATO_DA_HORA = 'HH:mm';
    FORMATO_DA_DATA = 'DD/MM/YY';
    tratarMudanca = (e, { name, value, checked }) => value && this.setState({ [name]: value || checked });
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }
    tratarMudancaNoTimePicker = (value, name) => {
        this.setState({ [name]: value })
    }
    tratarMudancaNoDatePicker = (value, name) => {
        this.setState({ [name]: value })
    }

    limparCampos = () => {
        this.setState({
            preencherFinaisDeSemana: false,
            cargaHoraria: moment("08:00", this.FORMATO_DA_HORA),
            variacaoMaxima: moment("00:10", this.FORMATO_DA_HORA),
            horaDeChegada: moment("07:30", this.FORMATO_DA_HORA),
            minimoDeAlmoco: moment("01:00", this.FORMATO_DA_HORA),
            duracaoDoAlmoco: moment("01:30", this.FORMATO_DA_HORA),
            inicio: moment("29/03/18", this.FORMATO_DA_DATA),
            fim: moment("30/04/18", this.FORMATO_DA_DATA)
        });
    }

    componentWillMount() {
        this.limparCampos()
    }

    componentDidMount() {
        moment.locale('pt-BR');
    }

    enviar() {
        const { 
            cargaHoraria, variacaoMaxima,
            minimoDeAlmoco, duracaoDoAlmoco,
            horaDeChegada, inicio, fim,
            preencherFinaisDeSemana
        } = this.state;

        const parametros = {
            hora_de_chegada: horaDeChegada.format(this.FORMATO_DA_HORA),
            carga_horaria: cargaHoraria.format(this.FORMATO_DA_HORA),
            preencher_fim_de_semana: preencherFinaisDeSemana,
            minimo_de_almoco: minimoDeAlmoco.format(this.FORMATO_DA_HORA),
            variacao_maxima: variacaoMaxima.format(this.FORMATO_DA_HORA),
            tempo_de_almoco: duracaoDoAlmoco.format(this.FORMATO_DA_HORA),
            inicio: inicio.format(this.FORMATO_DA_DATA),
            fim: fim.format(this.FORMATO_DA_DATA)
        }

        axios.get('http://127.0.0.1:5000/folhadefrequencia', {params: parametros})
            .then(resposta => {
                this.props.registrosCarregados(resposta.data);
            })
            .catch(function (error) {
                console.log(error);
            });        
    }

  render() {
    return <Form onSubmit={() => this.enviar()}>
        <Form.Group>
            <Form.Field>
                <label>Hora de chegada</label>
                <TimePicker allowEmpty={false} showSecond={false} value={this.state.horaDeChegada} onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "horaDeChegada")} />
            </Form.Field>
            <Form.Field>
                <label>Carga horária</label>
                <TimePicker allowEmpty={false} showSecond={false} value={this.state.cargaHoraria} onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "cargaHoraria")} />
            </Form.Field>
            <Form.Field>
                <label>Duração do almoço</label>
                <TimePicker allowEmpty={false} showSecond={false} value={this.state.duracaoDoAlmoco}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "duracaoDoAlmoco")} />
            </Form.Field>
        </Form.Group>

        <Form.Group>
            <Form.Field>
                <label>Início do período</label>
                <DatePicker required selected={this.state.inicio} onChange={valor => this.tratarMudancaNoDatePicker(valor, 'inicio')} dateFormat={this.FORMATO_DA_DATA} />
            </Form.Field>

            <Form.Field>
                <label>Fim do período</label>
                <DatePicker minDate={this.state.inicio} required selected={this.state.fim} onChange={valor => this.tratarMudancaNoDatePicker(valor, 'fim')} dateFormat={this.FORMATO_DA_DATA} />
            </Form.Field>            
        </Form.Group>

        <Accordion>
            <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name='dropdown' />
                Opções avançadas
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 0}>
                <Form.Group>
                    <Form.Field>
                        <label>Duração mínima do almoço</label>
                        <TimePicker allowEmpty={false} showSecond={false} value={this.state.minimoDeAlmoco}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "minimoDeAlmoco")} />
                    </Form.Field>
                    <Form.Field>
                        <label>Adiantamento ou atraso máximo</label>
                        <TimePicker allowEmpty={false} showSecond={false} value={this.state.variacaoMaxima}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "variacaoMaxima")} />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Checkbox label="Preencher os finais de semana" name="preencherFinaisDeSemana" checked={this.state.preencherFinaisDeSemana} onChange={this.tratarMudanca}/>
                </Form.Group>
            </Accordion.Content>
        </Accordion>
                
        <Button primary type='submit'>Gerar folha de frequência</Button>
        <Button secondary type="button" onClick={this.limparCampos}>Resetar</Button>
    </Form>
  }
}

Formulario.propTypes = {
    registrosCarregados: PropTypes.func.isRequired
};

export default Formulario;
