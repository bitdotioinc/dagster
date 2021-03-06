import {Colors, Icon, Menu, MenuItem, Popover, Spinner} from '@blueprintjs/core';
import React from 'react';
import {useHistory} from 'react-router';
import styled from 'styled-components/macro';

import {
  DagsterRepoOption,
  isRepositoryOptionEqual,
  useDagitExecutablePath,
} from 'src/DagsterRepositoryContext';
import {RepositoryInformation} from 'src/RepositoryInformation';
import {ReloadRepositoryLocationButton} from 'src/nav/ReloadRepositoryLocationButton';

interface RepositoryPickerProps {
  loading: boolean;
  options: DagsterRepoOption[];
  repo: DagsterRepoOption | null;
  setRepo: (repo: DagsterRepoOption) => void;
}

export const RepositoryPicker: React.FunctionComponent<RepositoryPickerProps> = ({
  loading,
  repo,
  setRepo,
  options,
}) => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const dagitExecutablePath = useDagitExecutablePath();

  const selectOption = (repo: DagsterRepoOption) => {
    setRepo(repo);
    history.push('/');
  };

  const titleContents = () => {
    if (repo) {
      return (
        <>
          {repo.repository.name}
          <Icon icon="caret-down" style={{opacity: 0.9, marginLeft: 3}} />
        </>
      );
    }

    if (loading) {
      return <Spinner size={16} />;
    }

    return <NoReposFound>No repositories found</NoReposFound>;
  };

  return (
    <Popover
      fill={true}
      isOpen={open}
      onInteraction={setOpen}
      minimal
      position={'bottom-left'}
      content={
        <Menu style={{minWidth: 280}}>
          {options.map((option, idx) => (
            <MenuItem
              key={idx}
              onClick={() => selectOption(option)}
              active={repo ? isRepositoryOptionEqual(repo, option) : false}
              icon={'git-repo'}
              text={
                <RepositoryInformation
                  repository={option.repository}
                  dagitExecutablePath={dagitExecutablePath}
                />
              }
            />
          ))}
        </Menu>
      }
    >
      <RepositoryPickerFlexContainer>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 10.5, color: Colors.GRAY1, userSelect: 'none'}}>REPOSITORY</div>
          <RepoTitle>{titleContents()}</RepoTitle>
        </div>
        {repo?.repositoryLocation.isReloadSupported && (
          <ReloadRepositoryLocationButton location={repo.repositoryLocation.name} />
        )}
      </RepositoryPickerFlexContainer>
    </Popover>
  );
};

const RepoTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
  display: flex;
  align-items: center;
  height: 19px;
`;

const RepositoryPickerFlexContainer = styled.div`
  border-bottom: 1px solid ${Colors.DARK_GRAY4};
  padding: 10px 10px;
  display: flex;
  align-items: center;
  cursor: default;
  &:hover {
    background: ${Colors.BLACK};
  }
`;

const NoReposFound = styled.div`
  color: ${Colors.GRAY3};
  font-size: 12px;
  margin-top: 8px;
`;
