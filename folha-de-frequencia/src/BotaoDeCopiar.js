import React, { Component } from 'react';
import {Button} from 'semantic-ui-react';
import ClipboardJS from 'clipboard';
import PropTypes from 'prop-types';

class BotaoDeCopiar extends Component {
  estadoInicial = {
    mensagem: 'Copiar para área de transferência',
    carregando: false,
    icone: 'clipboard'
  };
  TEMPO_DA_MENSAGEM_DE_FEEDBACK = 3000
  TEMPO_DO_LOADING = 500

  constructor(props) {
    super(props);
    this.state = this.estadoInicial;
  }

  exibirBotaoParaCopiar() {
    this.setState(this.estadoInicial);
  }

  exibirLoading() {
    this.setState({
      carregando: true,
      icone: ''
    });
  }

  exibirMensagemDeFeedbackDaCopia() {
    this.setState({
      carregando: false,
      icone: 'checkmark',
      mensagem: 'Registros copiados com sucesso'
    });
  }

  componentDidMount() {
    this.exibirBotaoParaCopiar();
    const clipboard = new ClipboardJS(`#${this.props.id}`);

    clipboard.on('success', (e) => {
      e.clearSelection();
      this.exibirLoading();
      setTimeout(() => {
        this.exibirMensagemDeFeedbackDaCopia()
        setTimeout(() => {
          this.exibirBotaoParaCopiar();
        }, this.TEMPO_DA_MENSAGEM_DE_FEEDBACK);
      }, this.TEMPO_DO_LOADING)      
    });
  }

  render() {
    return <Button loading={this.state.carregando} id={this.props.id} data-clipboard-target={this.props.alvo} content={this.state.mensagem} icon={this.state.icone} />
  }
}

BotaoDeCopiar.propTypes = {
  alvo: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default BotaoDeCopiar;
