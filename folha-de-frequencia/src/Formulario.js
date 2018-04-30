import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Accordion, Icon} from 'semantic-ui-react';
import axios from 'axios';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

class Formulario extends Component {
    tratarMudanca = (e, { name, value, checked }) => this.setState({ [name]: value || checked });
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }
    tratarMudancaNoTimePicker = (value, name) => {
        this.setState({ [name]: value.format('HH:mm') })
    } 

    constructor(props) {
        super(props);
        this.state = {
            preencherFinaisDeSemana: false,
            cargaHoraria: "08:00",
            variacaoMaxima: "00:30",
            horaDeChegada: "07:30",
            minimoDeAlmoco: "01:00",
            duracaoDoAlmoco: "01:30",
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

  render() {
    return <Form onSubmit={() => this.enviar()}>
        <Form.Group>
            <Form.Field>
                <label>Hora de chegada</label>
                <TimePicker showSecond={false} defaultValue={moment(this.state.horaDeChegada, "HH:mm")}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "horaDeChegada")} />
            </Form.Field>
            <Form.Field>
                <label>Carga horária</label>
                <TimePicker showSecond={false} defaultValue={moment(this.state.cargaHoraria, "HH:mm")}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "cargaHoraria")} />
            </Form.Field>
            <Form.Field>
                <label>Duração do almoço</label>
                <TimePicker showSecond={false} defaultValue={moment(this.state.duracaoDoAlmoco, "HH:mm")}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "duracaoDoAlmoco")} />
            </Form.Field>
        </Form.Group>

        <Form.Group>
            <Form.Input label="Início do período" name="inicio" value={this.state.inicio} onChange={this.tratarMudanca} />
            <Form.Input label="Fim do período" name="fim" value={this.state.fim} onChange={this.tratarMudanca} />
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
                        <TimePicker showSecond={false} defaultValue={moment(this.state.minimoDeAlmoco, "HH:mm")}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "minimoDeAlmoco")} />
                    </Form.Field>
                    <Form.Field>
                        <label>Adiantamento ou atraso máximo</label>
                        <TimePicker showSecond={false} defaultValue={moment(this.state.variacaoMaxima, "HH:mm")}  onChange={(valor) => this.tratarMudancaNoTimePicker(valor, "variacaoMaxima")} />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Checkbox label="Preencher os finais de semana" name="preencherFinaisDeSemana" checked={this.state.preencherFinaisDeSemana} onChange={this.tratarMudanca}/>
                </Form.Group>
            </Accordion.Content>
        </Accordion>
                
        <Button primary type='submit'>Gerar folha de frequência</Button>
    </Form>
  }
}

Formulario.propTypes = {
    registrosCarregados: PropTypes.func.isRequired
};

export default Formulario;
