import React, { Component } from 'react';
import {Segment, Container} from 'semantic-ui-react';
import BotaoDeCopiar from './BotaoDeCopiar'
import Registros from './Registros';
import Formulario from './Formulario';
import axios from 'axios';

class App extends Component {
  ID_DA_TABELA_DE_REGISTROS = 'registros';

  constructor(props) {
    
    super(props);
    this.state = {
        registros: []
    };
  }

  componentDidMount() {
    this.formulario.enviar();
  }

  carregarRegistros(parametros) {
    axios.get('http://127.0.0.1:5000/folhadefrequencia', {params: parametros})
      .then(response => {
        this.setState({registros: response.data})
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
    <Container>
      <Segment>
        <Formulario aoEnviar={(dados) => this.carregarRegistros(dados)} ref={(referencia) => this.formulario = referencia} />
      </Segment>
      <BotaoDeCopiar id="copiarParaAreaDeTransferencia" alvo={`#${this.ID_DA_TABELA_DE_REGISTROS}`} />
      <Registros registros={this.state.registros} id={this.ID_DA_TABELA_DE_REGISTROS} />
    </Container>);
  }
}

export default App;
