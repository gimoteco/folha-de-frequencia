import React, { Component } from 'react';
import {Table} from 'semantic-ui-react';
import moment from 'moment';
import PropTypes from 'prop-types';

class Registros extends Component {

  obterLinha(registro) {
    const dia = moment.utc(registro.dia)
    const celulaDoDia = <Table.Cell>{dia.format('DD/MM/YY')}</Table.Cell>;
    if (registro.marcacoes.some(_ => _))
      return <Table.Row key={registro.dia}>
      {celulaDoDia}
      {registro.marcacoes.map(marcacao =>
      <Table.Cell key={marcacao}>{moment.utc(marcacao).format('HH:mm')}</Table.Cell>
      )}
    </Table.Row>

    const diaDaSemana = dia.format('dddd');
    return <Table.Row>
      {celulaDoDia}
      <Table.Cell>{diaDaSemana}</Table.Cell>
      <Table.Cell>{diaDaSemana}</Table.Cell>
      <Table.Cell>{diaDaSemana}</Table.Cell>
      <Table.Cell>{diaDaSemana}</Table.Cell>
    </Table.Row>
  }

  render() {
    return <Table id={this.props.id} textAlign="center" striped>
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
          {this.props.registros.map(this.obterLinha)}
        </Table.Body>
      </Table>;
  }
}

Registros.propTypes = {
    registros: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
};

export default Registros;
