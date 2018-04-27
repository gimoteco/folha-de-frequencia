import React, { Component } from 'react';
import {Icon, Table, Button, Form, Checkbox, Segment, Container} from 'semantic-ui-react';
import axios from 'axios';
import moment from 'moment';
import ClipboardJS from 'clipboard';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registros: [],
      cargaHoraria: "8:00",
      variacaoMaxima: "0:30",
      minimoDeAlmoco: "1:00",
      duracaoDoAlmoco: "1:30",
      inicio: "29/03/2018",
      fim:  new Date()
    };
  }

  componentDidMount() {
    const parametros = {
      hora_de_chegada: '7:30',
      carga_horaria: '8:00',
      preencher_fim_de_semana: 0,
      minimo_de_almoco: '1:00',
      variacao_maxima: '0:30',
      tempo_de_almoco: '1:30',
      inicio: '26/03/18',
      fim: '22/04/18'
    }
    axios.get('http://127.0.0.1:5000/folhadefrequencia', {params: parametros})
      .then(response => {
        this.setState({registros: response.data})
      })
      .catch(function (error) {
        console.log(error);
      });
    new ClipboardJS('#copiar');
  }

  render() {
    const table = <Table id="registros" collapsing striped compact size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Dia</Table.HeaderCell>
            <Table.HeaderCell>Entrada</Table.HeaderCell>
            <Table.HeaderCell>Saída</Table.HeaderCell>
            <Table.HeaderCell>Entrada</Table.HeaderCell>
            <Table.HeaderCell>Saída</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {this.state.registros.map(registro => 
            <Table.Row key={registro.dia}>
              <Table.Cell>{moment.utc(registro.dia).format('DD/MM/YY')}</Table.Cell>
              {registro.marcacoes.map(marcacao => 
                <Table.Cell key={marcacao}>{moment.utc(marcacao).format('HH:mm')}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>;
    return (
    <Container>
      <Segment>
        <Form onSubmit={this.gerarFolhaFrequencia}>
          <Form.Field>
            <label>Carga horária</label>
            <input placeholder='Carga horária' value={this.state.cargaHoraria} onChange={(event) => this.setState({cargaHoraria: event.target.value})} />
          </Form.Field>
          <Form.Field>
            <label>Variação máxima</label>
            <input placeholder='Variação máxima' value={this.state.variacaoMaxima} />
          </Form.Field>
          <Form.Field>
            <label>Mínimo de almoço</label>
            <input placeholder='Mínimo de almoço' value={this.state.minimoDeAlmoco} />
          </Form.Field>
          <Form.Field>
            <label>Duração do almoço</label>
            <input placeholder='Duração do almoço' value={this.state.duracaoDoAlmoco} />
          </Form.Field>
          <Form.Field>
            <label>Hora de chegada oficial</label>
            <input placeholder='Duração do almoço' value={this.state.horaDeChegada} />
          </Form.Field>
          <Form.Field>
            <label>Data inicial do período</label>
            <input type="date" placeholder='Início' value={this.state.inicio} />
          </Form.Field>
          <Form.Field>
            <label>Data final do período</label>
            <input type="date" placeholder='Fim' value={this.state.fim} />
          </Form.Field>
          <Form.Field>
            <Checkbox label='Preencher os finais de semana' value="1" />
          </Form.Field>
          <Button primary type='submit'>Gerar folha de frequência</Button>
        </Form>
      </Segment>
      
      <Button id="copiar" data-clipboard-target="#registros" content='Copiar para área de transferência' icon='clipboard' />
      {table}
    </Container>);
  }
}

export default App;
