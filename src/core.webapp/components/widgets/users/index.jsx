/* @flow */
import React from 'react';
import Modal from 'react-modal';
import { graphql, compose } from 'react-apollo';

import Avatar from '../../avatar';
import Card from '../../card';
import Menu from '../../ui/menu';
import AddUserSheet from '../../onboarding/addUserSheet';
import { users as UsersQuery, removeUser } from './graphql';
import './users.styl';
import './modal.styl';

// type UserCardProps = { data: { error, loading, users =[] } };
// $FlowFixMe
export class UserCard extends React.Component<*> {
  constructor() {
    super();
    this.state = {
      addUserModalOpen: false,
    };
  }

  toggleAddUserModal: Function = () => {
    this.setState({ addUserModalOpen: !this.state.addUserModalOpen });
  };

  renderContent: Function = () => {
    const { data: { users = [] }, mutate } = this.props;
    if (!users.length) {
      return (
        <span className="card__content_empty">No users are registered.</span>
      );
    }

    return (
      <div>
        <table className="widget-table">
          <tbody>
            {users &&
              users.map(user => (
                <tr className="widget-table__row">
                  <td className="widget-table__cell widget-table__cell_first">
                    <Avatar
                      name={user.name
                        .split(' ')
                        .map(el => el[0])
                        .join('')}
                      online
                    />
                  </td>
                  <td className="widget-table__cell widget-table__cell_middle">
                    <div className="widget-table__cell-title">{user.name}</div>
                    <div className="widget-table__cell-subtitle">{user.id}</div>
                  </td>
                  <td className="widget-table__cell widget-table__cell_last">
                    <Menu
                      arrow
                      options={[
                        <a className="link" href="#">
                          More info
                        </a>,
                        <a
                          className="link link_red"
                          href="#"
                          onClick={() =>
                            mutate({
                              variables: { username: user.id },
                              refetchQueries: [{ query: UsersQuery }],
                            })}
                        >
                          Revoke access
                        </a>,
                      ]}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Modal
          isOpen={this.state.addUserModalOpen}
          onRequestClose={this.toggleAddUserModal}
          closeTimeoutMS={250}
          contentLabel="AddUserModal"
          className={{
            base: 'briskhome-modal__content',
            afterOpen: 'briskhome-modal__content_open',
            beforeClose: 'briskhome-modal__content_close',
          }}
          overlayClassName={{
            base: 'briskhome-modal__overlay',
            afterOpen: 'briskhome-modal__overlay_open',
            beforeClose: 'briskhome-modal__overlay_close',
          }}
          portalClassName="briskhome-modal"
        >
          <AddUserSheet />
        </Modal>
      </div>
    );
  };

  render() {
    const { data: { error, loading } } = this.props;
    return (
      <Card
        error={error}
        loading={loading}
        title="Users & Guests"
        button="Add"
        onClick={this.toggleAddUserModal}
        caption="No users online"
      >
        {this.renderContent()}
      </Card>
    );
  }
}

export default compose(graphql(UsersQuery), graphql(removeUser))(UserCard);