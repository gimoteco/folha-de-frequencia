import React, { Component } from 'react';
import {Segment, Container} from 'semantic-ui-react';
import BotaoDeCopiar from './BotaoDeCopiar'
import Registros from './Registros';
import Formulario from './Formulario';

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

  carregarRegistros = (registros) => this.setState({registros: registros})

  render() {
    return (
    <Container>
      <Segment>
        <Formulario registrosCarregados={this.carregarRegistros} ref={(referencia) => this.formulario = referencia} />
      </Segment>
      <BotaoDeCopiar id="copiarParaAreaDeTransferencia" alvo={`#${this.ID_DA_TABELA_DE_REGISTROS}`} />
      <Registros registros={this.state.registros} id={this.ID_DA_TABELA_DE_REGISTROS} />
    </Container>);
  }
}

export default App;
