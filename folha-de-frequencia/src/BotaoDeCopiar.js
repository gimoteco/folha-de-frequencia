import React, { Component } from 'react';
import {Button} from 'semantic-ui-react';
import ClipboardJS from 'clipboard';
import PropTypes from 'prop-types';

class BotaoDeCopiar extends Component {

  componentDidMount() {
    new ClipboardJS(`#${this.props.id}`);
  }

  render() {
    return <Button id={this.props.id} data-clipboard-target={this.props.alvo} content='Copiar para área de transferência' icon='clipboard' />
  }
}

BotaoDeCopiar.propTypes = {
  alvo: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default BotaoDeCopiar;
