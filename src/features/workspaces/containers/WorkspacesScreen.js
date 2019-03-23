import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import WorkspacesDashboard from '../components/WorkspacesDashboard';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { workspaceStore } from '../index';
import { getUserWorkspacesRequest } from '../api';

@inject('actions') @observer
class WorkspacesScreen extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      workspace: PropTypes.shape({
        edit: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  render() {
    const { actions } = this.props;
    return (
      <ErrorBoundary>
        <WorkspacesDashboard
          workspaces={workspaceStore.workspaces}
          isLoadingWorkspaces={getUserWorkspacesRequest.isExecuting}
          onCreateWorkspaceSubmit={data => actions.workspaces.create(data)}
          onWorkspaceClick={w => actions.workspaces.edit({ workspace: w })}
        />
      </ErrorBoundary>
    );
  }
}

export default WorkspacesScreen;
