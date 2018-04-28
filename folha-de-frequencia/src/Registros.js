import React, { Component } from 'react';
import {Table} from 'semantic-ui-react';
import moment from 'moment';
import PropTypes from 'prop-types';

class Registros extends Component {
  render() {
    return <Table id={this.props.id} collapsing striped compact size="small">
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
          {this.props.registros.map(registro => 
            <Table.Row key={registro.dia}>
              <Table.Cell>{moment.utc(registro.dia).format('DD/MM/YY')}</Table.Cell>
              {registro.marcacoes.map(marcacao => 
                <Table.Cell key={marcacao}>{moment.utc(marcacao).format('HH:mm')}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>;
  }
}

Registros.propTypes = {
    registros: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
};

export default Registros;
